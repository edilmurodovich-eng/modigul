
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type OrderItem = {
  id: number;
  quantity: number;
};

type OrderRequest = {
  name?: string;
  phone?: string;
  delivery?: "delivery" | "pickup";
  address?: string;
  comment?: string;
  items?: OrderItem[];
};

const PRODUCTS = [
  { id: 1, name: "Классика", price: 120000 },
  { id: 2, name: "Премиум", price: 180000 },
  { id: 3, name: "VIP", price: 230000 },
];

const money = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " сум";

export async function POST(request: Request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_OWNER_CHAT_ID;

    if (!token || !chatId) {
      console.error("Telegram environment variables are missing");
      return NextResponse.json(
        { ok: false, error: "Сервис заказов пока не настроен." },
        { status: 503 }
      );
    }

    const body = (await request.json()) as OrderRequest;

    const name = body.name?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const delivery = body.delivery;
    const address = body.address?.trim() ?? "";
    const comment = body.comment?.trim() ?? "";

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json(
        { ok: false, error: "Укажите имя (от 2 до 80 символов)." },
        { status: 400 }
      );
    }

    if (!/^[+()\d\s-]{7,25}$/.test(phone)) {
      return NextResponse.json(
        { ok: false, error: "Проверьте номер телефона." },
        { status: 400 }
      );
    }

    if (delivery !== "delivery" && delivery !== "pickup") {
      return NextResponse.json(
        { ok: false, error: "Выберите доставку или самовывоз." },
        { status: 400 }
      );
    }

    if (delivery === "delivery" && address.length < 5) {
      return NextResponse.json(
        { ok: false, error: "Укажите адрес доставки." },
        { status: 400 }
      );
    }

    if (address.length > 300 || comment.length > 500) {
      return NextResponse.json(
        { ok: false, error: "Слишком длинный адрес или комментарий." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0 ||
      body.items.length > PRODUCTS.length
    ) {
      return NextResponse.json(
        { ok: false, error: "Корзина пуста или содержит неверные товары." },
        { status: 400 }
      );
    }

    const quantities = new Map<number, number>();

    for (const item of body.items) {
      if (
        !Number.isInteger(item.id) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 50 ||
        !PRODUCTS.some((product) => product.id === item.id) ||
        quantities.has(item.id)
      ) {
        return NextResponse.json(
          { ok: false, error: "Проверьте товары в корзине." },
          { status: 400 }
        );
      }

      quantities.set(item.id, item.quantity);
    }

    const items = PRODUCTS.filter((product) =>
      quantities.has(product.id)
    ).map((product) => ({
      ...product,
      quantity: quantities.get(product.id)!,
    }));

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const lines = [
      "🍓 НОВЫЙ ЗАКАЗ — QULUPNAY.UZ",
      "",
      ...items.map(
        (item) =>
          `• ${item.name} × ${item.quantity} — ${money(item.price * item.quantity)}`
      ),
      "",
      `💰 Итого: ${money(total)}`,
      "",
      `👤 Имя: ${name}`,
      `📞 Телефон: ${phone}`,
      `🚚 Получение: ${delivery === "delivery" ? "Доставка" : "Самовывоз"}`,
      ...(delivery === "delivery" ? [`📍 Адрес: ${address}`] : []),
      ...(comment ? [`💬 Комментарий: ${comment}`] : []),
    ];

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
        }),
        signal: AbortSignal.timeout(10000),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error("Telegram rejected an order notification");
      return NextResponse.json(
        { ok: false, error: "Не удалось отправить заказ. Попробуйте позже." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Order request failed", error);
    return NextResponse.json(
      { ok: false, error: "Ошибка обработки заказа. Попробуйте позже." },
      { status: 500 }
    );
  }
}
