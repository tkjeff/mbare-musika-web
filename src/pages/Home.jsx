import { useEffect, useState } from "react";

const products = [
  {
    name: "Fresh Tomatoes",
    price: "$3.50",
    unit: "per crate",
    category: "Fresh Produce",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=800&q=85",
    badge: "Popular",
  },
  {
    name: "Fresh Bananas",
    price: "$4.00",
    unit: "per bunch",
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=85",
    badge: "Fresh",
  },
  {
    name: "Potatoes",
    price: "$5.00",
    unit: "per bag",
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=85",
    badge: "Best Seller",
  },
  {
    name: "Fresh Oranges",
    price: "$6.00",
    unit: "per bag",
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=85",
    badge: "Fresh",
  },
  {
    name: "Green Vegetables",
    price: "$2.50",
    unit: "per bundle",
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=85",
    badge: "Local",
  },
  {
    name: "Fresh Onions",
    price: "$4.50",
    unit: "per bag",
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=800&q=85",
    badge: "Deal",
  },
];

const categories = [
  { name: "Fresh Produce", icon: "🥬" },
  { name: "Fruits", icon: "🍊" },
  { name: "Vegetables", icon: "🥕" },
  { name: "Groceries", icon: "🛒" },
  { name: "Meat & Poultry", icon: "🍗" },
  { name: "Household", icon: "🏠" },
];

const newsItems = [
  "🔥 TODAY: Fresh produce arriving from Mbare sellers",
  "🚚 Fast local delivery available",
  "🛍️ Shop directly from verified Mbare sellers",
  "⭐ Discover today's marketplace deals",
  "🇿🇼 Supporting Zimbabwean businesses",
  "💙 Mbare Musika — bringing the market closer to you",
];

