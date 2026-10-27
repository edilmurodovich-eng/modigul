
"use client";

import { useEffect, useMemo, useState } from "react";

type Language = "ru" | "uz";
type ProductId = 1 | 2 | 3;
type Delivery = "delivery" | "pickup";
type Payment = "cash" | "card" | "transfer";

type Product = {
  id: ProductId;
  name: string;
  description: string;
  price: number;
  image: string;
};

type CartItem = {
  id: number;
  quantity: number;
};

type TrackedOrder = {
  orderId: string;
  trackingToken: string;
  status: string;
  statusLabel: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Авторский торт",
    description: "Нежный десерт для особенных моментов",
    price: 180000,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Нежные пирожные",
    description: "Свежие пирожные с нежным кремом",
    price: 65000,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Домашнее печенье",
    description: "Рассыпчатое печенье к чаю",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85",
  },
];

const translations = {
  ru: {
    home: "Главная",
    catalog: "Каталог",
    order: "Заказать",
    cart: "Корзина",
    eyebrow: "СВЕЖАЯ ВЫПЕЧКА · С ЗАБОТОЙ",
    hero1: "Вкус, который",
    hero2: "делает день",
    hero3: "особенным",
    heroDescription:
      "Домашняя выпечка, нежные десерты и сладкие моменты для вас и ваших близких.",
    chooseDessert: "Выбрать десерт",
    fresh: "Свежая выпечка",
    freshDescription: "Готовим с заботой о качестве",
    love: "С любовью",
    loveDescription: "Внимание к каждой детали",
    convenient: "Удобный заказ",
    convenientDescription: "Доставка или самовывоз",
    collection: "НАША КОЛЛЕКЦИЯ",
    chooseSweet: "Выберите свою сладость",
    collectionDescription:
      "Найдите любимый десерт для уютного дня или особенного события.",
    dessertCount: "десерта",
    addToCart: "Добавить",
    cartTitle: "Ваша корзина",
    pieces: "шт.",
    emptyCart: "Корзина пока пуста. Выберите десерт в каталоге.",
    total: "Итого",
    orderEyebrow: "ВАШ СЛАДКИЙ ЗАКАЗ",
    orderTitle: "Пусть будет вкусно",
    orderDescription:
      "Заполните данные, выберите способ получения и оплаты. Мы свяжемся с вами для подтверждения заказа.",
    contact: "Контактные данные",
    contactDescription: "Как с вами связаться?",
    yourName: "Ваше имя",
    namePlaceholder: "Введите ваше имя",
    phone: "Номер телефона",
    deliveryMethod: "Способ получения",
    deliveryDescription: "Как вам будет удобнее?",
    delivery: "Доставка",
    deliveryDetails: "До указанного адреса",
    pickup: "Самовывоз",
    pickupDetails: "Забрать самостоятельно",
    address: "Адрес доставки",
    addressPlaceholder: "Улица, дом, квартира",
    comment: "Комментарий к заказу",
    optional: "Необязательно",
    commentPlaceholder: "Пожелания к заказу...",
    paymentMethod: "Способ оплаты",
    paymentDescription: "Выберите удобный вариант",
    cash: "Наличными",
    cashDescription: "Оплата наличными при получении",
    card: "Картой при получении",
    cardDescription: "Оплата картой при получении заказа",
    transfer: "Перевод на карту",
    transferDescription: "Перевод по реквизитам для оплаты",
    toPay: "К оплате",
    sending: "Отправляем заказ...",
    submit: "Оформить заказ",
    footnote:
      "Нажимая кнопку, вы отправляете данные для оформления заказа.",
    tracking: "Статус вашего заказа",
    currentStatus: "Текущий статус:",
    deliveredThanks: "Спасибо за заказ! Будем рады видеть вас снова.",
    trackingError:
      "Не удалось обновить статус. Повторная проверка через 5 секунд.",
    addProducts: "Сначала добавьте товары в корзину.",
    invalidPhone: "Введите полный номер телефона в формате +998.",
    enterAddress: "Укажите адрес доставки.",
    sendError: "Не удалось отправить заказ. Попробуйте ещё раз.",
    trackingMissing:
      "Заказ отправлен, но данные отслеживания не получены. Свяжитесь с нами для уточнения статуса.",
    orderSent: "Заказ отправлен! Ниже вы можете отслеживать его статус.",
    statusUpdated: "Статус обновлён",
    new: "Ожидает подтверждения",
    accepted: "Заказ принят",
    preparing: "Готовится",
    courier: "Передан курьеру",
    delivered: "Доставлен",
    language: "Язык сайта",
  },
  uz: {
    home: "Bosh sahifa",
    catalog: "Mahsulotlar",
    order: "Buyurtma",
    cart: "Savat",
    eyebrow: "YANGI PISHIRILGAN · MEHR BILAN",
    hero1: "Kuningizga",
    hero2: "o‘zgacha ta’m",
    hero3: "bag‘ishlaymiz",
    heroDescription:
      "Siz va yaqinlaringiz uchun uy pishiriqlari, nafis shirinliklar va yoqimli lahzalar.",
    chooseDessert: "Shirinlik tanlash",
    fresh: "Yangi pishiriqlar",
    freshDescription: "Sifatga e’tibor bilan tayyorlaymiz",
    love: "Mehr bilan",
    loveDescription: "Har bir detalga e’tibor",
    convenient: "Qulay buyurtma",
    convenientDescription: "Yetkazib berish yoki olib ketish",
    collection: "BIZNING TO‘PLAM",
    chooseSweet: "Shirinligingizni tanlang",
    collectionDescription:
      "Yoqimli kun yoki alohida bayram uchun sevimli shirinligingizni tanlang.",
    dessertCount: "ta shirinlik",
    addToCart: "Qo‘shish",
    cartTitle: "Savatingiz",
    pieces: "dona",
    emptyCart: "Savatingiz hozircha bo‘sh. Katalogdan shirinlik tanlang.",
    total: "Jami",
    orderEyebrow: "SIZNING SHIRIN BUYURTMANGIZ",
    orderTitle: "Mazali lahzalar siz uchun",
    orderDescription:
      "Ma’lumotlaringizni kiriting, yetkazib berish va to‘lov usulini tanlang. Buyurtmani tasdiqlash uchun siz bilan bog‘lanamiz.",
    contact: "Aloqa ma’lumotlari",
    contactDescription: "Siz bilan qanday bog‘lanamiz?",
    yourName: "Ismingiz",
    namePlaceholder: "Ismingizni kiriting",
    phone: "Telefon raqami",
    deliveryMethod: "Qabul qilish usuli",
    deliveryDescription: "Qaysi usul sizga qulay?",
    delivery: "Yetkazib berish",
    deliveryDetails: "Ko‘rsatilgan manzilga",
    pickup: "O‘zingiz olib ketasiz",
    pickupDetails: "Buyurtmani o‘zingiz olib ketasiz",
    address: "Yetkazib berish manzili",
    addressPlaceholder: "Ko‘cha, uy, xonadon",
    comment: "Buyurtma uchun izoh",
    optional: "Ixtiyoriy",
    commentPlaceholder: "Buyurtma bo‘yicha istaklaringiz...",
    paymentMethod: "To‘lov usuli",
    paymentDescription: "O‘zingizga qulay usulni tanlang",
    cash: "Naqd pul",
    cashDescription: "Buyurtmani olganda naqd to‘lov",
    card: "Karta orqali",
    cardDescription: "Buyurtmani olganda karta orqali to‘lov",
    transfer: "Kartaga pul o‘tkazish",
    transferDescription: "To‘lov uchun karta rekvizitlari orqali o‘tkazma",
    toPay: "To‘lanadi",
    sending: "Buyurtma yuborilmoqda...",
    submit: "Buyurtma berish",
    footnote:
      "Tugmani bosish orqali buyurtmani rasmiylashtirish uchun ma’lumotlarni yuborasiz.",
    tracking: "Buyurtmangiz holati",
    currentStatus: "Joriy holati:",
    deliveredThanks:
      "Buyurtmangiz uchun rahmat! Sizni yana kutib qolamiz.",
    trackingError:
      "Holatni yangilab bo‘lmadi. 5 soniyadan so‘ng qayta tekshiriladi.",
    addProducts: "Avval savatga mahsulot qo‘shing.",
    invalidPhone: "+998 formatida to‘liq telefon raqamini kiriting.",
    enterAddress: "Yetkazib berish manzilini kiriting.",
    sendError: "Buyurtmani yuborib bo‘lmadi. Qayta urinib ko‘ring.",
    trackingMissing:
      "Buyurtma yuborildi, lekin kuzatish ma’lumotlari olinmadi. Holatni aniqlash uchun biz bilan bog‘laning.",
    orderSent:
      "Buyurtma yuborildi! Quyida uning holatini kuzatishingiz mumkin.",
    statusUpdated: "Holat yangilandi",
    new: "Tasdiqlanishi kutilmoqda",
    accepted: "Buyurtma qabul qilindi",
    preparing: "Tayyorlanmoqda",
    courier: "Kuryerga topshirildi",
    delivered: "Yetkazib berildi",
    language: "Sayt tili",
  },
} as const;

