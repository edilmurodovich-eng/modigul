

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const action = searchParams.get("action") || "set";

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!secret || !key || key !== secret) {
    return NextResponse.json(
      { ok: false, error: "Доступ запрещён" },
      { status: 401 }
    );
  }

  if (!botToken) {
    return NextResponse.json(
      { ok: false, error: "Не настроен TELEGRAM_BOT_TOKEN" },
      { status: 500 }
    );
  }

  try {
    const method =
      action === "info" ? "getWebhookInfo" : "setWebhook";

    const body =
      action === "info"
        ? undefined
        : JSON.stringify({
            url: "https://qulupnayuz-yqxj.vercel.app/api/telegram-webhook",
            secret_token: secret,
            allowed_updates: ["callback_query"],
          });

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/${method}`,
      {
        method: action === "info" ? "GET" : "POST",
        headers: { "Content-Type": "application/json" },
        body,
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: "Telegram отклонил запрос" },
        { status: 502 }
      );
    }

    if (action === "info") {
      return NextResponse.json({
        ok: true,
        webhook: {
          url: result.result?.url,
          pending_update_count: result.result?.pending_update_count,
          last_error_date: result.result?.last_error_date,
          last_error_message: result.result?.last_error_message,
          allowed_updates: result.result?.allowed_updates,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      description: result.description ?? "Webhook настроен",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось связаться с Telegram" },
      { status: 502 }
    );
  }
}
