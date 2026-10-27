
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
const STATUS_LABELS: Record<string, string> = {
  accepted: "Заказ принят",
  preparing: "Готовится",
  courier: "Передан курьеру",
  delivered: "Доставлен",
};
async function redisCommand(command: string[]) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error("KV не настроен");
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok || result.error) {
    console.error("Redis/KV error:", result);
    throw new Error("Ошибка Redis/KV");
  }
  return result.result;
}
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
// A callback may expire. Its failure must not break order processing.
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
      "Не удалось подтвердить нажатие кнопки; продолжаем обработку:",
      error
    );
  }
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
    // Acknowledge immediately, before Redis operations.
    // Expired callback acknowledgements are intentionally ignored.
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
    const key = `bakery:order:${orderId}`;
    const saved = await redisCommand(["GET", key]);
    if (typeof saved !== "string") {
      await answerCallbackSafely(
        botToken,
        callbackId,
        "Заказ не найден или срок его хранения истёк.",
        true
      );
      return NextResponse.json({ ok: true });
    }
    const order = JSON.parse(saved);
    if (order.orderId !== orderId) {
      throw new Error("Несовпадение номера заказа");
    }
    order.status = status;
    order.statusLabel = STATUS_LABELS[status];
    order.updatedAt = new Date().toISOString();
    await redisCommand([
      "SET",
      key,
      JSON.stringify(order),
      "EX",
      "2592000",
    ]);
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
      // Redis has already been updated. Log Telegram display errors
      // separately so they don't hide the saved order status.
      console.error(
        "Статус заказа сохранён, но сообщение Telegram не обновлено:",
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
