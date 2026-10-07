import { useEffect, useMemo, useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "Fresh Market Vegetables",
    seller: "Mbare Fresh Produce",
    category: "Fresh Produce",
    price: 12.5,
    oldPrice: 15,
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Premium Red Apples",
    seller: "Mbare Fruits Hub",
    category: "Fruits",
    price: 8.99,
    oldPrice: 11,
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Fresh Tomatoes",
    seller: "Mama Tariro Produce",
    category: "Fresh Produce",
    price: 6.5,
    oldPrice: 8,
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Market Shopping Basket",
    seller: "Mbare Home Store",
    category: "Household",
    price: 14.99,
    oldPrice: 18,
    image:
      "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Fresh Bananas",
    seller: "Chipo's Fruits",
    category: "Fruits",
    price: 5.99,
    oldPrice: 7.5,
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Fresh Maize",
    seller: "Mbare Farm Direct",
    category: "Local Foods",
    price: 10.99,
    oldPrice: 13,
    image:
      "https://images.unsplash.com/photo-1601593768797-9a7f7a1f1d93?auto=format&fit=crop&w=900&q=85",
  },
];

const categories = [
  {
    name: "Fresh Produce",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Fruits",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Groceries",
    image:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Clothing",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Household",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=700&q=85",
  },
];

const promotions = [
  {
    title: "Your Mbare Market. Now Online.",
    text: "Discover fresh produce, groceries, fashion and everyday essentials from trusted Mbare sellers.",
    button: "Shop Now",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1800&q=90",
  },
  {
    title: "Fresh From Mbare. Delivered.",
    text: "Order from local sellers and have your purchases delivered directly to your door.",
    button: "Explore Products",
    image:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1800&q=90",
  },
  {
    title: "Grow Your Business Beyond Mbare.",
    text: "Put your products in front of customers across Harare and, eventually, Zimbabwe.",
    button: "Become a Seller",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=90",
  },
];

