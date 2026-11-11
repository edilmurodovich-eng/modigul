
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  accepted: "Заказ принят",
  preparing: "Готовится",
  courier: "Передан курьеру",
  delivered: "Доставлен",
};

async function telegramCall(
  botToken: string,
  method: string,
  payload: Record<string, unknown>
) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.ok) {
    console.error(`Telegram ${method} error:`, result);
    throw new Error(`Telegram ${method} failed`);
  }

  return result.result;
}

async function answerCallbackSafely(
  botToken: string,
  callbackId: string,
  text?: string,
  showAlert = false
) {
  try {
    await telegramCall(botToken, "answerCallbackQuery", {
      callback_query_id: callbackId,
      ...(text ? { text } : {}),
      ...(showAlert ? { show_alert: true } : {}),
    });
  } catch (error) {
    console.warn(
      "Не удалось подтвердить нажатие кнопки:",
      error
    );
  }
}

async function updateOrderStatus(
  orderId: string,
  status: string
) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Не настроен Supabase");
  }

  const response = await fetch(
    `${url.replace(/\/$/, "")}/rest/v1/orders?order_id=eq.${encodeURIComponent(orderId)}&select=order_id`,
    {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error(
      "Supabase update error:",
      await response.text()
    );
    throw new Error("Не удалось обновить статус в Supabase");
  }

  const updated = await response.json();

  if (!Array.isArray(updated) || updated.length === 0) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get(
    "x-telegram-bot-api-secret-token"
  );

  if (
    !expectedSecret ||
    !receivedSecret ||
    receivedSecret !== expectedSecret
  ) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const update = await request.json();
    const callback = update.callback_query;

    if (!callback) {
      return NextResponse.json({ ok: true });
    }

    const callbackId = callback.id;
    const data = callback.data;
    const message = callback.message;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const configuredChatId =
      process.env.TELEGRAM_OWNER_CHAT_ID ??
      process.env.TELEGRAM_OWNER_CHATID ??
      process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !configuredChatId) {
      throw new Error("Не настроены переменные Telegram");
    }

    await answerCallbackSafely(botToken, callbackId);

    const messageChatId = message?.chat?.id;

    if (
      !message ||
      String(messageChatId) !== String(configuredChatId)
    ) {
      console.warn("Нажатие кнопки вне чата управления заказами");
      return NextResponse.json({ ok: true });
    }

    const match =
      typeof data === "string"
        ? /^status:([a-f0-9]{12}):(accepted|preparing|courier|delivered)$/.exec(
            data
          )
        : null;

    if (!match) {
      console.warn("Получена неизвестная команда кнопки");
      return NextResponse.json({ ok: true });
    }

    const orderId = match[1];
    const status = match[2];

    const updated = await updateOrderStatus(orderId, status);

    if (!updated) {
      await answerCallbackSafely(
        botToken,
        callbackId,
        "Заказ не найден.",
        true
      );

      return NextResponse.json({ ok: true });
    }

    const oldText =
      typeof message.text === "string" ? message.text : "";

    const statusLine = `📌 Статус: ${STATUS_LABELS[status]}`;

    const newText = /📌 Статус: .*/.test(oldText)
      ? oldText.replace(/📌 Статус: .*/, statusLine)
      : `${oldText}\n\n${statusLine}`;

    try {
      await telegramCall(botToken, "editMessageText", {
        chat_id: messageChatId,
        message_id: message.message_id,
        text: newText,
        reply_markup: message.reply_markup,
      });
    } catch (error) {
      console.error(
        "Статус сохранён в Supabase, но сообщение Telegram не обновлено:",
        error
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Ошибка Telegram webhook:", error);

    return NextResponse.json(
      { ok: false, error: "Ошибка обработки обновления" },
      { status: 500 }
    );
  }
}
