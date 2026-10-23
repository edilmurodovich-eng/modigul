
"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type CartItem = {
  id: number;
  quantity: number;
};

type Delivery = "delivery" | "pickup";
type Payment = "cash" | "card" | "transfer";

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

const paymentOptions: {
  id: Payment;
  title: string;
  description: string;
}[] = [
  {
    id: "cash",
    title: "Наличными",
    description: "Оплата наличными при получении",
  },
  {
    id: "card",
    title: "Картой при получении",
    description: "Оплата картой при получении заказа",
  },
  {
    id: "transfer",
    title: "Перевод на карту",
    description: "Перевод по реквизитам для оплаты",
  },
];

const paymentLabels: Record<Payment, string> = {
  cash: "Наличными",
  card: "Картой при получении",
  transfer: "Перевод на карту",
};

function formatPrice(price: number) {
  return `${price.toLocaleString("ru-RU")} сум`;
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

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((p) => p.id === item.id);
          return product ? { ...product, quantity: item.quantity } : null;
        })
        .filter(
          (item): item is Product & { quantity: number } => item !== null
        ),
    [cart]
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
            ? {
                ...item,
                quantity: Math.min(50, item.quantity + change),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "");

    let national = digits.startsWith("998")
      ? digits.slice(3)
      : digits;

    national = national.slice(0, 9);

    let formatted = "+998";

    if (national.length > 0) {
      formatted += " " + national.slice(0, 2);
    }
    if (national.length > 2) {
      formatted += " " + national.slice(2, 5);
    }
    if (national.length > 5) {
      formatted += " " + national.slice(5, 7);
    }
    if (national.length > 7) {
      formatted += " " + national.slice(7, 9);
    }

    setPhone(formatted);
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setNoticeError(false);

    if (cartItems.length === 0) {
      setNotice("Сначала добавьте товары в корзину.");
      setNoticeError(true);
      return;
    }

    if (phone.replace(/\D/g, "").length !== 12) {
      setNotice("Введите полный номер телефона в формате +998.");
      setNoticeError(true);
      return;
    }

    if (delivery === "delivery" && !address.trim()) {
      setNotice("Укажите адрес доставки.");
      setNoticeError(true);
      return;
    }

    setSending(true);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          data.error || "Не удалось отправить заказ. Попробуйте ещё раз."
        );
      }

      setNotice(
        "Заказ отправлен! Спасибо за ваш выбор. Мы свяжемся с вами."
      );
      setNoticeError(false);
      setCart([]);
      setName("");
      setPhone("+998 ");
      setAddress("");
      setComment("");
      setPayment("cash");
      setDelivery("delivery");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Ошибка отправки заказа. Попробуйте ещё раз."
      );
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

        <nav className="main-nav" aria-label="Основная навигация">
          <a href="#home">Главная</a>
          <a href="#catalog">Каталог</a>
          <a href="#order">Заказать</a>
        </nav>

        <a className="header-cart" href="#order">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
          <span>Корзина</span>
          <span className="cart-badge">{cartCount}</span>
        </a>
      </header>

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">СВЕЖАЯ ВЫПЕЧКА · С ЗАБОТОЙ</p>
          <h1>
            Вкус, который
            <br />
            делает день
            <br />
            <span>особенным</span>
          </h1>
          <p className="hero-description">
            Домашняя выпечка, нежные десерты и сладкие моменты для вас и ваших
            близких.
          </p>
          <a className="button button-primary" href="#catalog">
            Выбрать десерт <span aria-hidden="true">→</span>
          </a>
          <div className="hero-note">
            <span className="note-star">✦</span>
            Свежеприготовленные десерты с любовью
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-frame">
            <img
              src={products[0].image}
              alt="Красивый праздничный торт"
            />
          </div>
          <div className="hero-stamp">
            <span>СДЕЛАНО</span>
            <strong>с любовью</strong>
            <span>ДЛЯ ВАС</span>
          </div>
        </div>
      </section>

      <section className="features" aria-label="Наши преимущества">
        <article className="feature">
          <span className="feature-symbol">✧</span>
          <div>
            <h3>Свежая выпечка</h3>
            <p>Готовим с заботой о качестве</p>
          </div>
        </article>
        <article className="feature">
          <span className="feature-symbol">♡</span>
          <div>
            <h3>С любовью</h3>
            <p>Внимание к каждой детали</p>
          </div>
        </article>
        <article className="feature">
          <span className="feature-symbol">⌂</span>
          <div>
            <h3>Удобный заказ</h3>
            <p>Доставка или самовывоз</p>
          </div>
        </article>
      </section>

      <section className="catalog section" id="catalog">
        <div className="section-heading">
          <div>
            <p className="eyebrow">НАША КОЛЛЕКЦИЯ</p>
            <h2>Выберите свою сладость</h2>
            <p className="section-description">
              Найдите любимый десерт для уютного дня или особенного события.
            </p>
          </div>
          <span className="catalog-count">{products.length} десерта</span>
        </div>

        <div className="product-grid">
          {products.map((product) => {
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
                      {formatPrice(product.price)}
                    </strong>

                    {quantity === 0 ? (
                      <button
                        className="add-button"
                        type="button"
                        onClick={() => addToCart(product.id)}
                        aria-label={`Добавить ${product.name} в корзину`}
                      >
                        <span>+</span>
                      </button>
                    ) : (
                      <div
                        className="quantity-control"
                        aria-label={`Количество: ${quantity}`}
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
          <p className="eyebrow">ВАШ СЛАДКИЙ ЗАКАЗ</p>
          <h2>Пусть будет вкусно</h2>
          <p>
            Заполните данные, выберите способ получения и оплаты. Мы свяжемся
            с вами для подтверждения заказа.
          </p>

          <div className="order-summary">
            <div className="summary-title">
              <h3>Ваша корзина</h3>
              <span>{cartCount} шт.</span>
            </div>

            {cartItems.length === 0 ? (
              <p className="empty-cart">
                Корзина пока пуста. Выберите десерт в каталоге.
              </p>
            ) : (
              <div className="cart-list">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-info">
                      <strong>{item.name}</strong>
                      <span>
                        {formatPrice(item.price)} × {item.quantity}
                      </span>
                    </div>

                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, -1)}
                        aria-label={`Уменьшить количество: ${item.name}`}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => addToCart(item.id)}
                        disabled={item.quantity >= 50}
                        aria-label={`Увеличить количество: ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="summary-total">
              <span>Итого</span>
              <strong>{formatPrice(total)}</strong>
            </div>
          </div>
        </div>

        <form className="order-form" onSubmit={submitOrder}>
          <div className="form-heading">
            <span className="form-step">01</span>
            <div>
              <h3>Контактные данные</h3>
              <p>Как с вами связаться?</p>
            </div>
          </div>

          <label className="field-label" htmlFor="customer-name">
            Ваше имя
          </label>
          <input
            id="customer-name"
            name="name"
            type="text"
            placeholder="Введите ваше имя"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />

          <label className="field-label" htmlFor="customer-phone">
            Номер телефона
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
              <h3>Способ получения</h3>
              <p>Как вам будет удобнее?</p>
            </div>
          </div>

          <div className="delivery-options">
            <label
              className={`delivery-choice ${
                delivery === "delivery" ? "selected" : ""
              }`}
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
                <strong>Доставка</strong>
                <small>До указанного адреса</small>
              </span>
              <span className="delivery-check" aria-hidden="true">✓</span>
            </label>

            <label
              className={`delivery-choice ${
                delivery === "pickup" ? "selected" : ""
              }`}
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
                <strong>Самовывоз</strong>
                <small>Забрать самостоятельно</small>
              </span>
              <span className="delivery-check" aria-hidden="true">✓</span>
            </label>
          </div>

          {delivery === "delivery" && (
            <>
              <label className="field-label" htmlFor="customer-address">
                Адрес доставки
              </label>
              <input
                id="customer-address"
                name="address"
                type="text"
                placeholder="Улица, дом, квартира"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                autoComplete="street-address"
                required
              />
            </>
          )}

          <label className="field-label" htmlFor="customer-comment">
            Комментарий к заказу
            <span className="optional-label">Необязательно</span>
          </label>
          <textarea
            id="customer-comment"
            name="comment"
            placeholder="Пожелания к заказу..."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={3}
          />

          <div className="form-divider" />

          <div className="form-heading">
            <span className="form-step">03</span>
            <div>
              <h3>Способ оплаты</h3>
              <p>Выберите удобный вариант</p>
            </div>
          </div>

          <div className="payment-section">
            <div className="payment-options">
              {paymentOptions.map((option) => (
                <label
                  key={option.id}
                  className={`payment-choice ${
                    payment === option.id ? "selected" : ""
                  }`}
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
            <span>К оплате</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <button
            className="button button-primary submit-button"
            type="submit"
            disabled={sending || cartItems.length === 0}
          >
            {sending ? "Отправляем заказ..." : "Оформить заказ"}
            {!sending && <span aria-hidden="true">→</span>}
          </button>

          <p className="form-footnote">
            Нажимая кнопку, вы отправляете данные для оформления заказа.
          </p>

          {notice && (
            <div
              className={`order-notice ${
                noticeError ? "order-notice-error" : "order-notice-success"
              }`}
              role="status"
            >
              {notice}
            </div>
          )}
        </form>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-name">Qulupnay.uz</span>
          <span className="brand-subtitle">· BAKERY ·</span>
        </a>
        <p>Свежая выпечка, созданная с любовью.</p>
        <span className="footer-copy">
          © {new Date().getFullYear()} Qulupnay.uz · BAKERY
        </span>
      </footer>
    </main>
  );
}
