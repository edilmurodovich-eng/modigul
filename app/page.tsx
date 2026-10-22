
const products = [
  {
    name: "Клубника в шоколаде",
    description: "Свежая клубника в нежном шоколаде",
    price: "от 49 000 сум",
    emoji: "🍓",
  },
  {
    name: "Подарочный набор",
    description: "Красивый набор для особенного момента",
    price: "от 99 000 сум",
    emoji: "🎁",
  },
  {
    name: "Клубничный бокс",
    description: "Сочная клубника в премиальном оформлении",
    price: "от 79 000 сум",
    emoji: "🍓",
  },
];

export default function Home() {
  return (
    <main>
      <header className="header">
        <a className="logo" href="/">Qulupnay<span>.uz</span></a>
        <a className="header-link" href="#catalog">Каталог</a>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">СЛАДКИЕ МОМЕНТЫ</p>
          <h1>Любовь<br />в каждой <span>ягоде</span></h1>
          <p className="hero-description">
            Сочная клубника, изысканный шоколад
            и подарки, которые запоминаются.
          </p>
          <a className="main-button" href="#catalog">
            Выбрать десерт <span>↗</span>
          </a>
        </div>
        <div className="hero-art" aria-label="Клубника в шоколаде">
          <div className="art-glow" />
          <div className="strawberry">🍓</div>
          <div className="chocolate">🍫</div>
          <span className="sparkle sparkle-one">✦</span>
          <span className="sparkle sparkle-two">✧</span>
        </div>
        <div className="hero-bottom">СДЕЛАНО С ЛЮБОВЬЮ · QULUPNAY.UZ</div>
      </section>

      <section className="catalog" id="catalog">
        <p className="eyebrow">НАШ ВЫБОР</p>
        <h2>Маленькие <span>удовольствия</span></h2>
        <p className="catalog-description">
          Десерты для подарка, праздника или просто так.
        </p>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.name}>
              <div className="product-art">{product.emoji}</div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>{product.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <a className="logo" href="/">Qulupnay<span>.uz</span></a>
        <p>Сладкие моменты начинаются здесь 🍓</p>
      </footer>
    </main>
  );
}
