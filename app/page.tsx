
"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  label: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Авторский торт",
    category: "ТОРТЫ",
    description: "Нежный крем, воздушный бисквит и изысканное оформление.",
    price: 180000,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85",
    label: "Хит продаж",
  },
  {
    id: 2,
    name: "Нежные пирожные",
    category: "ПИРОЖНЫЕ",
    description: "Идеальное дополнение к кофе и красивому вечеру.",
    price: 65000,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=85",
    label: "Нежный вкус",
  },
  {
    id: 3,
    name: "Домашнее печенье",
    category: "ПЕЧЕНЬЕ И ВЫПЕЧКА",
    description: "Румяная выпечка для тёплых встреч и уютных моментов.",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=85",
    label: "Свежая выпечка",
  },
];

type Delivery = "delivery" | "pickup";

const money = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " сум";

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState<Delivery>("delivery");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({
          ...product,
          quantity: cart[product.id],
        })),
    [cart]
  );

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  function changeQuantity(id: number, change: number) {
    setCart((current) => {
      const next = (current[id] ?? 0) + change;
      const updated = { ...current };

      if (next <= 0) {
        delete updated[id];
      } else if (next <= 50) {
        updated[id] = next;
      }

      return updated;
    });

    setMessage("");
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (cartItems.length === 0) {
      setMessage("Сначала добавьте товары в корзину.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          delivery,
          address: delivery === "delivery" ? address : "",
          comment,
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        setMessage(
          result.error || "Не удалось оформить заказ. Попробуйте ещё раз."
        );
        return;
      }

      setCart({});
      setName("");
      setPhone("");
      setDelivery("delivery");
      setAddress("");
      setComment("");
      setMessage("Заказ отправлен! Мы свяжемся с вами для подтверждения.");
    } catch {
      setMessage("Не удалось связаться с сервером. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <header className="header">
        <a
          className="brand"
          href="#"
          aria-label="Qulupnay.uz — главная"
        >
          <span className="brand-copy">
            <strong>Qulupnay.uz</strong>
            <small> BAKERY </small>
          </span>
        </a>

        <nav
          className="navigation"
          aria-label="Главная навигация"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <a href="#catalog">Каталог</a>
          <a href="#about">О нас</a>
          <a href="#order">Корзина ({itemCount})</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">
            <span /> СЛАДКИЕ МОМЕНТЫ КАЖДЫЙ ДЕНЬ
          </p>

          <h1>
            Искусство
            <br />
            <em>быть сладким.</em>
          </h1>

          <p className="hero-description">
            Торты, нежные пирожные и свежая выпечка, созданные для ваших
            особенных моментов.
          </p>

          <div className="hero-actions">
            <a className="button button-dark" href="#catalog">
              Выбрать десерт
            </a>
            <a className="text-link" href="#catalog">
              Продукция
            </a>
          </div>

          <div className="hero-note">
            <span className="note-line" />
            С ЛЮБОВЬЮ К КАЖДОЙ ДЕТАЛИ
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo-frame">
            <img
              className="hero-photo"
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=90"
              alt="Красивый праздничный торт"
              fetchPriority="high"
            />
          </div>

          <div className="photo-stamp">
            <span>Сделано</span>
            <strong>с любовью</strong>
            <span>для вас ♡</span>
          </div>
        </div>
      </section>

      <section className="intro-strip" id="about">
        <p>НЕ ПРОСТО ДЕСЕРТЫ</p>
        <p>МАЛЕНЬКИЕ ПОВОДЫ ДЛЯ СЧАСТЬЯ</p>
        <p>ВАШИ ОСОБЕННЫЕ МОМЕНТЫ</p>
      </section>

      <section className="catalog section" id="catalog">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ВЫБЕРИТЕ СВОЁ НАСТРОЕНИЕ</p>
            <h2>
              Наша сладкая <em>коллекция</em>
            </h2>
          </div>

          <p className="section-description">
            Вкусные детали, которые делают обычный день особенным.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product, index) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <img
                  className="product-image"
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
                <span className="product-label">{product.label}</span>
                <span className="product-index">0{index + 1}</span>
              </div>

              <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="product-description">
                  {product.description}
                </p>

                <div className="product-bottom">
                  <strong className="product-price">
                    {money(product.price)}
                  </strong>

                  {(cart[product.id] ?? 0) === 0 ? (
                    <button
                      className="add-button"
                      type="button"
                      onClick={() => changeQuantity(product.id, 1)}
                      aria-label={`Добавить ${product.name} в корзину`}
                    >
                      <span>+</span> Добавить
                    </button>
                  ) : (
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, -1)}
                        aria-label="Уменьшить количество"
                      >
                        −
                      </button>

                      <span>{cart[product.id]}</span>

                      <button
                        type="button"
                        onClick={() => changeQuantity(product.id, 1)}
                        disabled={cart[product.id] >= 50}
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="promise">
        <div className="promise-inner">
          <div>
            <p className="eyebrow">ФИЛОСОФИЯ QULUPNAY</p>
            <h2>
              Красота в деталях.
              <br />
              <em>Счастье — во вкусе.</em>
            </h2>
          </div>

          <p className="promise-copy">
            От уютного чаепития до большого праздника — пусть у каждого
            момента будет свой сладкий вкус.
          </p>
        </div>
      </section>

      <section className="checkout section" id="order">
        <div className="section-heading checkout-heading">
          <div>
            <p className="eyebrow">ВАШИ ЛЮБИМЫЕ ДЕСЕРТЫ</p>
            <h2>
              Оформить <em>заказ</em>
            </h2>
          </div>

          <p className="section-description">
            Выберите десерты и оставьте контакты. Мы свяжемся с вами для
            подтверждения.
          </p>
        </div>

        <div className="checkout-layout">
          <div className="checkout-cart">
            <div className="cart-heading">
              <h3>Ваша корзина</h3>
              <span>{itemCount} шт.</span>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <span className="empty-cart-icon">♡</span>
                <p>Здесь пока пусто</p>
                <span>Добавьте что-нибудь вкусное из каталога.</span>
                <a href="#catalog">Перейти к десертам</a>
              </div>
            ) : (
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div className="checkout-item" key={item.id}>
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="cart-item-details">
                      <strong>{item.name}</strong>
                      <span>{money(item.price)} / шт.</span>

                      <div className="quantity-control cart-quantity">
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
                          onClick={() => changeQuantity(item.id, 1)}
                          disabled={item.quantity >= 50}
                          aria-label="Увеличить количество"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <strong className="cart-item-total">
                      {money(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>
            )}

            <div className="checkout-total">
              <span>Итого за товары</span>
              <strong>{money(total)}</strong>
            </div>

            <p className="cart-note">
              Стоимость и условия доставки уточняются при подтверждении заказа.
            </p>
          </div>

          <form className="order-form" onSubmit={submitOrder}>
            <h3>Данные для заказа</h3>
            <p className="form-intro">
              Заполните поля, чтобы мы могли с вами связаться.
            </p>

            <label htmlFor="customer-name">Ваше имя</label>
            <input
              id="customer-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Как к вам обращаться?"
              minLength={2}
              maxLength={80}
              required
            />

            <label htmlFor="customer-phone">Номер телефона</label>
            <input
              id="customer-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+998 90 123 45 67"
              minLength={7}
              maxLength={25}
              pattern="[+()0-9\s-]{7,25}"
              required
            />

            <span className="field-label">Как получите заказ?</span>

            <div className="delivery-options">
              <label className="delivery-choice">
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === "delivery"}
                  onChange={() => setDelivery("delivery")}
                />

                <span>
                  <strong>Доставка</strong>
                  <small>Доставим заказ по вашему адресу</small>
                </span>
              </label>

              <label className="delivery-choice">
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === "pickup"}
                  onChange={() => setDelivery("pickup")}
                />

                <span>
                  <strong>Самовывоз</strong>
                  <small>Вы заберёте заказ самостоятельно</small>
                </span>
              </label>
            </div>

            {delivery === "delivery" && (
              <>
                <label htmlFor="customer-address">Адрес доставки</label>
                <input
                  id="customer-address"
                  name="address"
                  autoComplete="street-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Улица, дом, ориентир"
                  minLength={5}
                  maxLength={300}
                  required
                />
              </>
            )}

            <label htmlFor="customer-comment">
              Комментарий <span className="optional">(необязательно)</span>
            </label>

            <textarea
              id="customer-comment"
              name="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Пожелания к заказу..."
              rows={3}
              maxLength={500}
            />

            <button
              className="button button-dark submit-button"
              type="submit"
              disabled={submitting || cartItems.length === 0}
            >
              {submitting ? "Отправляем заказ..." : "Оформить заказ"}
              {!submitting && <span>↗</span>}
            </button>

            {message && (
              <p className="order-message" role="status" aria-live="polite">
                {message}
              </p>
            )}

            <p className="form-note">
              Нажимая кнопку, вы отправляете данные, необходимые для обработки
              заказа.
            </p>
          </form>
        </div>
      </section>

      <footer className="footer">
        <a
          className="brand footer-brand"
          href="#"
          aria-label="Qulupnay.uz — главная"
        >
          <span className="brand-copy">
            <strong>Qulupnay.uz</strong>
            <small> BAKERY </small>
          </span>
        </a>

        <p>Сладкие моменты, созданные с любовью.</p>
        <a href="#catalog">Каталог ↑</a>

        <span className="footer-copyright">
          © {new Date().getFullYear()} Qulupnay.uz
        </span>
      </footer>
    </main>
  );
}
