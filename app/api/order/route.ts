
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  --cream: #fbf5ed;
  --paper: #fffaf4;
  --ink: #321a19;
  --wine: #641f30;
  --wine-dark: #3c111d;
  --rose: #b87578;
  --gold: #c59b66;
  --muted: #8a7770;
  --line: #e8dcd0;
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans: 'Manrope', Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 88px;
}

body {
  margin: 0;
  background: var(--cream);
  color: var(--ink);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
}

body,
button,
input,
textarea {
  font-family: var(--sans);
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font-size: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
}

.header {
  position: sticky;
  z-index: 20;
  top: 0;
  min-height: 82px;
  padding: 14px 7%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  border-bottom: 1px solid rgb(60 17 29 / 9%);
  background: rgb(251 245 237 / 94%);
  backdrop-filter: blur(14px);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand-mark {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border: 1px solid var(--gold);
  border-radius: 50%;
  color: var(--wine);
  font-family: var(--serif);
  font-size: 32px;
  font-style: italic;
  line-height: 1;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-copy strong {
  color: var(--wine-dark);
  font-family: var(--serif);
  font-size: 28px;
  font-weight: 700;
  line-height: 0.95;
}

.brand-copy small {
  color: var(--muted);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 2.4px;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 34px;
}

.navigation a,
.footer > a:not(.brand) {
  color: #69534d;
  font-size: 12px;
  font-weight: 600;
  transition: color 0.2s;
}

.navigation a:hover,
.footer > a:not(.brand):hover {
  color: var(--wine);
}

.header-cart {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 11px 15px;
  border: 1px solid #d8c5b5;
  border-radius: 3px;
  color: var(--wine-dark);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.header-cart span {
  width: 23px;
  height: 23px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--wine);
  color: white;
  font-size: 10px;
}

.hero {
  position: relative;
  min-height: 590px;
  padding: 68px 9% 72px;
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  align-items: center;
  gap: 5%;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 88% 30%, rgb(184 117 120 / 14%), transparent 37%),
    var(--cream);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 580px;
}

.eyebrow {
  margin: 0 0 18px;
  color: var(--wine);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2.6px;
  line-height: 1.8;
}

.hero .eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero .eyebrow > span {
  width: 23px;
  height: 1px;
  background: var(--gold);
}

.hero h1,
.section-heading h2,
.promise h2 {
  margin: 0;
  color: var(--ink);
  font-family: var(--serif);
  font-size: clamp(64px, 7.2vw, 100px);
  font-weight: 500;
  line-height: 0.92;
  letter-spacing: -2.8px;
}

.hero h1 em,
.section-heading h2 em,
.promise h2 em {
  color: var(--wine);
  font-weight: 500;
}

.hero-description {
  max-width: 410px;
  margin: 25px 0 29px;
  color: var(--muted);
  font-size: 13px;
  line-height: 2;
}

.hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 25px;
}

.button {
  min-height: 49px;
  padding: 14px 19px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
  transition: transform 0.2s, background 0.2s;
}

.button-dark {
  background: var(--wine-dark);
  color: white;
}

.button-dark:hover:not(:disabled) {
  transform: translateY(-2px);
  background: var(--wine);
}

.button span {
  font-size: 17px;
}

.text-link {
  padding-bottom: 5px;
  border-bottom: 1px solid #c9b4a5;
  color: #715a52;
  font-size: 11px;
  font-weight: 700;
}

.hero-note {
  margin-top: 60px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #a18d80;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 2.1px;
}

.note-line {
  width: 35px;
  height: 1px;
  background: var(--gold);
}

.hero-visual {
  position: relative;
  width: 100%;
  max-width: 480px;
  justify-self: end;
  padding: 12px 15px 30px 0;
}

.hero-photo-frame {
  position: relative;
  height: 410px;
  overflow: hidden;
  background: #ead9c9;
}

.hero-photo-frame::after {
  position: absolute;
  inset: 0;
  border: 1px solid rgb(255 255 255 / 25%);
  content: '';
  pointer-events: none;
}