const productTranslations = {
  ru: {
    1: {
      name: "Авторский торт",
      description: "Нежный десерт для особенных моментов",
    },
    2: {
      name: "Нежные пирожные",
      description: "Свежие пирожные с нежным кремом",
    },
    3: {
      name: "Домашнее печенье",
      description: "Рассыпчатое печенье к чаю",
    },
  },
  uz: {
    1: {
      name: "Maxsus tort",
      description: "Unutilmas lahzalar uchun nafis shirinlik",
    },
    2: {
      name: "Nafis pirojniylar",
      description: "Yumshoq kremli yangi pirojniylar",
    },
    3: {
      name: "Uy pechenyesi",
      description: "Choy uchun mazali, uvalanuvchan pechenye",
    },
  },
};

const statusLabels: Record<Language, Record<string, string>> = {
  ru: {
    new: "Ожидает подтверждения",
    accepted: "Заказ принят",
    preparing: "Готовится",
    courier: "Передан курьеру",
    delivered: "Доставлен",
  },
  uz: {
    new: "Tasdiqlanishi kutilmoqda",
    accepted: "Buyurtma qabul qilindi",
    preparing: "Tayyorlanmoqda",
    courier: "Kuryerga topshirildi",
    delivered: "Yetkazib berildi",
  },
};

