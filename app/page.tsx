

"
"use client";

import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Классика",
    description: "6 ягод в шоколаде",
    price: 120000,
    image:
      "https://images.unsplash.com/photo-1546039907-7fa05f864c02?auto=format&fit=crop&w=800&q=85",
    tag: "БЕСТСЕЛЛЕР",
  },
  {
    id: 2,
    name: "Премиум",
    description: "9 ягод в шоколаде",
    price: 180000,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=85",
    tag: "ПОПУЛЯРНЫЙ",
  },
  {
    id: 3,
    name: "VIP",
    description: "12 ягод в шоколаде",
    price: 230000,
    image:
      "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=800&q=85",
    tag: "ПОДАРОК",
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " сум";

export default function Home() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cartItems = products
    .filter((product) => (cart[product.id] ?? 0) > 0)
    .map((product) => ({
      ...product,
      quantity: cart[product.id],
    }));

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  function changeQuantity(id: number, delta: number) {
    setCart((current) => {
      const next = { ...current };
      const quantity = (next[id] ?? 0) + delta;

      if (quantity <= 0) {
        delete next[id];
      } else {
        next[id] = Math.min(quantity, 50);
      }

      return next;
    });

    setMessage("");
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (itemCount === 0) {
      setMessage("Сначала добавьте товар в корзину.");
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
        setMessage(result.error ?? "Не удалось отправить заказ.");
        return;
      }

      setMessage(
        "Заказ отправлен! Мы свяжемся с вами для подтверждения."
      );
      setCart({});
      setName("");
      setPhone("");
      setAddress("");
      setComment("");
      setDelivery("delivery");
    } catch {
      setMessage(
        "Не удалось связаться с сервером. Проверьте интернет и попробуйте ещё раз."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#">
          <span className="brand-icon">✿</span>
          <span>
            Qulupnay<span className="gold">.uz</span>
            <small>Клубника в шоколаде</small>
          </span>
        </a>

        <nav>
          <a href="#">Главная</a>
          <a href="#catalog">Каталог</a>
          <a href="#checkout">Заказ</a>
        </nav>

        <a className="cart-link" href="#checkout" aria-label={`Корзина, ${itemCount} товаров`}>
          ♧ <span>{itemCount}</span>
        </a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">НАТУРАЛЬНАЯ КЛУБНИКА · ПРЕМИУМ КАЧЕСТВО</p>
          <h1>
            Клубника
            <br />
            в <span>шоколаде</span>
          </h1>
          <p className="hero-text">
            Идеальное сочетание свежести, вкуса и эстетики.
            Подарите близким незабываемые сладкие моменты.
          </p>
          <a className="gold-button" href="#catalog">
            Выбрать набор <span>→</span>
          </a>
          <div className="hero-note">СДЕЛАНО С ЛЮБОВЬЮ · QULUPNAY.UZ</div>
        </div>

        <div className="hero-photo">
          <img
            src="https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=1200&q=90"
            alt="Премиальные сладости и шоколад"
          />
          <div className="photo-caption">
            <span>МАЛЕНЬКАЯ РОСКОШЬ</span>
            <strong>В каждом кусочке</strong>
          </div>
        </div>
      </section>

      <section className="benefits" id="about">
        <article>
          <span>✧</span>
          <h3>Свежие ягоды</h3>
          <p>Отборная клубника</p>
        </article>
        <article>
          <span>◇</span>
          <h3>Премиум шоколад</h3>
          <p>Насыщенный вкус</p>
        </article>
        <article>
          <span>♧</span>
          <h3>Бережная доставка</h3>
          <p>По согласованию заказа</p>
        </article>
        <article>
          <span>♡</span>
          <h3>С заботой</h3>
          <p>Каждый заказ особенный</p>
        </article>
      </section>

      <section className="catalog" id="catalog">
        <p className="eyebrow">ВАШИ СЛАДКИЕ МОМЕНТЫ</p>
        <h2>Популярные <span>наборы</span></h2>
        <p className="section-description">
          Выберите подарок, который скажет больше слов.
        </p>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
                <span className="product-tag">{product.tag}</span>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>{money(product.price)}</strong>
                <button
                  type="button"
                  className="gold-button add-button"
                  disabled={(cart[product.id] ?? 0) >= 50}
                  onClick={() => changeQuantity(product.id, 1)}
                >
                  Добавить в корзину <span>＋</span>
                </button>
                {(cart[product.id] ?? 0) > 0 && (
                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label="Уменьшить количество"
                      onClick={() => changeQuantity(product.id, -1)}
                    >
                      −
                    </button>
                    <span>{cart[product.id]}</span>
                    <button
                      type="button"
                      aria-label="Увеличить количество"
                      disabled={cart[product.id] >= 50}
                      onClick={() => changeQuantity(product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="checkout" id="checkout">
        <p className="eyebrow">ВАШ ЗАКАЗ</p>
        <h2>Оформление <span>заказа</span></h2>

        <div className="checkout-layout">
          <div className="checkout-cart">
            <h3>Корзина</h3>

            {cartItems.length === 0 ? (
              <p className="empty-cart">
                Корзина пока пуста. Выберите набор в каталоге.
              </p>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div className="checkout-item" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <p>{money(item.price)} за набор</p>
                    </div>
                    <div className="quantity-control">
                      <button
                        type="button"
                        aria-label={`Уменьшить ${item.name}`}
                        onClick={() => changeQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Увеличить ${item.name}`}
                        disabled={item.quantity >= 50}
                        onClick={() => changeQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}

                <div className="checkout-total">
                  <span>Итого</span>
                  <strong>{money(total)}</strong>
                </div>
              </>
            )}
          </div>

          <form className="order-form" onSubmit={submitOrder}>
            <h3>Контактные данные</h3>

            <label htmlFor="customer-name">Ваше имя</label>
            <input
              id="customer-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={80}
              autoComplete="name"
              required
              placeholder="Как к вам обращаться?"
            />

            <label htmlFor="customer-phone">Телефон</label>
            <input
              id="customer-phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              minLength={7}
              maxLength={25}
              autoComplete="tel"
              required
              placeholder="+998 90 123 45 67"
            />

            <label>Как получить заказ?</label>
            <div className="delivery-options">
              <label className="delivery-choice">
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === "delivery"}
                  onChange={() => setDelivery("delivery")}
                />
                <span>🚚 Доставка</span>
              </label>
              <label className="delivery-choice">
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === "pickup"}
                  onChange={() => setDelivery("pickup")}
                />
                <span>🏪 Самовывоз</span>
              </label>
            </div>

            {delivery === "delivery" && (
              <>
                <label htmlFor="customer-address">Адрес доставки</label>
                <textarea
                  id="customer-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  minLength={5}
                  maxLength={300}
                  required
                  placeholder="Город, улица, дом, ориентир"
                  rows={3}
                />
              </>
            )}

            <label htmlFor="customer-comment">
              Комментарий к заказу (необязательно)
            </label>
            <textarea
              id="customer-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={500}
              placeholder="Удобное время или пожелания"
              rows={3}
            />

            <button
              className="gold-button submit-button"
              type="submit"
              disabled={submitting || itemCount === 0}
            >
              {submitting ? "Отправляем..." : "Отправить заказ в Telegram"}
              {!submitting && <span>→</span>}
            </button>

            {message && (
              <p className="order-message" role="status" aria-live="polite">
                {message}
              </p>
            )}

            <p className="form-note">
              После отправки магазин свяжется с вами для подтверждения
              заказа, стоимости доставки и времени получения.
            </p>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#">
          Qulupnay<span className="gold">.uz</span>
        </a>
        <p>Клубника в шоколаде · С любовью к деталям</p>
      </footer>
    </main>
  );
}