.hero-photo {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.photo-stamp {
  position: absolute;
  z-index: 2;
  right: -12px;
  bottom: 48px;
  width: 116px;
  height: 116px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid rgb(197 155 102 / 70%);
  border-radius: 50%;
  background: var(--cream);
  color: var(--wine);
  transform: rotate(8deg);
}

.photo-stamp span {
  font-size: 9px;
}

.photo-stamp strong {
  font-family: var(--serif);
  font-size: 19px;
  font-style: italic;
  font-weight: 600;
}

.hero-number {
  position: absolute;
  right: 15px;
  bottom: 7px;
  color: #a18d80;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 2px;
}

.hero-decoration {
  position: absolute;
  color: var(--gold);
  opacity: 0.65;
}

.decoration-one {
  top: 13%;
  right: 48%;
  font-size: 22px;
}

.decoration-two {
  bottom: 12%;
  left: 4%;
  font-size: 16px;
}

.intro-strip {
  min-height: 76px;
  padding: 18px 7%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 15px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: #f5eae0;
}

.intro-strip p {
  margin: 0;
  color: #785c53;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-align: center;
}

.intro-strip > span {
  color: var(--gold);
  font-size: 15px;
}

.section {
  padding: 95px 8%;
}

.catalog {
  background: var(--paper);
}

.section-heading {
  max-width: 1100px;
  margin: 0 auto 40px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 35px;
}

.section-heading .eyebrow {
  margin-bottom: 12px;
}

.section-heading h2,
.promise h2 {
  font-size: clamp(43px, 5vw, 65px);
  letter-spacing: -1.5px;
  line-height: 1;
}

.section-description {
  max-width: 300px;
  margin: 0 0 5px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.9;
}

.product-grid {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 25px;
}

.product-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid #eadfd4;
  background: #fffdf9;
  transition: transform 0.25s, box-shadow 0.25s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgb(60 17 29 / 8%);
}

.product-image-wrap {
  position: relative;
  height: 260px;
  overflow: hidden;
  background: #f0e2d5;
}

.product-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.45s;
}

.product-card:hover .product-image {
  transform: scale(1.035);
}