function App() {
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [activePromotion, setActivePromotion] = useState(0);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePromotion((current) => (current + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification("");
    }, 2600);

    return () => clearTimeout(timer);
  }, [notification]);

  const filteredProducts = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(value) ||
        product.seller.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value)
    );
  }, [search]);

  const addToCart = (product) => {
    setCartCount((count) => count + 1);
    setNotification(`${product.name} added to cart`);
  };

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.includes(product.id);

      if (exists) {
        setNotification("Removed from wishlist");
        return current.filter((id) => id !== product.id);
      }

      setNotification("Added to wishlist");
      return [...current, product.id];
    });
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="app">

      {notification && (
        <div className="notification">
          <span>✓</span>
          {notification}
        </div>
      )}

      {/* MARKET NEWS */}
      <div className="news-bar">
        <div className="news-label">
          MARKET NEWS
        </div>

        <div className="news-track">
          <div className="news-content">
            <span>Fresh produce now available from Mbare sellers</span>
            <span>•</span>
            <span>Same-day delivery coming soon</span>
            <span>•</span>
            <span>New sellers joining Mbare Musika every week</span>
            <span>•</span>
            <span>Shop local. Support Zimbabwean businesses.</span>
            <span>•</span>
            <span>Fresh produce now available from Mbare sellers</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="main-header">
        <div className="header-inner">

          <div
            className="brand"
            onClick={() => scrollToSection("home")}
          >
            <div className="brand-mark">
              MM
            </div>

            <div>
              <div className="brand-name">
                Mbare Musika
              </div>

              <div className="brand-tagline">
                Zimbabwe's Digital Market
              </div>
            </div>
          </div>

          <div className="search-box">
            <span className="search-icon">⌕</span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, sellers and categories"
            />

            <button>
              Search
            </button>
          </div>

          <div className="header-actions">

            <button
              className="header-action"
              onClick={() =>
                setNotification(
                  `${wishlist.length} item${wishlist.length === 1 ? "" : "s"} in wishlist`
                )
              }
            >
              <span className="action-icon">♡</span>
              <span>
                Wishlist
                {wishlist.length > 0 && (
                  <small>{wishlist.length}</small>
                )}
              </span>
            </button>

            <button
              className="header-action"
              onClick={() =>
                setNotification("Customer account coming next")
              }
            >
              <span className="action-icon">♙</span>
              <span>Account</span>
            </button>

            <button
              className="cart-button"
              onClick={() =>
                setNotification(
                  cartCount
                    ? `${cartCount} item${cartCount === 1 ? "" : "s"} in your cart`
                    : "Your cart is empty"
                )
              }
            >
              <span className="cart-icon">🛒</span>
              <span>Cart</span>

              {cartCount > 0 && (
                <strong>{cartCount}</strong>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="navigation">
        <div className="nav-inner">

          <button
            className="nav-link active"
            onClick={() => scrollToSection("home")}
          >
            Home
          </button>

          <button
            className="nav-link"
            onClick={() => scrollToSection("products")}
          >
            Shop
          </button>

          <button
            className="nav-link"
            onClick={() => scrollToSection("categories")}
          >
            Categories
          </button>

          <button
            className="nav-link"
            onClick={() => scrollToSection("deals")}
          >
            Deals
          </button>

          <button
            className="nav-link"
            onClick={() => scrollToSection("sellers")}
          >
            Sellers
          </button>

          <button
            className="nav-link"
            onClick={() => scrollToSection("stories")}
          >
            Stories
          </button>

          <button
            className="seller-nav"
            onClick={() =>
              setNotification("Seller registration is coming next")
            }
          >
            Become a Seller
          </button>

        </div>
      </nav>

      {/* HERO */}
      <main>

        <section
          className="hero"
          id="home"
          style={{
            backgroundImage: `
              linear-gradient(
                90deg,
                rgba(2,18,48,.96) 0%,
                rgba(2,18,48,.83) 38%,
                rgba(2,18,48,.28) 72%,
                rgba(2,18,48,.08) 100%
              ),
              url("${promotions[activePromotion].image}")
            `,
          }}
        >

          <div className="hero-inner">

            <div className="hero-copy">

              <div className="hero-badge">
                <span></span>
                ZIMBABWE'S DIGITAL MARKETPLACE
              </div>

              <h1>
                {promotions[activePromotion].title}
              </h1>

              <p>
                {promotions[activePromotion].text}
              </p>

              <div className="hero-buttons">

                <button
                  className="primary-button"
                  onClick={() => scrollToSection("products")}
                >
                  {promotions[activePromotion].button}
                  <span>→</span>
                </button>

                <button
                  className="secondary-button"
                  onClick={() =>
                    setNotification("Seller registration is coming next")
                  }
                >
                  Become a Seller
                </button>

              </div>

              <div className="hero-trust">
                <div>
                  <strong>1.5M+</strong>
                  <span>Daily market activity</span>
                </div>

                <div>
                  <strong>Local</strong>
                  <span>Trusted sellers</span>
                </div>

                <div>
                  <strong>Fast</strong>
                  <span>Local delivery</span>
                </div>
              </div>

            </div>

          </div>

          <div className="hero-dots">
            {promotions.map((_, index) => (
              <button
                key={index}
                className={index === activePromotion ? "selected" : ""}
                onClick={() => setActivePromotion(index)}
              />
            ))}
          </div>

        </section>

        {/* CATEGORIES */}
        <section
          className="section"
          id="categories"
        >

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                DISCOVER MORE
              </span>

              <h2>
                Shop by Category
              </h2>

              <p>
                Find everything you need from the heart of Mbare.
              </p>
            </div>

            <button
              className="text-button"
              onClick={() => scrollToSection("products")}
            >
              View all categories →
            </button>

          </div>

          <div className="category-grid">

            {categories.map((category) => (
              <button
                className="category-card"
                key={category.name}
                onClick={() => {
                  setSearch(category.name);
                  scrollToSection("products");
                }}
              >

                <div className="category-image">
                  <img
                    src={category.image}
                    alt={category.name}
                  />
                </div>

                <div className="category-overlay"></div>

                <div className="category-name">
                  {category.name}
                  <span>→</span>
                </div>

              </button>
            ))}

          </div>

        </section>

        {/* PRODUCTS */}
        <section
          className="section products-section"
          id="products"
        >

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                SHOP LOCAL
              </span>

              <h2>
                Featured Products
              </h2>

              <p>
                Popular products from trusted Mbare sellers.
              </p>
            </div>

            <button
              className="text-button"
              onClick={() => {
                setSearch("");
                scrollToSection("products");
              }}
            >
              See all products →
            </button>

          </div>

          <div className="product-grid">

            {filteredProducts.map((product) => (
              <article
                className="product-card"
                key={product.id}
              >

                <div className="product-image">

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                  <button
                    className={`wishlist ${
                      wishlist.includes(product.id)
                        ? "liked"
                        : ""
                    }`}
                    onClick={() => toggleWishlist(product)}
                  >
                    {wishlist.includes(product.id)
                      ? "♥"
                      : "♡"}
                  </button>

                  <span className="product-badge">
                    LOCAL
                  </span>

                </div>

                <div className="product-info">

                  <span className="product-category">
                    {product.category}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="seller-name">
                    Sold by <strong>{product.seller}</strong>
                  </p>

                  <div className="rating">
                    <span>★★★★★</span>
                    <small>4.8</small>
                  </div>

                  <div className="product-bottom">

                    <div className="price">
                      <strong>
                        ${product.price.toFixed(2)}
                      </strong>

                      <del>
                        ${product.oldPrice.toFixed(2)}
                      </del>
                    </div>

                    <button
                      className="add-button"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>

                  </div>

                </div>

              </article>
            ))}

          </div>

          {filteredProducts.length === 0 && (
            <div className="no-results">
              <h3>No products found</h3>
              <p>
                Try searching for vegetables, fruits, groceries or another category.
              </p>

              <button
                className="primary-button small"
                onClick={() => setSearch("")}
              >
                Show Products
              </button>
            </div>
          )}

        </section>

        {/* DEAL */}
        <section
          className="deal-section"
          id="deals"
        >

          <div className="deal-inner">

            <div className="deal-copy">

              <span className="deal-label">
                TODAY'S MARKET DEAL
              </span>

              <h2>
                Fresh produce.
                <br />
                Better prices.
              </h2>

              <p>
                Discover great-value products from local sellers
                while supporting businesses right here in Zimbabwe.
              </p>

              <button
                className="white-button"
                onClick={() => scrollToSection("products")}
              >
                Shop Today's Deals →
              </button>

            </div>

            <div className="deal-visual">

              <img
                src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=90"
                alt="Fresh market produce"
              />

              <div className="deal-price">
                <span>FROM</span>
                <strong>$5.99</strong>
              </div>

            </div>

          </div>

        </section>

        {/* BENEFITS */}
        <section className="benefits">

          <div className="benefit">
            <div className="benefit-icon">🚚</div>

            <div>
              <h3>Local Delivery</h3>
              <p>
                Convenient delivery from market to your doorstep.
              </p>
            </div>
          </div>

          <div className="benefit">
            <div className="benefit-icon">✓</div>

            <div>
              <h3>Trusted Sellers</h3>
              <p>
                Discover local businesses and verified marketplace sellers.
              </p>
            </div>
          </div>

          <div className="benefit">
            <div className="benefit-icon">◆</div>

            <div>
              <h3>Shop Local</h3>
              <p>
                Keep more money circulating through Zimbabwean businesses.
              </p>
            </div>
          </div>

          <div className="benefit">
            <div className="benefit-icon">↗</div>

            <div>
              <h3>Growing Marketplace</h3>
              <p>
                More sellers and products joining every day.
              </p>
            </div>
          </div>

        </section>

        {/* HOW IT WORKS */}
        <section className="section how-section">

          <div className="center-heading">

            <span className="eyebrow">
              SIMPLE & CONVENIENT
            </span>

            <h2>
              How Mbare Musika Works
            </h2>

            <p>
              Bringing the energy of Mbare's market to your phone.
            </p>

          </div>

          <div className="steps">

            <div className="step">
              <div className="step-number">01</div>
              <div className="step-icon">⌕</div>
              <h3>Discover</h3>
              <p>
                Search products and discover trusted sellers from Mbare.
              </p>
            </div>

            <div className="step">
              <div className="step-number">02</div>
              <div className="step-icon">🛒</div>
              <h3>Order</h3>
              <p>
                Choose what you need and place your order online.
              </p>
            </div>

            <div className="step">
              <div className="step-number">03</div>
              <div className="step-icon">✓</div>
              <h3>Seller Prepares</h3>
              <p>
                Your local seller receives and prepares your order.
              </p>
            </div>

            <div className="step">
              <div className="step-number">04</div>
              <div className="step-icon">🚚</div>
              <h3>Delivered</h3>
              <p>
                A local rider brings your purchase directly to you.
              </p>
            </div>

          </div>

        </section>

        {/* SELLER */}
        <section
          className="seller-section"
          id="sellers"
        >

          <div className="seller-inner">

            <div className="seller-copy">

              <span className="eyebrow light">
                FOR MBARÉ BUSINESSES
              </span>

              <h2>
                Grow Your Business Beyond Mbare.
              </h2>

              <p>
                Turn your market stall into a digital storefront.
                Reach customers who may never physically walk through
                the market.
              </p>

              <div className="seller-stats">

                <div>
                  <strong>24/7</strong>
                  <span>Online storefront</span>
                </div>

                <div>
                  <strong>1.5M+</strong>
                  <span>Potential market activity</span>
                </div>

                <div>
                  <strong>∞</strong>
                  <span>Growth potential</span>
                </div>

              </div>

              <button
                className="primary-button"
                onClick={() =>
                  setNotification("Seller portal coming next")
                }
              >
                Start Selling
                <span>→</span>
              </button>

            </div>

            <div className="seller-dashboard">

              <div className="dashboard-top">
                <div>
                  <span>SELLER DASHBOARD</span>
                  <strong>Monthly Sales</strong>
                </div>

                <div className="dashboard-value">
                  +28.6%
                </div>
              </div>

              <div className="chart">

                <div className="chart-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <svg
                  viewBox="0 0 600 220"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#61b9ff"
                        stopOpacity=".45"
                      />
                      <stop
                        offset="100%"
                        stopColor="#61b9ff"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0,190 C60,175 80,160 120,170 C165,180 175,130 225,145 C270,158 295,100 340,115 C390,130 420,75 465,90 C520,110 535,40 600,55 L600,220 L0,220 Z"
                    fill="url(#chartGradient)"
                  />

                  <path
                    d="M0,190 C60,175 80,160 120,170 C165,180 175,130 225,145 C270,158 295,100 340,115 C390,130 420,75 465,90 C520,110 535,40 600,55"
                    fill="none"
                    stroke="#8ed0ff"
                    strokeWidth="4"
                  />
                </svg>

              </div>

              <div className="chart-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>

            </div>

          </div>

        </section>

        {/* STORIES */}
        <section
          className="section stories-section"
          id="stories"
        >

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                OUR COMMUNITY
              </span>

              <h2>
                Stories From The Market
              </h2>

              <p>
                Real people. Local businesses. One growing marketplace.
              </p>
            </div>

          </div>

          <div className="stories-grid">

            <article className="story-card large">

              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=90"
                alt="Business owner"
              />

              <div className="story-overlay">
                <span>SELLER STORY</span>
                <h3>
                  From a market stall to customers across Harare.
                </h3>
              </div>

            </article>

            <article className="story-card">

              <img
                src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=90"
                alt="Customer shopping"
              />

              <div className="story-overlay">
                <span>CUSTOMER STORY</span>
                <h3>
                  Your favourite market, without the journey.
                </h3>
              </div>

            </article>

            <article className="story-card">

              <img
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=900&q=90"
                alt="Delivery rider"
              />

              <div className="story-overlay">
                <span>RIDER STORY</span>
                <h3>
                  Creating new opportunities through local delivery.
                </h3>
              </div>

            </article>

          </div>

        </section>

        {/* VISION */}
        <section className="vision-section">

          <div className="vision-inner">

            <div className="vision-map">

              <div className="map-grid"></div>

              <div className="map-center">
                <span>MM</span>
              </div>

              <div className="map-dot dot-one"></div>
              <div className="map-dot dot-two"></div>
              <div className="map-dot dot-three"></div>
              <div className="map-dot dot-four"></div>

              <div className="map-line line-one"></div>
              <div className="map-line line-two"></div>
              <div className="map-line line-three"></div>

            </div>

            <div className="vision-copy">

              <span className="eyebrow">
                THE BIGGER VISION
              </span>

              <h2>
                From Mbare to Zimbabwe.
              </h2>

              <p>
                Mbare Musika starts with one of Zimbabwe's busiest
                trading centres, but the opportunity extends far beyond
                one market.
              </p>

              <p>
                Our vision is to build a digital marketplace where
                businesses across Zimbabwe can reach customers,
                process orders and participate in the growth of the
                country's digital economy.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  setNotification("Expansion vision coming soon")
                }
              >
                Explore Our Vision →
              </button>

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-inner">

          <div className="footer-brand">

            <div className="brand-mark">
              MM
            </div>

            <div>
              <div className="brand-name">
                Mbare Musika
              </div>

              <p>
                Your Mbare Market. Now Online.
              </p>
            </div>

          </div>

          <div className="footer-links">

            <div>
              <h4>Marketplace</h4>
              <button onClick={() => scrollToSection("products")}>
                Shop
              </button>
              <button onClick={() => scrollToSection("categories")}>
                Categories
              </button>
              <button onClick={() => scrollToSection("deals")}>
                Deals
              </button>
            </div>

            <div>
              <h4>Business</h4>
              <button
                onClick={() =>
                  setNotification("Seller portal coming next")
                }
              >
                Become a Seller
              </button>
              <button
                onClick={() =>
                  setNotification("Rider registration coming next")
                }
              >
                Become a Rider
              </button>
              <button
                onClick={() =>
                  setNotification("Seller portal coming next")
                }
              >
                Seller Portal
              </button>
            </div>

            <div>
              <h4>Help</h4>
              <button
                onClick={() =>
                  setNotification("Help centre coming next")
                }
              >
                Help Centre
              </button>
              <button
                onClick={() =>
                  setNotification("Delivery information coming next")
                }
              >
                Delivery
              </button>
              <button
                onClick={() =>
                  setNotification("Contact page coming next")
                }
              >
                Contact Us
              </button>
            </div>

          </div>

        </div>

        <div className="footer-bottom">
          <span>
            © 2026 Mbare Musika. Built in Zimbabwe.
          </span>

          <span>
            Connecting sellers • customers • riders
          </span>
        </div>

      </footer>

    </div>
  );
}

export default App;
