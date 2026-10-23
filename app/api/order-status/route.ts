
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function redisGet(key: string) {
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
    body: JSON.stringify(["GET", key]),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok || result.error) {
    throw new Error("Ошибка чтения заказа из KV");
  }

  return result.result;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const trackingToken = searchParams.get("token");

    if (
      !orderId ||
      !/^[a-f0-9]{12}$/.test(orderId) ||
      !trackingToken ||
      !/^[a-f0-9]{64}$/.test(trackingToken)
    ) {
      return NextResponse.json(
        { ok: false, error: "Некорректные данные заказа" },
        { status: 400 }
      );
    }

    const saved = await redisGet(`bakery:order:${orderId}`);

    if (typeof saved !== "string") {
      return NextResponse.json(
        { ok: false, error: "Заказ не найден" },
        { status: 404 }
      );
    }

    const order = JSON.parse(saved);

    if (order.trackingToken !== trackingToken) {
      return NextResponse.json(
        { ok: false, error: "Заказ не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        orderId: order.orderId,
        status: order.status,
        statusLabel: order.statusLabel,
        updatedAt: order.updatedAt ?? order.createdAt,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Ошибка проверки статуса:", error);

    return NextResponse.json(
      { ok: false, error: "Не удалось проверить статус заказа" },
      { status: 500 }
    );
  }
}