.product-label {
  position: absolute;
  top: 13px;
  left: 13px;
  padding: 8px 10px;
  background: var(--cream);
  color: var(--wine);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.product-index {
  position: absolute;
  right: 13px;
  bottom: 10px;
  color: white;
  font-family: var(--serif);
  font-size: 25px;
  text-shadow: 0 1px 6px rgb(0 0 0 / 40%);
}

.product-info {
  padding: 22px 20px 20px;
}

.product-category {
  margin: 0 0 8px;
  color: #a37a66;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.product-info h3 {
  margin: 0 0 9px;
  color: var(--ink);
  font-family: var(--serif);
  font-size: 29px;
  font-weight: 600;
  line-height: 1.1;
}

.product-description {
  min-height: 43px;
  margin: 0 0 21px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.9;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.product-price {
  color: var(--wine);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.6;
}

.add-button {
  min-height: 36px;
  padding: 8px 10px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #d8c4b5;
  background: transparent;
  color: var(--wine);
  cursor: pointer;
  font-size: 9px;
  font-weight: 800;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
}

.add-button:hover {
  background: var(--wine);
  color: white;
}

.add-button span {
  font-size: 16px;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  color: var(--wine-dark);
}

.quantity-control button {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border: 1px solid #d5bca9;
  border-radius: 50%;
  background: transparent;
  color: var(--wine);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.quantity-control button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-control > span {
  min-width: 12px;
  font-size: 12px;
  font-weight: 800;
  text-align: center;
}

.catalog-footnote {
  max-width: 1100px;
  margin: 25px auto 0;
  color: #9a857a;
  font-size: 9px;
}

.promise {
  padding: 70px 8%;
  background:
    radial-gradient(ellipse at 90% 15%, rgb(184 117 120 / 18%), transparent 38%),
    #f0e3d6;
}

.promise-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 60px 1fr 0.75fr;
  align-items: center;
  gap: 30px;
}

.promise-symbol {
  width: 55px;
  height: 55px;
  display: grid;
  place-items: center;
  border: 1px solid var(--gold);
  border-radius: 50%;
  color: var(--wine);
  font-size: 26px;
}

.promise h2 {
  font-size: clamp(42px, 4.7vw, 59px);
}

.promise-copy {
  max-width: 320px;
  justify-self: end;
  color: #7e675e;
  font-size: 11px;
  line-height: 2;
}

.checkout {
  background: var(--cream);
}

.checkout-heading {
  margin-bottom: 38px;
}

.checkout-layout {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  align-items: start;
  gap: 25px;
}

.checkout-cart,
.order-form {
  min-width: 0;
  padding: 27px;
  border: 1px solid var(--line);
  background: #fffaf5;
}

.cart-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

.cart-heading h3,
.order-form h3 {
  margin: 0;
  color: var(--ink);
  font-family: var(--serif);
  font-size: 29px;
  font-weight: 600;
}

.cart-heading > span {
  color: var(--muted);
  font-size: 10px;
}

.empty-cart {
  padding: 35px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-cart-icon {
  color: #b99079;
  font-family: var(--serif);
  font-size: 40px;
}

.empty-cart p {
  margin: 10px 0 7px;
  font-family: var(--serif);
  font-size: 23px;
  font-weight: 600;
}

.empty-cart > span:last-of-type {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.8;
}

.empty-cart a {
  margin-top: 17px;
  color: var(--wine);
  font-size: 10px;
  font-weight: 800;
}

.checkout-item {
  padding: 17px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--line);
}

.cart-item-image {
  width: 64px;
  height: 70px;
  flex-shrink: 0;
  overflow: hidden;
  background: #f0e2d5;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.cart-item-details {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.cart-item-details > strong {
  font-family: var(--serif);
  font-size: 19px;
  font-weight: 600;
}

.cart-item-details > span {
  color: var(--muted);
  font-size: 9px;
}

.cart-quantity {
  margin-top: 3px;
  gap: 9px;
}

.cart-quantity button {
  width: 25px;
  height: 25px;
  font-size: 15px;
}

.cart-item-total {
  max-width: 105px;
  color: var(--wine);
  font-size: 10px;
  line-height: 1.6;
  text-align: right;
}

.checkout-total {
  margin-top: 23px;
  padding-top: 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border-top: 1px solid var(--line);
}

.checkout-total > span {
  color: #725e55;
  font-size: 11px;
}

.checkout-total strong {
  color: var(--wine);
  font-size: 15px;
  text-align: right;
}

.cart-note {
  margin: 12px 0 0;
  color: #a08b80;
  font-size: 9px;
  line-height: 1.8;
}

.order-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-intro {
  margin: -3px 0 12px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.8;
}

.order-form label,
.field-label {
  color: #57423b;
  font-size: 10px;
  font-weight: 800;
}

.optional {
  color: #a18d80;
  font-weight: 500;
}

.order-form > input,
.order-form > textarea {
  width: 100%;
  min-height: 45px;
  margin-bottom: 9px;
  padding: 13px;
  border: 1px solid #e2d4c8;
  border-radius: 2px;
  outline: none;
  background: #fffdf9;
  color: var(--ink);
  font-size: 11px;
  transition: border-color 0.2s;
}

.order-form > input:focus,
.order-form > textarea:focus {
  border-color: var(--gold);
}

.order-form > input::placeholder,
.order-form > textarea::placeholder {
  color: #b2a096;
}

.order-form textarea {
  min-height: 85px;
  resize: vertical;
}

.delivery-options {
  margin: 2px 0 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.delivery-choice {
  min-width: 0;
  min-height: 67px;
  padding: 12px 10px;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  border: 1px solid #e2d4c8;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.delivery-choice:has(input:checked) {
  border-color: var(--gold);
  background: #f7eee4;
}

.delivery-choice input {
  margin: 3px 0 0;
  accent-color: var(--wine);
}

.delivery-choice span {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.delivery-choice strong {
  font-size: 10px;
}

.delivery-choice small {
  color: var(--muted);
  font-size: 9px;
  line-height: 1.5;
}

.submit-button {
  width: 100%;
  margin-top: 7px;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.order-message {
  margin: 7px 0 0;
  color: var(--wine);
  font-size: 11px;
  line-height: 1.8;
}

.form-note {
  margin: 6px 0 0;
  color: #a08b80;
  font-size: 9px;
  line-height: 1.8;
}

.footer {
  padding: 32px 7%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  border-top: 1px solid #58303a;
  background: var(--wine-dark);
}

.footer .brand-mark {
  border-color: #b9976b;
  color: #f7e8d5;
}

.footer .brand-copy strong {
  color: #fff5e9;
}

.footer .brand-copy small {
  color: #cbb5a6;
}

.footer > p {
  margin: 0;
  color: #d4bdb0;
  font-size: 10px;
}

.footer > a:not(.brand) {
  color: #f0ddc8;
}

.footer-copyright {
  color: #c2a99d;
  font-size: 9px;
}

@media (min-width: 1400px) {
  .hero {
    padding-right: max(9%, calc((100% - 1200px) / 2));
    padding-left: max(9%, calc((100% - 1200px) / 2));
  }
}

@media (max-width: 900px) {
  .header {
    padding-right: 5%;
    padding-left: 5%;
  }

  .navigation {
    gap: 17px;
  }

  .hero {
    padding-right: 6%;
    padding-left: 6%;
    gap: 3%;
  }

  .hero-photo-frame {
    height: 350px;
  }

  .product-grid {
    gap: 15px;
  }

  .product-image-wrap {
    height: 220px;
  }

  .product-info {
    padding: 18px 14px;
  }

  .product-bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .section {
    padding-right: 6%;
    padding-left: 6%;
  }

  .checkout-cart,
  .order-form {
    padding: 20px;
  }

  .promise-inner {
    grid-template-columns: 45px 1fr;
    gap: 20px;
  }

  .promise-symbol {
    width: 43px;
    height: 43px;
  }

  .promise-copy {
    grid-column: 2;
    justify-self: start;
    margin: 0;
  }
}

@media (max-width: 650px) {
  html {
    scroll-padding-top: 72px;
  }

  .header {
    min-height: 68px;
    padding: 11px 5%;
    gap: 10px;
  }

  .brand {
    gap: 7px;
  }

  .brand-mark {
    width: 36px;
    height: 36px;
    font-size: 27px;
  }

  .brand-copy strong {
    font-size: 23px;
  }

  .brand-copy small {
    font-size: 7px;
    letter-spacing: 1.6px;
  }

  .navigation {
    display: none;
  }

  .header-cart {
    gap: 7px;
    padding: 9px 10px;
    font-size: 10px;
  }

  .header-cart span {
    width: 21px;
    height: 21px;
  }

  .hero {
    min-height: auto;
    padding: 55px 7% 55px;
    grid-template-columns: 1fr;
    gap: 35px;
  }

  .hero h1 {
    font-size: clamp(60px, 15vw, 82px);
    letter-spacing: -1.8px;
  }

  .hero-description {
    max-width: 340px;
    margin: 20px 0 25px;
    font-size: 12px;
  }

  .hero-actions {
    gap: 18px;
  }

  .button {
    min-height: 47px;
    padding: 13px 15px;
    gap: 17px;
  }

  .text-link {
    font-size: 10px;
  }

  .hero-note {
    margin-top: 34px;
    font-size: 7px;
  }

  .hero-visual {
    width: 90%;
    max-width: 390px;
    justify-self: center;
    padding-right: 8px;
  }

  .hero-photo-frame {
    height: 340px;
  }

  .photo-stamp {
    right: -12px;
    bottom: 39px;
    width: 95px;
    height: 95px;
  }

  .photo-stamp strong {
    font-size: 16px;
  }

  .photo-stamp span {
    font-size: 8px;
  }

  .hero-number {
    right: 5px;
    font-size: 7px;
  }

  .decoration-one {
    top: 38%;
    right: 9%;
  }

  .intro-strip {
    padding: 17px 6%;
    gap: 10px;
  }

  .intro-strip p {
    max-width: 42%;
    font-size: 7px;
    letter-spacing: 1px;
    line-height: 1.8;
  }

  .intro-strip > span {
    font-size: 11px;
  }

  .section {
    padding: 62px 6%;
  }

  .section-heading {
    margin-bottom: 28px;
    align-items: flex-start;
    flex-direction: column;
    gap: 13px;
  }

  .section-heading h2 {
    font-size: clamp(43px, 11vw, 56px);
  }

  .section-description {
    max-width: 340px;
    font-size: 10px;
  }

  .product-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .product-image-wrap {
    height: clamp(220px, 65vw, 330px);
  }

  .product-info {
    padding: 21px;
  }

  .product-info h3 {
    font-size: 30px;
  }

  .product-description {
    min-height: 0;
    margin-bottom: 17px;
    font-size: 11px;
  }

  .product-bottom {
    align-items: center;
    flex-direction: row;
    gap: 8px;
  }

  .product-price {
    font-size: 12px;
  }

  .add-button {
    padding: 9px 11px;
  }

  .promise {
    padding: 50px 7%;
  }

  .promise-inner {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .promise-symbol {
    width: 43px;
    height: 43px;
  }

  .promise h2 {
    font-size: clamp(43px, 10vw, 55px);
  }

  .promise-copy {
    grid-column: auto;
    max-width: 340px;
    font-size: 11px;
  }

  .checkout-layout {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .checkout-cart,
  .order-form {
    padding: 19px;
  }

  .cart-heading h3,
  .order-form h3 {
    font-size: 27px;
  }

  .cart-item-image {
    width: 55px;
    height: 62px;
  }

  .cart-item-details > strong {
    font-size: 17px;
  }

  .cart-item-total {
    max-width: 95px;
    font-size: 9px;
  }

  .delivery-choice {
    padding: 11px 8px;
    gap: 7px;
  }

  .footer {
    padding: 30px 6%;
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }

  .footer > p {
    line-height: 1.8;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition: none !important;
  }
}
