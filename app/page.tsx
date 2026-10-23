

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

function money(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " сум";
}

export default function Home() {
  const [cart, setCart] = useState<number[]>([]);

  function addToCart(id: number) {
    setCart((current) => [...current, id]);
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
          <a href="#about">О нас</a>
        </nav>

        <a className="cart-link" href="#catalog">
          ♧ <span>{cart.length}</span>
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
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="product-tag">{product.tag}</span>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>{money(product.price)}</strong>
                <button
                  className="gold-button add-button"
                  onClick={() => addToCart(product.id)}
                >
                  Добавить в корзину <span>＋</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="cart-summary">
          В корзине наборов: <strong>{cart.length}</strong>
          {cart.length > 0 && (
            <> · На сумму: <strong>
              {money(
                cart.reduce(
                  (sum, id) =>
                    sum + (products.find((p) => p.id === id)?.price ?? 0),
                  0
                )
              )}
            </strong></>
          )}
        </p>
      </section>

      <section className="closing">
        <div>
          <p className="eyebrow">ПОДАРИТЕ ЭМОЦИИ</p>
          <h2>Закажите <span>сейчас</span></h2>
          <p>Сладкие моменты начинаются с Qulupnay.uz.</p>
        </div>
        <a className="gold-button" href="#catalog">
          Перейти в каталог <span>→</span>
        </a>
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
