
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const key = searchParams.get("key");

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
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: "https://qulupnayuz-yqxj.vercel.app/⁠",
          secret_token: secret,
          allowed_updates: ["callback_query"],
        }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    return NextResponse.json({
      ok: result.ok === true,
      description: result.description ?? "Ответ Telegram получен",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Не удалось связаться с Telegram" },
      { status: 502 }
    );
  }
}