function formatPrice(price: number, language: Language) {
  return `${price.toLocaleString(language === "ru" ? "ru-RU" : "uz-UZ")} so‘m`;
}

function PaymentIcon({ type }: { type: Payment }) {
  if (type === "cash") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 9h.01M18 15h.01" />
      </svg>
    );
  }

  if (type === "card") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h6M9 17h6M12 10v4M10 12h4" />
    </svg>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("ru");
  const [languageReady, setLanguageReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [delivery, setDelivery] = useState<Delivery>("delivery");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [payment, setPayment] = useState<Payment>("cash");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeError, setNoticeError] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);
  const [trackingError, setTrackingError] = useState("");

  const t = translations[language];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("qulupnay-language");
      if (saved === "ru" || saved === "uz") setLanguage(saved);
    } catch {
      // Saqlash mavjud bo‘lmasa ham sayt ishlaydi.
    }
    setLanguageReady(true);
  }, []);

  useEffect(() => {
    if (!languageReady) return;
    try {
      localStorage.setItem("qulupnay-language", language);
    } catch {
      // Til tanlovi joriy sessiyada ishlashda davom etadi.
    }
  }, [language, languageReady]);

  const localizedProducts = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        ...productTranslations[language][product.id],
      })),
    [language]
  );

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = localizedProducts.find((p) => p.id === item.id);
          return product ? { ...product, quantity: item.quantity } : null;
        })
        .filter(
          (item): item is Product & { quantity: number } => item !== null
        ),
    [cart, localizedProducts]
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!trackedOrder) return;

    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const checkStatus = async () => {
      try {
        const params = new URLSearchParams({
          orderId: trackedOrder.orderId,
          token: trackedOrder.trackingToken,
        });

        const response = await fetch(
          `/api/order-status?${params.toString()}`,
          { cache: "no-store" }
        );
        const data = await response.json();

        if (!response.ok || !data.ok) throw new Error("Status error");

        if (active) {
          setTrackedOrder((current) => {
            if (!current || current.orderId !== data.orderId) return current;
            return {
              ...current,
              status: data.status,
              statusLabel:
                statusLabels[language][data.status] || t.statusUpdated,
            };
          });
          setTrackingError("");
        }
      } catch {
        if (active) setTrackingError(t.trackingError);
      } finally {
        if (active) timer = setTimeout(checkStatus, 5000);
      }
    };

    void checkStatus();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [
    trackedOrder?.orderId,
    trackedOrder?.trackingToken,
    language,
    t.trackingError,
    t.statusUpdated,
  ]);

  function addToCart(id: number) {
    setNotice("");
    setCart((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(50, item.quantity + 1) }
            : item
        );
      }
      return [...current, { id, quantity: 1 }];
    });
  }

  function changeQuantity(id: number, change: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(50, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "");
    let national = digits.startsWith("998") ? digits.slice(3) : digits;
    national = national.slice(0, 9);

    let formatted = "+998";
    if (national.length > 0) formatted += " " + national.slice(0, 2);
    if (national.length > 2) formatted += " " + national.slice(2, 5);
    if (national.length > 5) formatted += " " + national.slice(5, 7);
    if (national.length > 7) formatted += " " + national.slice(7, 9);
    setPhone(formatted);
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setNoticeError(false);

    if (cartItems.length === 0) {
      setNotice(t.addProducts);
      setNoticeError(true);
      return;
    }

    if (phone.replace(/\D/g, "").length !== 12) {
      setNotice(t.invalidPhone);
      setNoticeError(true);
      return;
    }

    if (delivery === "delivery" && !address.trim()) {
      setNotice(t.enterAddress);
      setNoticeError(true);
      return;
    }

    const paymentLabels: Record<Payment, string> = {
      cash: t.cash,
      card: t.card,
      transfer: t.transfer,
    };

    setSending(true);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          delivery,
          address: delivery === "delivery" ? address.trim() : "",
          comment: comment.trim(),
          payment,
          paymentLabel: paymentLabels[payment],
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(
          language === "ru" ? data.error || t.sendError : t.sendError
        );
      }

      if (!data.orderId || !data.trackingToken) {
        throw new Error(t.trackingMissing);
      }

      setTrackedOrder({
        orderId: data.orderId,
        trackingToken: data.trackingToken,
        status: data.status ?? "new",
        statusLabel: statusLabels[language][data.status ?? "new"] || t.new,
      });

      setNotice(t.orderSent);
      setNoticeError(false);
      setCart([]);
      setName("");
      setPhone("+998 ");
      setAddress("");
      setComment("");
      setPayment("cash");
      setDelivery("delivery");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : t.sendError);
      setNoticeError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Qulupnay.uz Bakery">
          <span className="brand-name">Qulupnay.uz</span>
          <span className="brand-subtitle">· BAKERY ·</span>
        </a>

        <nav className="main-nav" aria-label={t.home}>
          <a href="#home">{t.home}</a>
          <a href="#catalog">{t.catalog}</a>
          <a href="#order">{t.order}</a>
        </nav>

        <div className="header-actions">
          <div className="language-switch" role="group" aria-label={t.language}>
            <button
              type="button"
              className={`language-button ${language === "ru" ? "active" : ""}`}
              onClick={() => setLanguage("ru")}
              aria-pressed={language === "ru"}
              aria-label="Русский язык"
            >
              🇷🇺 RU
            </button>
            <button
              type="button"
              className={`language-button ${language === "uz" ? "active" : ""}`}
              onClick={() => setLanguage("uz")}
              aria-pressed={language === "uz"}
              aria-label="O‘zbek tili"
            >
              🇺🇿 UZ
            </button>
          </div>

          <a className="header-cart" href="#order">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span>{t.cart}</span>
            <span className="cart-badge">{cartCount}</span>
          </a>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>
            {t.hero1}
            <br />
            {t.hero2}
            <br />
            <span>{t.hero3}</span>
          </h1>
          <p className="hero-description">{t.heroDescription}</p>
          <a className="button button-primary" href="#catalog">
            {t.chooseDessert} <span aria-hidden="true">→</span>
          </a>
          <div className="hero-note">
            <span className="note-star">✦</span>
            {t.fresh}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-frame">
            <img src={products[0].image} alt={localizedProducts[0].name} />
          </div>
        </div>
      </section>

      <section className="features" aria-label={t.fresh}>
        <article className="feature">
          <span className="feature-symbol">✧</span>
          <div>
            <h3>{t.fresh}</h3>
            <p>{t.freshDescription}</p>
          </div>
        </article>
        <article className="feature">
          <span className="feature-symbol">♡</span>
          <div>
            <h3>{t.love}</h3>
            <p>{t.loveDescription}</p>
          </div>
        </article>
        <article className="feature">
          <span className="feature-symbol">⌂</span>
          <div>
            <h3>{t.convenient}</h3>
            <p>{t.convenientDescription}</p>
          </div>
        </article>
      </section>

      <section className="catalog section" id="catalog">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.collection}</p>
            <h2>{t.chooseSweet}</h2>
            <p className="section-description">{t.collectionDescription}</p>
          </div>
          <span className="catalog-count">
            {products.length} {t.dessertCount}
          </span>
        </div>

        <div className="product-grid">
          {localizedProducts.map((product) => {
            const quantity =
              cart.find((item) => item.id === product.id)?.quantity ?? 0;

            return (
              <article className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span className="product-number">
                    {String(product.id).padStart(2, "0")}
                  </span>
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-bottom">
                    <strong className="product-price">
                      {formatPrice(product.price, language)}
                    </strong>

                    {quantity === 0 ? (
                      <button
                        className="add-button"
                        type="button"
                        onClick={() => addToCart(product.id)}
                        aria-label={`${t.addToCart}: ${product.name}`}
                      >
                        <span>+</span>
                      </button>
                    ) : (
                      <div
                        className="quantity-control"
                        aria-label={`${t.cart}: ${quantity}`}
                      >
                        <button
                          type="button"
                          onClick={() => changeQuantity(product.id, -1)}
                          aria-label="Уменьшить количество"
                        >
                          −
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          onClick={() => addToCart(product.id)}
                          disabled={quantity >= 50}
                          aria-label="Увеличить количество"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="order-section section" id="order">
        <div className="order-intro">
          <p className="eyebrow">{t.orderEyebrow}</p>
          <h2>{t.orderTitle}</h2>
          <p>{t.orderDescription}</p>

          <div className="order-summary">
            <div className="summary-title">
              <h3>{t.cartTitle}</h3>
              <span>
                {cartCount} {t.pieces}
              </span>
            </div>

            {cartItems.length === 0 ? (
              <p className="empty-cart">{t.emptyCart}</p>
            ) : (
              <div className="cart-list">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-info">
                      <strong>{item.name}</strong>
                      <span>
                        {formatPrice(item.price, language)} × {item.quantity}
                      </span>
                    </div>
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, -1)}
                        aria-label="Уменьшить количество"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => addToCart(item.id)}
                        disabled={item.quantity >= 50}
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="summary-total">
              <span>{t.total}</span>
              <strong>{formatPrice(total, language)}</strong>
            </div>
          </div>
        </div>

        <form className="order-form" onSubmit={submitOrder}>
          <div className="form-heading">
            <span className="form-step">01</span>
            <div>
              <h3>{t.contact}</h3>
              <p>{t.contactDescription}</p>
            </div>
          </div>

          <label className="field-label" htmlFor="customer-name">
            {t.yourName}
          </label>
          <input
            id="customer-name"
            name="name"
            type="text"
            placeholder={t.namePlaceholder}
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />

          <label className="field-label" htmlFor="customer-phone">
            {t.phone}
          </label>
          <input
            id="customer-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={(event) => handlePhoneChange(event.target.value)}
            autoComplete="tel"
            required
          />

          <div className="form-divider" />

          <div className="form-heading">
            <span className="form-step">02</span>
            <div>
              <h3>{t.deliveryMethod}</h3>
              <p>{t.deliveryDescription}</p>
            </div>
          </div>

          <div className="delivery-options">
            <label
              className={`delivery-choice ${delivery === "delivery" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="delivery"
                value="delivery"
                checked={delivery === "delivery"}
                onChange={() => setDelivery("delivery")}
              />
              <span className="delivery-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
                  <circle cx="7" cy="19" r="2" />
                  <circle cx="18" cy="19" r="2" />
                </svg>
              </span>
              <span className="delivery-text">
                <strong>{t.delivery}</strong>
                <small>{t.deliveryDetails}</small>
              </span>
              <span className="delivery-check" aria-hidden="true">✓</span>
            </label>

            <label
              className={`delivery-choice ${delivery === "pickup" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="delivery"
                value="pickup"
                checked={delivery === "pickup"}
                onChange={() => setDelivery("pickup")}
              />
              <span className="delivery-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M3 10h18l-2-6H5zM5 10v10h14V10M9 20v-6h6v6" />
                </svg>
              </span>
              <span className="delivery-text">
                <strong>{t.pickup}</strong>
                <small>{t.pickupDetails}</small>
              </span>
              <span className="delivery-check" aria-hidden="true">✓</span>
            </label>
          </div>

          {delivery === "delivery" && (
            <>
              <label className="field-label" htmlFor="customer-address">
                {t.address}
              </label>
              <input
                id="customer-address"
                name="address"
                type="text"
                placeholder={t.addressPlaceholder}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                autoComplete="street-address"
                required
              />
            </>
          )}

          <label className="field-label" htmlFor="customer-comment">
            {t.comment}
            <span className="optional-label">{t.optional}</span>
          </label>
          <textarea
            id="customer-comment"
            name="comment"
            placeholder={t.commentPlaceholder}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={3}
          />

          <div className="form-divider" />

          <div className="form-heading">
            <span className="form-step">03</span>
            <div>
              <h3>{t.paymentMethod}</h3>
              <p>{t.paymentDescription}</p>
            </div>
          </div>

          <div className="payment-section">
            <div className="payment-options">
              {[
                {
                  id: "cash" as Payment,
                  title: t.cash,
                  description: t.cashDescription,
                },
                {
                  id: "card" as Payment,
                  title: t.card,
                  description: t.cardDescription,
                },
                {
                  id: "transfer" as Payment,
                  title: t.transfer,
                  description: t.transferDescription,
                },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`payment-choice ${payment === option.id ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={payment === option.id}
                    onChange={() => setPayment(option.id)}
                  />
                  <span className="payment-icon" aria-hidden="true">
                    <PaymentIcon type={option.id} />
                  </span>
                  <span className="payment-text">
                    <strong>{option.title}</strong>
                    <small>{option.description}</small>
                  </span>
                  <span className="payment-check" aria-hidden="true">
                    {payment === option.id ? "✓" : ""}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="checkout-total">
            <span>{t.toPay}</span>
            <strong>{formatPrice(total, language)}</strong>
          </div>

          <button
            className="button button-primary submit-button"
            type="submit"
            disabled={sending || cartItems.length === 0}
          >
            {sending ? t.sending : t.submit}
            {!sending && <span aria-hidden="true">→</span>}
          </button>

          <p className="form-footnote">{t.footnote}</p>

          {notice && (
            <div
              className={`order-notice ${noticeError ? "order-notice-error" : "order-notice-success"}`}
              role="status"
            >
              {notice}
            </div>
          )}

          {trackedOrder && (
            <div
              className="order-notice order-notice-success"
              aria-live="polite"
            >
              <strong>{t.tracking}</strong>
              <p>
                {t.currentStatus}{" "}
                <strong>
                  {statusLabels[language][trackedOrder.status] ||
                    trackedOrder.statusLabel}
                </strong>
              </p>
              {trackingError && <p>{trackingError}</p>}
              {trackedOrder.status === "delivered" && (
                <p>{t.deliveredThanks}</p>
              )}
            </div>
          )}
        </form>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-name">Qulupnay.uz</span>
          <span className="brand-subtitle">· BAKERY ·</span>
        </a>

        <span className="footer-copy">
          © {new Date().getFullYear()} Qulupnay.uz · BAKERY
        </span>
<div className="copyright-owner">
  <span>Правообладатель: </span>
  <a
    href="https://t.me/qulupnay_bakery"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Qulupnay Bakery в Telegram"
  >
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.8 4.6 18.7 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6.1 13.6l-5-1.6c-1.1-.3-1.1-1.1.2-1.6L20.7 3c.9-.3 1.6.2 1.1 1.6Z" />
    </svg>
    <span>Qulupnay Bakery</span>
  </a>
</div>

      </footer>
    </main>
  );
}
