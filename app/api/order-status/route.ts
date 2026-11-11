
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  new: "Ожидает подтверждения",
  accepted: "Заказ принят",
  preparing: "Готовится",
  courier: "Передан курьеру",
  delivered: "Доставлен",
};

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

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error("Не настроен Supabase");
    }

    const response = await fetch(
      `${url.replace(/\/$/, "")}/rest/v1/orders?order_id=eq.${encodeURIComponent(orderId)}&tracking_token=eq.${encodeURIComponent(trackingToken)}&select=order_id,status,created_at`,
      {
        method: "GET",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Supabase status error:",
        await response.text()
      );
      throw new Error("Ошибка чтения заказа из Supabase");
    }

    const orders = await response.json();

    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Заказ не найден" },
        { status: 404 }
      );
    }

    const order = orders[0];

    return NextResponse.json(
      {
        ok: true,
        orderId: order.order_id,
        status: order.status,
        statusLabel:
          STATUS_LABELS[order.status] ??
          "Статус обновлён",
        updatedAt: order.created_at,
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
      {
        ok: false,
        error: "Не удалось проверить статус заказа",
      },
      { status: 500 }
    );
  }
}