function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mbare_cart") || "[]");
    setCartCount(saved.length);
  }, []);

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("mbare_cart") || "[]");
    cart.push(product);
    localStorage.setItem("mbare_cart", JSON.stringify(cart));
    setCartCount(cart.length);
  };

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) =>
          product.category.toLowerCase().includes(activeCategory.toLowerCase())
        );

  return (
    <div className="mm-page">

      {/* NEWS TICKER */}
      <div className="mm-news">
        <div className="mm-news-label">
          <span className="live-dot"></span>
          MARKET NEWS
        </div>

        <div className="mm-news-window">
          <div className="mm-news-track">
            {[...newsItems, ...newsItems].map((item, index) => (
              <span className="mm-news-item" key={index}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="mm-header">
        <div className="mm-header-inner">

          <div className="mm-logo">
            <div className="mm-logo-mark">M</div>
            <div>
              <div className="mm-logo-name">Mbare Musika</div>
              <div className="mm-logo-sub">Zimbabwe's Digital Market</div>
            </div>
          </div>

          <div className="mm-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search products, sellers and categories..."
            />
            <button>Search</button>
          </div>

          <div className="mm-header-actions">
            <button className="mm-action">
              <span>♡</span>
              <small>Wishlist</small>
            </button>

            <button className="mm-action">
              <span>♙</span>
              <small>Account</small>
            </button>

            <button className="mm-cart">
              <span>🛒</span>
              <b>{cartCount}</b>
            </button>
          </div>

        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="mm-nav">
        <div className="mm-nav-inner">

          <button className="category-menu">
            ☰ &nbsp; Shop Categories
          </button>

          <a href="/">Home</a>
          <a href="#shop">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#deals">Deals</a>
          <a href="#sellers">Sellers</a>
          <a href="#stories">Stories</a>

          <div className="nav-spacer"></div>

          <button className="seller-button">
            Become a Seller →
          </button>

        </div>
      </nav>

      {/* HERO */}
      <section className="mm-hero">
        <div className="mm-hero-inner">

          <div className="mm-hero-copy">

            <div className="hero-tag">
              ZIMBABWE'S LOCAL MARKETPLACE
            </div>

            <h1>
              Your Mbare market,
              <br />
              <span>now online.</span>
            </h1>

            <p>
              Discover fresh produce, local sellers and everyday essentials
              from Mbare — without having to navigate the crowds.
            </p>

            <div className="hero-buttons">
              <button className="primary-button">
                Shop the Market →
              </button>

              <button className="secondary-button">
                Explore Sellers
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <strong>500+</strong>
                <span>Products</span>
              </div>

              <div className="trust-divider"></div>

              <div className="trust-item">
                <strong>100+</strong>
                <span>Local Sellers</span>
              </div>

              <div className="trust-divider"></div>

              <div className="trust-item">
                <strong>Fast</strong>
                <span>Delivery</span>
              </div>
            </div>

          </div>

          <div className="mm-hero-visual">

            <div className="hero-blue-circle"></div>

            <div className="floating-card card-one">
              <span>🍅</span>
              <div>
                <strong>Fresh Tomatoes</strong>
                <small>From Mbare sellers</small>
              </div>
            </div>

            <div className="floating-card card-two">
              <span>🚚</span>
              <div>
                <strong>Fast Delivery</strong>
                <small>Coming to your door</small>
              </div>
            </div>

            <div className="market-photo">
              <img
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=90"
                alt="Fresh market produce"
              />
            </div>

            <div className="hero-price">
              <small>FROM LOCAL SELLERS</small>
              <strong>Fresh.</strong>
              <strong>Local.</strong>
              <strong>Affordable.</strong>
            </div>

          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mm-section" id="categories">

        <div className="section-heading">
          <div>
            <span className="section-kicker">EXPLORE THE MARKET</span>
            <h2>Shop by category</h2>
          </div>

          <button className="view-all">View all →</button>
        </div>

        <div className="category-row">

          <button
            className={`category-card ${
              activeCategory === "All" ? "selected" : ""
            }`}
            onClick={() => setActiveCategory("All")}
          >
            <div className="category-icon">✨</div>
            <strong>Everything</strong>
            <span>All products</span>
          </button>

          {categories.map((category) => (
            <button
              className={`category-card ${
                activeCategory === category.name ? "selected" : ""
              }`}
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
            >
              <div className="category-icon">{category.icon}</div>
              <strong>{category.name}</strong>
              <span>Shop now →</span>
            </button>
          ))}

        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mm-section products-section" id="shop">

        <div className="section-heading">

          <div>
            <span className="section-kicker">FRESH FROM MBARE</span>
            <h2>Popular right now</h2>
          </div>

          <div className="rail-buttons">
            <button>←</button>
            <button>→</button>
          </div>

        </div>

        <div className="products-row">

          {filteredProducts.map((product) => (

            <article className="product-card" key={product.name}>

              <div className="product-image">

                <img
                  src={product.image}
                  alt={product.name}
                />

                <span className="product-badge">
                  {product.badge}
                </span>

                <button className="heart-button">♡</button>

              </div>

              <div className="product-info">

                <small>{product.category}</small>

                <h3>{product.name}</h3>

                <div className="product-rating">
                  ★★★★★ <span>(24)</span>
                </div>

                <div className="product-bottom">

                  <div>
                    <strong>{product.price}</strong>
                    <span>{product.unit}</span>
                  </div>

                  <button
                    className="add-button"
                    onClick={() => addToCart(product)}
                  >
                    +
                  </button>

                </div>

              </div>

            </article>

          ))}

        </div>
      </section>

      {/* DEAL BANNER */}
      <section className="deal-section" id="deals">

        <div className="deal-content">

          <span className="deal-label">THIS WEEK'S MARKET DEAL</span>

          <h2>
            Fresh from Mbare.
            <br />
            Better prices.
          </h2>

          <p>
            Discover special offers from local sellers and get more
            value from every order.
          </p>

          <button className="white-button">
            Explore today's deals →
          </button>

        </div>

        <div className="deal-visual">

          <div className="deal-circle"></div>

          <img
            src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=90"
            alt="Fresh vegetables"
          />

          <div className="deal-floating">
            <strong>LOCAL</strong>
            <span>SELLERS</span>
          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="mm-section how-section">

        <div className="center-heading">
          <span className="section-kicker">HOW IT WORKS</span>
          <h2>The market comes to you.</h2>
          <p>
            We connect buyers, Mbare sellers and delivery riders
            through one simple marketplace.
          </p>
        </div>

        <div className="steps">

          <div className="step">
            <div className="step-number">01</div>
            <div className="step-icon">🔎</div>
            <h3>Browse</h3>
            <p>
              Find products from local Mbare sellers in one place.
            </p>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <div className="step-number">02</div>
            <div className="step-icon">🛒</div>
            <h3>Order</h3>
            <p>
              Compare products and place your order from home.
            </p>
          </div>

          <div className="step-line"></div>

          <div className="step">
            <div className="step-number">03</div>
            <div className="step-icon">🚚</div>
            <h3>Deliver</h3>
            <p>
              Local riders bring your market order to your door.
            </p>
          </div>

        </div>

      </section>

      {/* SELLER SECTION */}
      <section className="seller-section" id="sellers">

        <div className="seller-copy">

          <span className="section-kicker light">
            FOR MBARE SELLERS
          </span>

          <h2>
            Your stall
            <br />
            just got bigger.
          </h2>

          <p>
            Put your products in front of customers across Harare.
            Sell online without losing the connection to your local market.
          </p>

          <button className="seller-white-button">
            Become a seller →
          </button>

        </div>

        <div className="seller-stats">

          <div>
            <strong>2%</strong>
            <span>transaction commission</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>digital storefront</span>
          </div>

          <div>
            <strong>∞</strong>
            <span>growth potential</span>
          </div>

        </div>

      </section>

      {/* STORIES */}
      <section className="mm-section stories-section" id="stories">

        <div className="section-heading">

          <div>
            <span className="section-kicker">MBARE STORIES</span>
            <h2>More than a marketplace.</h2>
          </div>

          <button className="view-all">
            Read stories →
          </button>

        </div>

        <div className="story-grid">

          <article className="story-card large">

            <img
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=90"
              alt="Local marketplace"
            />

            <div className="story-overlay">
              <span>THE FUTURE OF TRADE</span>
              <h3>
                Bringing Zimbabwe's markets into the digital age.
              </h3>
            </div>

          </article>

          <article className="story-card">

            <div className="story-blue">
              <span>01</span>
              <h3>
                Supporting local sellers.
              </h3>
              <p>
                Technology that gives small businesses a larger digital
                customer base.
              </p>
            </div>

          </article>

          <article className="story-card">

            <div className="story-light">
              <span>02</span>
              <h3>
                Making shopping easier.
              </h3>
              <p>
                Less time in traffic. Less time in queues. More choice.
              </p>
            </div>

          </article>

        </div>

      </section>

      {/* VISION */}
      <section className="vision-section">

        <div className="vision-content">

          <span>OUR VISION</span>

          <h2>
            Mbare.
            <br />
            Harare.
            <br />
            <strong>Zimbabwe.</strong>
          </h2>

          <p>
            We are not trying to create a market.
            The market already exists.
            We are building the technology that connects it
            to the next generation of Zimbabwean consumers.
          </p>

          <button>
            Explore Mbare Musika →
          </button>

        </div>

        <div className="vision-map">
          <div className="map-ring ring-one"></div>
          <div className="map-ring ring-two"></div>
          <div className="map-ring ring-three"></div>

          <div className="map-point point-mbare">
            <span></span>
            <strong>Mbare</strong>
          </div>

          <div className="map-point point-harare">
            <span></span>
            <strong>Harare</strong>
          </div>

          <div className="map-point point-zim">
            <span></span>
            <strong>Zimbabwe</strong>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="mm-footer">

        <div className="footer-main">

          <div className="footer-brand">

            <div className="mm-logo footer-logo">
              <div className="mm-logo-mark">M</div>
              <div>
                <div className="mm-logo-name">Mbare Musika</div>
                <div className="mm-logo-sub">
                  Zimbabwe's Digital Market
                </div>
              </div>
            </div>

            <p>
              Connecting Zimbabwean buyers,
              sellers and riders through technology.
            </p>

          </div>

          <div className="footer-column">
            <h4>Marketplace</h4>
            <a href="#shop">Shop</a>
            <a href="#categories">Categories</a>
            <a href="#deals">Deals</a>
            <a href="#sellers">Sellers</a>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <a href="#stories">Stories</a>
            <a href="#">About us</a>
            <a href="#">Contact</a>
            <a href="#">Careers</a>
          </div>

          <div className="footer-column">
            <h4>Get started</h4>
            <a href="#">Create account</a>
            <a href="#">Become a seller</a>
            <a href="#">Become a rider</a>
            <a href="#">Help centre</a>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 Mbare Musika</span>
          <span>Built for Zimbabwe 🇿🇼</span>
        </div>

      </footer>

      <style>{`

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background: #f7f9fc;
          color: #10233f;
        }

        button,
        input {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        /* NEWS */

        .mm-news {
          height: 38px;
          background: #06244a;
          color: white;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .mm-news-label {
          height: 100%;
          padding: 0 22px;
          display: flex;
          align-items: center;
          gap: 9px;
          background: #0756b7;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .12em;
          white-space: nowrap;
          z-index: 3;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6ec6ff;
          box-shadow: 0 0 0 4px rgba(110,198,255,.18);
        }

        .mm-news-window {
          overflow: hidden;
          flex: 1;
          white-space: nowrap;
        }

        .mm-news-track {
          display: inline-flex;
          align-items: center;
          animation: ticker 32s linear infinite;
        }

        .mm-news-item {
          display: inline-flex;
          align-items: center;
          padding: 0 34px;
          font-size: 12px;
          font-weight: 600;
          color: #dcecff;
        }

        @keyframes ticker {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        /* HEADER */

        .mm-header {
          background: white;
          border-bottom: 1px solid #e6edf5;
        }

        .mm-header-inner {
          max-width: 1440px;
          margin: auto;
          padding: 18px 42px;
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .mm-logo {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 225px;
        }

        .mm-logo-mark {
          width: 43px;
          height: 43px;
          border-radius: 10px;
          background: linear-gradient(135deg,#0874df,#043c91);
          color: white;
          display: grid;
          place-items: center;
          font-size: 22px;
          font-weight: 900;
          box-shadow: 0 7px 20px rgba(7,89,184,.22);
        }

        .mm-logo-name {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -.04em;
          color: #09264b;
        }

        .mm-logo-sub {
          font-size: 9px;
          color: #7890aa;
          font-weight: 700;
          margin-top: 2px;
        }

        .mm-search {
          height: 48px;
          flex: 1;
          max-width: 670px;
          display: flex;
          align-items: center;
          background: #f3f7fc;
          border: 1px solid #dce7f3;
          border-radius: 7px;
          overflow: hidden;
        }

        .mm-search > span {
          font-size: 26px;
          color: #7890aa;
          padding-left: 16px;
        }

        .mm-search input {
          flex: 1;
          height: 100%;
          border: 0;
          outline: none;
          background: transparent;
          padding: 0 14px;
          color: #10233f;
        }

        .mm-search button {
          height: 100%;
          border: 0;
          padding: 0 25px;
          color: white;
          font-weight: 800;
          background: #0867ca;
        }

        .mm-header-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .mm-action {
          border: 0;
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: #183553;
        }

        .mm-action span {
          font-size: 21px;
        }

        .mm-action small {
          font-size: 10px;
          font-weight: 700;
        }

        .mm-cart {
          position: relative;
          border: 0;
          background: #eef6ff;
          width: 45px;
          height: 45px;
          border-radius: 8px;
          font-size: 19px;
        }

        .mm-cart b {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 19px;
          height: 19px;
          border-radius: 50%;
          background: #0874df;
          color: white;
          font-size: 10px;
          display: grid;
          place-items: center;
        }

        /* NAV */

        .mm-nav {
          background: white;
          border-bottom: 1px solid #e5edf5;
        }

        .mm-nav-inner {
          max-width: 1440px;
          margin: auto;
          padding: 0 42px;
          height: 54px;
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .mm-nav a {
          font-size: 13px;
          font-weight: 700;
          color: #38506b;
        }

        .mm-nav a:hover {
          color: #0867ca;
        }

        .category-menu {
          height: 36px;
          border: 0;
          border-radius: 5px;
          padding: 0 18px;
          background: #eaf4ff;
          color: #0757a9;
          font-weight: 800;
          font-size: 12px;
        }

        .nav-spacer {
          flex: 1;
        }

        .seller-button {
          border: 0;
          background: #0867ca;
          color: white;
          height: 35px;
          padding: 0 17px;
          border-radius: 5px;
          font-weight: 800;
          font-size: 12px;
        }

        /* HERO */

        .mm-hero {
          background:
            radial-gradient(circle at 75% 20%, #d8ecff 0, transparent 34%),
            linear-gradient(110deg,#edf7ff,#ffffff 58%);
          overflow: hidden;
        }

        .mm-hero-inner {
          max-width: 1440px;
          min-height: 520px;
          margin: auto;
          padding: 60px 42px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: center;
        }

        .hero-tag,
        .section-kicker {
          font-size: 11px;
          letter-spacing: .16em;
          font-weight: 900;
          color: #0870d5;
        }

        .mm-hero h1 {
          font-size: clamp(48px,5vw,74px);
          line-height: .98;
          letter-spacing: -.065em;
          margin: 15px 0 25px;
          color: #09264b;
        }

        .mm-hero h1 span {
          color: #0870d5;
        }

        .mm-hero-copy > p {
          max-width: 580px;
          font-size: 17px;
          line-height: 1.7;
          color: #61748c;
          margin-bottom: 28px;
        }

        .hero-buttons {
          display: flex;
          gap: 12px;
        }

        .primary-button,
        .secondary-button {
          height: 49px;
          padding: 0 24px;
          border-radius: 6px;
          font-weight: 800;
          border: 1px solid #d8e5f2;
        }

        .primary-button {
          background: #0867ca;
          color: white;
          border-color: #0867ca;
          box-shadow: 0 9px 25px rgba(8,103,202,.2);
        }

        .secondary-button {
          background: white;
          color: #17456f;
        }

        .hero-trust {
          display: flex;
          align-items: center;
          gap: 19px;
          margin-top: 42px;
        }

        .trust-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .trust-item strong {
          color: #0a2d56;
          font-size: 18px;
        }

        .trust-item span {
          color: #8192a8;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .trust-divider {
          width: 1px;
          height: 30px;
          background: #cfdae6;
        }

        /* HERO VISUAL */

        .mm-hero-visual {
          position: relative;
          min-height: 440px;
        }

        .hero-blue-circle {
          position: absolute;
          width: 420px;
          height: 420px;
          right: 30px;
          top: 0;
          border-radius: 50%;
          background: linear-gradient(145deg,#bfe2ff,#e9f5ff);
        }

        .market-photo {
          position: absolute;
          right: 35px;
          top: 45px;
          width: 390px;
          height: 350px;
          overflow: hidden;
          border-radius: 18px;
          transform: rotate(2deg);
          box-shadow: 0 30px 60px rgba(17,60,105,.22);
          border: 9px solid white;
        }

        .market-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .floating-card {
          position: absolute;
          z-index: 4;
          background: white;
          padding: 13px 16px;
          border-radius: 9px;
          box-shadow: 0 15px 40px rgba(14,58,105,.17);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .floating-card > span {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: #edf6ff;
          display: grid;
          place-items: center;
          font-size: 19px;
        }

        .floating-card strong {
          display: block;
          font-size: 12px;
          color: #15385d;
        }

        .floating-card small {
          display: block;
          font-size: 9px;
          color: #8798aa;
          margin-top: 3px;
        }

        .card-one {
          left: 10px;
          top: 85px;
        }

        .card-two {
          right: 0;
          bottom: 40px;
        }

        .hero-price {
          position: absolute;
          left: 25px;
          bottom: 15px;
          z-index: 5;
          padding: 18px 22px;
          background: #0759b4;
          color: white;
          border-radius: 10px;
          box-shadow: 0 20px 35px rgba(7,89,180,.25);
        }

        .hero-price small {
          display: block;
          font-size: 8px;
          letter-spacing: .14em;
          opacity: .75;
          margin-bottom: 7px;
        }

        .hero-price strong {
          display: inline-block;
          margin-right: 8px;
          font-size: 14px;
        }

        /* SECTIONS */

        .mm-section {
          max-width: 1440px;
          margin: auto;
          padding: 70px 42px;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 28px;
        }

        .section-heading h2,
        .center-heading h2 {
          font-size: 32px;
          letter-spacing: -.045em;
          color: #0b294d;
          margin: 7px 0 0;
        }

        .view-all {
          border: 0;
          background: transparent;
          color: #0867ca;
          font-weight: 800;
          font-size: 12px;
        }

        /* CATEGORY */

        .category-row {
          display: grid;
          grid-template-columns: repeat(6,1fr);
          gap: 12px;
        }

        .category-card {
          min-height: 140px;
          background: white;
          border: 1px solid #e3ebf3;
          border-radius: 8px;
          padding: 20px;
          text-align: left;
          transition: .2s ease;
        }

        .category-card:hover,
        .category-card.selected {
          border-color: #6baee9;
          box-shadow: 0 12px 30px rgba(21,88,147,.08);
          transform: translateY(-2px);
        }

        .category-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: #edf6ff;
          display: grid;
          place-items: center;
          font-size: 23px;
          margin-bottom: 15px;
        }

        .category-card strong {
          display: block;
          font-size: 13px;
          color: #173958;
        }

        .category-card span {
          display: block;
          margin-top: 6px;
          color: #8a9aac;
          font-size: 10px;
        }

        /* PRODUCTS */

        .products-section {
          padding-top: 20px;
        }

        .rail-buttons {
          display: flex;
          gap: 7px;
        }

        .rail-buttons button {
          width: 36px;
          height: 36px;
          border: 1px solid #dce6f0;
          background: white;
          border-radius: 5px;
          color: #2b557e;
        }

        .products-row {
          display: grid;
          grid-template-columns: repeat(6,1fr);
          gap: 15px;
        }

        .product-card {
          background: white;
          border: 1px solid #e2eaf3;
          border-radius: 8px;
          overflow: hidden;
          transition: .2s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 38px rgba(18,65,109,.11);
        }

        .product-image {
          height: 190px;
          position: relative;
          overflow: hidden;
          background: #eef5fb;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: .35s ease;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .product-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: white;
          color: #0867ca;
          font-size: 9px;
          font-weight: 900;
          padding: 6px 8px;
          border-radius: 4px;
          box-shadow: 0 5px 15px rgba(0,0,0,.08);
        }

        .heart-button {
          position: absolute;
          top: 9px;
          right: 9px;
          width: 31px;
          height: 31px;
          border: 0;
          border-radius: 50%;
          background: rgba(255,255,255,.92);
          color: #47647f;
          font-size: 17px;
        }

        .product-info {
          padding: 15px;
        }

        .product-info > small {
          color: #8a9aad;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .08em;
          font-weight: 800;
        }

        .product-info h3 {
          font-size: 14px;
          margin: 6px 0;
          color: #153654;
        }

        .product-rating {
          font-size: 9px;
          color: #0870d5;
          letter-spacing: 1px;
        }

        .product-rating span {
          color: #8d9daf;
          letter-spacing: 0;
        }

        .product-bottom {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-top: 14px;
        }

        .product-bottom strong {
          display: block;
          font-size: 17px;
          color: #092c54;
        }

        .product-bottom span {
          display: block;
          font-size: 9px;
          color: #9aa8b7;
          margin-top: 2px;
        }

        .add-button {
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 5px;
          background: #0867ca;
          color: white;
          font-size: 20px;
          line-height: 1;
        }

        /* DEAL */

        .deal-section {
          max-width: 1356px;
          margin: 20px auto 70px;
          min-height: 350px;
          padding: 55px 70px;
          background:
            radial-gradient(circle at 80% 50%,#2989df,transparent 30%),
            linear-gradient(115deg,#052c5d,#075fb9);
          color: white;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          overflow: hidden;
          border-radius: 4px;
        }

        .deal-label {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .18em;
          color: #b9ddff;
        }

        .deal-content h2 {
          font-size: 46px;
          line-height: 1;
          letter-spacing: -.06em;
          margin: 13px 0 18px;
        }

        .deal-content p {
          max-width: 470px;
          line-height: 1.7;
          color: #d6eaff;
        }

        .white-button,
        .seller-white-button {
          margin-top: 13px;
          background: white;
          border: 0;
          color: #0758ad;
          padding: 13px 20px;
          border-radius: 5px;
          font-weight: 900;
        }

        .deal-visual {
          position: relative;
          height: 270px;
        }

        .deal-visual img {
          position: absolute;
          right: 15px;
          top: 0;
          width: 320px;
          height: 250px;
          object-fit: cover;
          border-radius: 12px;
          transform: rotate(4deg);
          border: 7px solid rgba(255,255,255,.9);
          box-shadow: 0 25px 60px rgba(0,0,0,.2);
        }

        .deal-circle {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.25);
          right: 45px;
          top: 5px;
        }

        .deal-floating {
          position: absolute;
          left: 20px;
          bottom: 15px;
          background: white;
          color: #0758ad;
          padding: 13px 17px;
          border-radius: 7px;
          box-shadow: 0 15px 30px rgba(0,0,0,.2);
        }

        .deal-floating strong,
        .deal-floating span {
          display: block;
        }

        .deal-floating strong {
          font-size: 14px;
        }

        .deal-floating span {
          font-size: 9px;
          letter-spacing: .15em;
          margin-top: 3px;
        }

        /* HOW */

        .center-heading {
          text-align: center;
          max-width: 650px;
          margin: 0 auto 55px;
        }

        .center-heading p {
          color: #71839a;
          line-height: 1.7;
        }

        .steps {
          display: grid;
          grid-template-columns: 1fr 90px 1fr 90px 1fr;
          align-items: center;
        }

        .step {
          text-align: center;
          padding: 20px;
        }

        .step-number {
          font-size: 10px;
          color: #75a8d8;
          font-weight: 900;
          letter-spacing: .15em;
        }

        .step-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #edf6ff;
          display: grid;
          place-items: center;
          margin: 13px auto;
          font-size: 28px;
        }

        .step h3 {
          margin: 8px 0;
          color: #153756;
        }

        .step p {
          color: #7d8fa2;
          font-size: 12px;
          line-height: 1.6;
          max-width: 220px;
          margin: auto;
        }

        .step-line {
          height: 1px;
          background: #d6e3ef;
        }

        /* SELLER */

        .seller-section {
          background: #eaf4ff;
          padding: 70px max(42px,calc((100vw - 1356px)/2));
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .section-kicker.light {
          color: #287bc3;
        }

        .seller-copy h2 {
          font-size: 55px;
          line-height: .98;
          letter-spacing: -.06em;
          color: #062c58;
          margin: 12px 0 20px;
        }

        .seller-copy p {
          max-width: 530px;
          color: #60758e;
          line-height: 1.7;
        }

        .seller-stats {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 15px;
        }

        .seller-stats div {
          background: white;
          padding: 25px 20px;
          border: 1px solid #dce9f5;
        }

        .seller-stats strong {
          display: block;
          color: #0867ca;
          font-size: 34px;
          letter-spacing: -.05em;
        }

        .seller-stats span {
          display: block;
          color: #7b8da1;
          font-size: 10px;
          line-height: 1.5;
          margin-top: 5px;
        }

        /* STORIES */

        .story-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 15px;
        }

        .story-card {
          min-height: 280px;
          overflow: hidden;
          position: relative;
          border-radius: 7px;
        }

        .story-card.large img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .story-overlay {
          position: absolute;
          inset: 0;
          padding: 25px;
          display: flex;
          flex-direction: column;
          justify-content: end;
          color: white;
          background: linear-gradient(transparent,rgba(3,26,53,.88));
        }

        .story-overlay span {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .14em;
        }

        .story-overlay h3 {
          font-size: 24px;
          line-height: 1.1;
          margin: 8px 0 0;
          max-width: 420px;
        }

        .story-blue {
          height: 100%;
          padding: 30px;
          background: #075db5;
          color: white;
        }

        .story-light {
          height: 100%;
          padding: 30px;
          background: #edf6ff;
          color: #12395e;
        }

        .story-card span {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .1em;
        }

        .story-card h3 {
          font-size: 25px;
          line-height: 1.08;
          letter-spacing: -.04em;
          margin-top: 60px;
        }

        .story-card p {
          font-size: 12px;
          line-height: 1.7;
          opacity: .78;
        }

        /* VISION */

        .vision-section {
          min-height: 580px;
          background: #062a55;
          color: white;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 80px max(42px,calc((100vw - 1356px)/2));
          overflow: hidden;
        }

        .vision-content > span {
          font-size: 10px;
          letter-spacing: .2em;
          color: #79bdf5;
          font-weight: 900;
        }

        .vision-content h2 {
          font-size: 72px;
          line-height: .9;
          letter-spacing: -.07em;
          margin: 18px 0 25px;
        }

        .vision-content h2 strong {
          color: #55aaf0;
        }

        .vision-content p {
          max-width: 520px;
          color: #c2d8ed;
          line-height: 1.7;
        }

        .vision-content button {
          margin-top: 18px;
          padding: 13px 20px;
          background: #0b72d5;
          color: white;
          border: 0;
          border-radius: 5px;
          font-weight: 800;
        }

        .vision-map {
          height: 400px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .map-ring {
          position: absolute;
          border: 1px solid rgba(102,183,243,.2);
          border-radius: 50%;
        }

        .ring-one {
          width: 180px;
          height: 180px;
        }

        .ring-two {
          width: 300px;
          height: 300px;
        }

        .ring-three {
          width: 430px;
          height: 430px;
        }

        .map-point {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 11px;
        }

        .map-point span {
          width: 10px;
          height: 10px;
          background: #5bb4f4;
          border-radius: 50%;
          box-shadow: 0 0 0 8px rgba(91,180,244,.1);
        }

        .point-mbare {
          left: 31%;
          top: 47%;
        }

        .point-harare {
          right: 18%;
          top: 28%;
        }

        .point-zim {
          right: 4%;
          bottom: 17%;
        }

        /* FOOTER */

        .mm-footer {
          background: white;
        }

        .footer-main {
          max-width: 1356px;
          margin: auto;
          padding: 65px 42px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 50px;
        }

        .footer-brand p {
          color: #7d8ea1;
          max-width: 300px;
          line-height: 1.6;
          font-size: 12px;
          margin-top: 20px;
        }

        .footer-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-column h4 {
          color: #163a5e;
          font-size: 12px;
          margin: 0 0 6px;
        }

        .footer-column a {
          color: #7a8da1;
          font-size: 11px;
        }

        .footer-column a:hover {
          color: #0867ca;
        }

        .footer-bottom {
          border-top: 1px solid #e5edf4;
          padding: 18px 42px;
          display: flex;
          justify-content: space-between;
          color: #91a0af;
          font-size: 10px;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {

          .mm-header-inner {
            padding: 15px 25px;
          }

          .mm-nav-inner {
            padding: 0 25px;
          }

          .mm-hero-inner,
          .mm-section {
            padding-left: 25px;
            padding-right: 25px;
          }

          .products-row {
            grid-template-columns: repeat(3,1fr);
          }

          .category-row {
            grid-template-columns: repeat(3,1fr);
          }

          .mm-header-actions {
            display: none;
          }

        }

        @media (max-width: 800px) {

          .mm-search {
            display: none;
          }

          .mm-logo {
            min-width: 0;
          }

          .mm-nav-inner {
            overflow-x: auto;
            gap: 18px;
          }

          .mm-nav a {
            white-space: nowrap;
          }

          .mm-hero-inner {
            grid-template-columns: 1fr;
          }

          .mm-hero-visual {
            min-height: 400px;
          }

          .deal-section {
            margin: 20px;
            padding: 40px 30px;
            grid-template-columns: 1fr;
          }

          .seller-section,
          .vision-section {
            grid-template-columns: 1fr;
            padding-left: 25px;
            padding-right: 25px;
          }

          .steps {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .step-line {
            display: none;
          }

          .story-grid {
            grid-template-columns: 1fr;
          }

          .footer-main {
            grid-template-columns: 1fr 1fr;
            padding-left: 25px;
            padding-right: 25px;
          }

        }

        @media (max-width: 550px) {

          .mm-header-inner {
            padding: 12px 15px;
          }

          .mm-logo-sub {
            display: none;
          }

          .mm-news-label {
            padding: 0 12px;
          }

          .mm-hero-inner {
            padding: 45px 18px;
          }

          .mm-hero h1 {
            font-size: 48px;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .category-row,
          .products-row {
            grid-template-columns: 1fr 1fr;
          }

          .mm-section {
            padding: 50px 18px;
          }

          .market-photo {
            width: 300px;
            height: 300px;
          }

          .hero-blue-circle {
            width: 330px;
            height: 330px;
          }

          .seller-stats {
            grid-template-columns: 1fr;
          }

          .vision-content h2 {
            font-size: 55px;
          }

          .footer-main {
            grid-template-columns: 1fr;
          }

          .footer-bottom {
            padding: 18px;
          }

        }

      `}</style>
    </div>
  );
}

export default Home;
