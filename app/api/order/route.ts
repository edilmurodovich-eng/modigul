
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

const PRODUCTS = {
  1: { name: "Nutella", price: 220000 },
  2: { name: "Chocoberry", price: 1500000 },
  3: { name: "Милка", price: 500000 },
  4: { name: "Блинный торт", price: 300000 },
  5: { name: "Банан в шоколаде", price: 400000 },
};

type ProductId = keyof typeof PRODUCTS;

type OrderStatus =
  | "new"
  | "accepted"
  | "preparing"
  | "courier"
  | "delivered";

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Ожидает подтверждения",
  accepted: "Заказ принят",
  preparing: "Готовится",
  courier: "Передан курьеру",
  delivered: "Доставлен",
};

const money = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " сум";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Не настроены переменные Supabase в Vercel");
  }

  return { url: url.replace(/\/$/, ""), key };
}

async function saveOrderToSupabase(order: {
  orderId: string;
  trackingToken: string;
  status: OrderStatus;
  name: string;
  phone: string;
  delivery: string;
  address: string;
  comment: string;
  payment: string;
  items: {
    id: ProductId;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
  total: number;
}) {
  const { url, key } = getSupabaseConfig();

  const response = await fetch(`${url}/rest/v1/orders`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      order_id: order.orderId,
      tracking_token: order.trackingToken,
      status: order.status,
      name: order.name,
      phone: order.phone,
      delivery: order.delivery,
      address: order.address,
      comment: order.comment,
      payment: order.payment,
      items: order.items,
      total: order.total,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Supabase save error:", error);
    throw new Error("Не удалось сохранить заказ в Supabase");
  }
}

async function deleteOrderFromSupabase(orderId: string) {
  const { url, key } = getSupabaseConfig();

  const response = await fetch(
    `${url}/rest/v1/orders?order_id=eq.${encodeURIComponent(orderId)}`,
    {
      method: "DELETE",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error(
      "Supabase delete error:",
      await response.text()
    );
  }
}

export async function POST(request: Request) {
  let savedOrderId: string | null = null;

  try {
    const body = await request.json();

    const { name, phone, delivery, address, comment, payment, items } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      !["delivery", "pickup"].includes(delivery) ||
      !["cash", "card", "transfer"].includes(payment) ||
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > Object.keys(PRODUCTS).length
    ) {
      return NextResponse.json(
        { ok: false, error: "Заполните обязательные поля заказа" },
        { status: 400 }
      );
    }

    if (
      delivery === "delivery" &&
      (typeof address !== "string" || !address.trim())
    ) {
      return NextResponse.json(
        { ok: false, error: "Укажите адрес доставки" },
        { status: 400 }
      );
    }

    if (comment !== undefined && typeof comment !== "string") {
      return NextResponse.json(
        { ok: false, error: "Некорректный комментарий" },
        { status: 400 }
      );
    }

    const normalizedItems: {
      id: ProductId;
      name: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const id = Number(item?.id);
      const quantity = Number(item?.quantity);

      if (
        !Number.isInteger(id) ||
        !Object.prototype.hasOwnProperty.call(PRODUCTS, id) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 50
      ) {
        return NextResponse.json(
          { ok: false, error: "Некорректный товар или количество" },
          { status: 400 }
        );
      }

      const productId = id as ProductId;
      const product = PRODUCTS[productId];

      const existing = normalizedItems.find(
        (entry) => entry.id === productId
      );

      if (existing) {
        existing.quantity += quantity;

        if (existing.quantity > 50) {
          return NextResponse.json(
            {
              ok: false,
              error: "Максимум 50 единиц одного товара",
            },
            { status: 400 }
          );
        }

        existing.subtotal = existing.price * existing.quantity;
      } else {
        normalizedItems.push({
          id: productId,
          name: product.name,
          price: product.price,
          quantity,
          subtotal: product.price * quantity,
        });
      }
    }

    const total = normalizedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const paymentLabels: Record<string, string> = {
      cash: "Наличными",
      card: "Картой при получении",
      transfer: "Перевод на карту",
    };

    const deliveryLabels: Record<string, string> = {
      delivery: "Доставка",
      pickup: "Самовывоз",
    };

    const orderId = randomBytes(6).toString("hex");
    const trackingToken = randomBytes(32).toString("hex");
    const status: OrderStatus = "new";

    const order = {
      orderId,
      trackingToken,
      status,
      statusLabel: STATUS_LABELS[status],
      createdAt: new Date().toISOString(),
      name: name.trim(),
      phone: phone.trim(),
      delivery,
      address: delivery === "delivery" ? address.trim() : "",
      comment: typeof comment === "string" ? comment.trim() : "",
      payment,
      items: normalizedItems,
      total,
    };

    // Сохраняем заказ в Supabase.
    await saveOrderToSupabase(order);
    savedOrderId = orderId;

    const lines = normalizedItems.map(
      (item) =>
        `• ${item.name}\n  ${item.quantity} шт. × ${money(item.price)} = ${money(item.subtotal)}`
    );

    const message = [
      "🛍️ НОВЫЙ ЗАКАЗ MODIGUL",
      "",
      `🆔 Заказ: ${orderId}`,
      `📌 Статус: ${STATUS_LABELS[status]}`,
      "",
      `👤 Имя: ${order.name}`,
      `📞 Телефон: ${order.phone}`,
      `🚚 Получение: ${deliveryLabels[delivery]}`,
      ...(delivery === "delivery"
        ? [`📍 Адрес: ${order.address}`]
        : []),
      "",
      "📦 СОСТАВ ЗАКАЗА:",
      ...lines,
      "",
      `💰 ИТОГО: ${money(total)}`,
      `💳 Оплата: ${paymentLabels[payment]}`,
      ...(order.comment ? [`📝 Комментарий: ${order.comment}`] : []),
      "",
      "Измените статус кнопками ниже.",
    ].join("\n");

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId =
      process.env.TELEGRAM_OWNER_CHAT_ID ??
      process.env.TELEGRAM_OWNER_CHATID ??
      process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Не настроены переменные Telegram в Vercel");

      await deleteOrderFromSupabase(orderId);
      savedOrderId = null;

      return NextResponse.json(
        {
          ok: false,
          error: "Отправка заказов временно недоступна",
        },
        { status: 500 }
      );
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✅ Заказ принят",
                  callback_data: `status:${orderId}:accepted`,
                },
                {
                  text: "👨‍🍳 Готовится",
                  callback_data: `status:${orderId}:preparing`,
                },
              ],
              [
                {
                  text: "🛵 Передан курьеру",
                  callback_data: `status:${orderId}:courier`,
                },
                {
                  text: "🎉 Доставлен",
                  callback_data: `status:${orderId}:delivered`,
                },
              ],
            ],
          },
        }),
        cache: "no-store",
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Ошибка отправки в Telegram:", telegramResult);

      await deleteOrderFromSupabase(orderId);
      savedOrderId = null;

      return NextResponse.json(
        {
          ok: false,
          error: "Не удалось отправить заказ в Telegram",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Заказ успешно отправлен",
      total,
      orderId,
      trackingToken,
      status,
      statusLabel: STATUS_LABELS[status],
    });
  } catch (error) {
    console.error("Ошибка обработки заказа:", error);

    if (savedOrderId) {
      await deleteOrderFromSupabase(savedOrderId);
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Неизвестная ошибка",
      },
      { status: 500 }
    );
  }
}
