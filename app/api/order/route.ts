
import { NextResponse } from "next/server";

const PRODUCTS = {
  1: { name: "Авторский торт", price: 180000 },
  2: { name: "Нежные пирожные", price: 65000 },
  3: { name: "Домашнее печенье", price: 45000 },
};

type ProductId = keyof typeof PRODUCTS;

const money = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " сум";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, phone, delivery, address, comment, payment, items } = body;

    if (
      !name ||
      !phone ||
      !delivery ||
      !payment ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { ok: false, error: "Заполните обязательные поля заказа" },
        { status: 400 }
      );
    }

    if (!["cash", "card", "transfer"].includes(payment)) {
      return NextResponse.json(
        { ok: false, error: "Неверный способ оплаты" },
        { status: 400 }
      );
    }

    if (delivery === "delivery" && !address) {
      return NextResponse.json(
        { ok: false, error: "Укажите адрес доставки" },
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
      const id = Number(item.id);
      const quantity = Number(item.quantity);

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
        existing.subtotal = existing.price * existing.quantity;

        if (existing.quantity > 50) {
          return NextResponse.json(
            { ok: false, error: "Максимум 50 единиц одного товара" },
            { status: 400 }
          );
        }
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
      card: "Картой",
      transfer: "Переводом",
    };

    const deliveryLabels: Record<string, string> = {
      delivery: "Доставка",
      pickup: "Самовывоз",
    };

    const lines = normalizedItems.map(
      (item) =>
        `• ${item.name}\n  ${item.quantity} шт. × ${money(item.price)} = ${money(item.subtotal)}`
    );

    const message = [
      "🛍️ НОВЫЙ ЗАКАЗ Qulupnay.uz",
      "",
      `👤 Имя: ${String(name)}`,
      `📞 Телефон: ${String(phone)}`,
      `🚚 Получение: ${deliveryLabels[delivery] ?? String(delivery)}`,
      ...(delivery === "delivery"
        ? [`📍 Адрес: ${String(address)}`]
        : []),
      "",
      "📦 СОСТАВ ЗАКАЗА:",
      ...lines,
      "",
      `💰 ИТОГО: ${money(total)}`,
      `💳 Оплата: ${paymentLabels[payment]}`,
      ...(comment ? [`📝 Комментарий: ${String(comment)}`] : []),
    ].join("\n");

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId =
      process.env.TELEGRAM_OWNER_CHAT_ID ??
      process.env.TELEGRAM_OWNER_CHATID ??
      process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Не настроены переменные Telegram в Vercel");

      return NextResponse.json(
        { ok: false, error: "Отправка заказов временно недоступна" },
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
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Ошибка отправки в Telegram:", telegramResult);

      return NextResponse.json(
        { ok: false, error: "Не удалось отправить заказ в Telegram" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Заказ успешно отправлен",
      total,
    });
  } catch (error) {
    console.error("Ошибка обработки заказа:", error);

    return NextResponse.json(
      { ok: false, error: "Ошибка обработки заказа" },
      { status: 500 }
    );
  }
}
