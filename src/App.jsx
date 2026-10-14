import { useEffect, useMemo, useState } from "react";
import { apiRequest, getSavedSession, saveSession, clearSession } from "./api.js";
import "./App.css";
import ManagementDashboard from "./ManagementDashboard.jsx";
import AccountPortal from "./AccountPortal.jsx";
import SellerDashboard from "./SellerDashboard.jsx";

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
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem("mm_cart") || "[]"); } catch { return []; } });
  const [wishlist, setWishlist] = useState(() => { try { return JSON.parse(localStorage.getItem("mm_wishlist") || "[]"); } catch { return []; } });
  const [liveProducts, setLiveProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersBusy, setOrdersBusy] = useState(false);
  const [session, setSession] = useState(() => getSavedSession());
  const [modal, setModal] = useState("");
  const [formBusy, setFormBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [activePromotion, setActivePromotion] = useState(0);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    apiRequest("/products").then((result) => {
      const rows = Array.isArray(result) ? result : (result.products || result.data || result.items || []);
      if (Array.isArray(rows) && rows.length) {
        setLiveProducts(rows.map((p) => ({
          id: p.id, name: p.name || "Market product", seller: p.business_name || p.seller_name || p.seller?.business_name || p.seller?.name || (typeof p.seller === "string" ? p.seller : "Mbare seller"),
          category: p.category_name || p.category?.name || (typeof p.category === "string" ? p.category : "Groceries"), price: Number(p.price || 0), oldPrice: Number(p.old_price || p.price || 0),
          currency: String(p.currency || "USD").trim(), image: p.image_url || p.imageUrl || p.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=85",
          stock: Number(p.stock_quantity ?? p.stock ?? 0), isLive: true
        })));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem("mm_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("mm_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

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

  const catalog = liveProducts.length ? liveProducts : products.map((p) => ({ ...p, isLive: false, currency: "USD" }));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return catalog;

    return catalog.filter(
      (product) =>
        product.name.toLowerCase().includes(value) ||
        product.seller.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value)
    );
  }, [search, liveProducts]);

  const addToCart = (product) => {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...product, quantity: 1 }];
    });
    setNotification(`${product.name} added to cart`);
  };

  const updateQuantity = (id, delta) => setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  const removeCartItem = (id) => setCart((current) => current.filter((item) => item.id !== id));
  const openModal = (name) => { setFormError(""); setFormSuccess(""); setModal(name); };
  const loadOrders = async () => {
    if (!session?.token) { openModal("login"); setFormError("Sign in to view your orders."); return; }
    setModal("orders"); setOrdersBusy(true); setFormError("");
    try {
      const result = await apiRequest("/orders/mine", {}, session.token);
      const rows = Array.isArray(result) ? result : (result.orders || result.data || result.items || []);
      setOrders(Array.isArray(rows) ? rows : []);
    } catch (error) { setFormError(error.message || "Could not load your orders."); }
    finally { setOrdersBusy(false); }
  };

  const submitAccount = async (event) => {
    event.preventDefault(); setFormBusy(true); setFormError(""); setFormSuccess("");
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(data.entries());
    const mode = modal;
    if (mode !== "login" && mode !== "account") payload.role = mode === "seller" ? "SELLER" : mode === "rider" ? "RIDER" : "CUSTOMER";
    try {
      const result = await apiRequest(mode === "login" || mode === "account" ? "/auth/login" : "/auth/register", { method: "POST", body: payload });
      const token = result.token || result.accessToken || result.data?.token || result.data?.accessToken;
      const user = result.user || result.data?.user || result.customer || null;
      if (token) {
      saveSession({ token, user });
      setSession({ token, user });
      const role = String(user?.role || "").toUpperCase();
      const destination = role === "OWNER" || role === "ADMIN"
        ? "/management"
        : role === "SELLER"
          ? "/seller"
          : role === "RIDER"
            ? "/rider"
            : "/account";
      window.location.assign(destination);
      return;
    }
      else if (mode === "register") { setFormSuccess("Account created. Please sign in if a token was not returned."); }
      else { setFormError(result.message || "Login succeeded but the API did not return a token. Check the API response format."); }
    } catch (error) { setFormError(error.message || "Unable to connect to the marketplace API."); }
    finally { setFormBusy(false); }
  };

  const submitOrder = async (event) => {
    event.preventDefault(); setFormBusy(true); setFormError(""); setFormSuccess("");
    if (!session?.token) { setFormBusy(false); setFormError("Please sign in before placing an order."); return; }
    if (!cart.length || cart.some((item) => !item.isLive || typeof item.id !== "string")) { setFormBusy(false); setFormError("The cart contains demo products. Refresh the page after the backend has real approved product listings, then add those products to your cart."); return; }
    const data = new FormData(event.currentTarget);
    try {
      const result = await apiRequest("/orders", { method: "POST", body: { items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })), deliveryAddress: `${String(data.get("deliveryArea") || "").trim()} â€” ${String(data.get("deliveryAddress") || "").trim()}` } }, session.token);
      setCart([]); setFormSuccess(`Order placed successfully${result.order?.id || result.id ? ` (reference: ${result.order?.id || result.id})` : ""}.`); setNotification("Your order has been submitted");
    } catch (error) { setFormError(error.message || "Could not place order."); }
    finally { setFormBusy(false); }
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
    <>
      {["/management", "/owner"].includes(window.location.pathname.replace(/\/+$/, "")) ? <ManagementDashboard /> : window.location.pathname.replace(/\/+$/, "") === "/seller" ? <SellerDashboard /> : ["/account", "/login", "/rider"].includes(window.location.pathname.replace(/\/+$/, "")) ? <AccountPortal /> : (
      <div className="app">

      {notification && (
        <div className="notification">
          <span>âœ“</span>
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
            <span>â€¢</span>
            <span>Local delivery options depend on your area</span>
            <span>â€¢</span>
            <span>New sellers joining Mbare Musika every week</span>
            <span>â€¢</span>
            <span>Shop local. Support Zimbabwean businesses.</span>
            <span>â€¢</span>
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
            <span className="search-icon">Ã¢Å’â€¢</span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, sellers and categories"
            />

            <button onClick={() => { scrollToSection("products"); setNotification(search.trim() ? `Showing results for ${search}` : "Showing all products"); }}>
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
              <span className="action-icon">â™¡</span>
              <span>
                Wishlist
                {wishlist.length > 0 && (
                  <small>{wishlist.length}</small>
                )}
              </span>
            </button>

            <button
              className="header-action"
              onClick={() => { window.location.href = "/account"; }}
            >
              <span className="action-icon">â™™</span>
              <span>Account</span>
            </button>

            <button
              className="cart-button"
              onClick={() => openModal("cart")}
            >
              <span className="cart-icon">Ã°Å¸â€ºâ€™</span>
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
              openModal("seller")
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
                  <span>â†’</span>
                </button>

                <button
                  className="secondary-button"
                  onClick={() =>
                    openModal("seller")
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
              View all categories â†’
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
                  <span>â†’</span>
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
              See all products â†’
            </button>

          </div>

          <div className="product-grid">

            {filteredProducts.map((product) => (
              <article
                className="product-card"
                key={product.id}
              >

                <div className="product-image" onClick={() => { setSelectedProduct(product); openModal("product"); }} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") { setSelectedProduct(product); openModal("product"); } }}>

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
                      ? "â™¥"
                      : "â™¡"}
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
                    <span>Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦Ã¢Ëœâ€¦</span>
                    <small>4.8</small>
                  </div>

                  <div className="product-bottom">

                    <div className="price">
                      <strong>
                        ${product.currency || "USD"} {product.price.toFixed(2)}
                      </strong>

                      <del>
                        ${product.currency || "USD"} {product.oldPrice.toFixed(2)}
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
                Shop Today's Deals â†’
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
            <div className="benefit-icon">Ã°Å¸Å¡Å¡</div>

            <div>
              <h3>Local Delivery</h3>
              <p>
                Convenient delivery from market to your doorstep.
              </p>
            </div>
          </div>

          <div className="benefit">
            <div className="benefit-icon">âœ“</div>

            <div>
              <h3>Trusted Sellers</h3>
              <p>
                Discover local businesses and verified marketplace sellers.
              </p>
            </div>
          </div>

          <div className="benefit">
            <div className="benefit-icon">Ã¢â€”â€ </div>

            <div>
              <h3>Shop Local</h3>
              <p>
                Keep more money circulating through Zimbabwean businesses.
              </p>
            </div>
          </div>

          <div className="benefit">
            <div className="benefit-icon">â†—</div>

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
              <div className="step-icon">Ã¢Å’â€¢</div>
              <h3>Discover</h3>
              <p>
                Search products and discover trusted sellers from Mbare.
              </p>
            </div>

            <div className="step">
              <div className="step-number">02</div>
              <div className="step-icon">Ã°Å¸â€ºâ€™</div>
              <h3>Order</h3>
              <p>
                Choose what you need and place your order online.
              </p>
            </div>

            <div className="step">
              <div className="step-number">03</div>
              <div className="step-icon">âœ“</div>
              <h3>Seller Prepares</h3>
              <p>
                Your local seller receives and prepares your order.
              </p>
            </div>

            <div className="step">
              <div className="step-number">04</div>
              <div className="step-icon">Ã°Å¸Å¡Å¡</div>
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
                FOR MBARÃ‰ BUSINESSES
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
                  <strong>Ã¢Ë†Å¾</strong>
                  <span>Growth potential</span>
                </div>

              </div>

              <button
                className="primary-button"
                onClick={() =>
                  openModal("seller")
                }
              >
                Start Selling
                <span>â†’</span>
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
                  openModal("about")
                }
              >
                Explore Our Vision â†’
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
                  openModal("seller")
                }
              >
                Become a Seller
              </button>
              <button
                onClick={() =>
                  openModal("rider")
                }
              >
                Become a Rider
              </button>
              <button
                onClick={() =>
                  openModal("seller")
                }
              >
                Seller Portal
              </button>
            </div>

            <div>
              <h4>Help</h4>
              <button
                onClick={() =>
                  openModal("help")
                }
              >
                Help Centre
              </button>
              <button
                onClick={() =>
                  openModal("delivery")
                }
              >
                Delivery
              </button>
              <button
                onClick={() =>
                  openModal("contact")
                }
              >
                Contact Us
              </button>
            </div>

          </div>

        </div>

        <div className="footer-bottom">
          <span>
            Ã‚Â© 2026 Mbare Musika. Built in Zimbabwe.
          </span>

          <span>
            Connecting sellers â€¢ customers â€¢ riders
          </span>
        </div>

      </footer>

      {modal && (
        <div className="mm-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(""); }}>
          <section className="mm-modal" role="dialog" aria-modal="true" aria-labelledby="mm-modal-title">
            <button className="mm-modal-close" aria-label="Close" onClick={() => setModal("")}>Ã—</button>
            {modal === "cart" && <>
              <span className="eyebrow">YOUR BASKET</span><h2 id="mm-modal-title">Shopping cart</h2>
              {cart.length === 0 ? <p>Your cart is empty. Browse the marketplace and add products to begin.</p> : <>
                <div className="mm-cart-list">{cart.map((item) => <div className="mm-cart-row" key={item.id}>
                  <img src={item.image} alt=""/><div className="mm-cart-info"><strong>{item.name}</strong><small>{item.currency || "USD"} {item.price.toFixed(2)} each</small>
                  <div className="mm-quantity"><button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity">Ã¢Ë†â€™</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity">+</button><button className="mm-remove" onClick={() => removeCartItem(item.id)}>Remove</button></div></div>
                  <strong>{item.currency || "USD"} {(item.price * item.quantity).toFixed(2)}</strong></div>)}</div>
                <div className="mm-cart-total"><span>Subtotal</span><strong>{cart[0]?.currency || "USD"} {cartTotal.toFixed(2)}</strong></div>
                <button className="primary-button mm-full-button" onClick={() => { if (!session?.token) { setModal("login"); setFormError("Please sign in before checkout."); } else { setModal("checkout"); setFormError(""); } }}>Continue to checkout â†’</button>
              </>}
            </>}
            {(modal === "login" || modal === "account" || modal === "register" || modal === "seller" || modal === "rider") && <>
              <span className="eyebrow">MBARE MUSIKA ACCOUNT</span><h2 id="mm-modal-title">{(modal === "login" || modal === "account") ? "Your account" : modal === "seller" ? "Seller registration" : modal === "rider" ? "Rider registration" : "Create your account"}</h2>
              {session?.token && (modal === "login" || modal === "account") ? <div><p>You are signed in{session.user?.full_name ? ` as ${session.user.full_name}` : ""}.</p><button className="primary-button" onClick={loadOrders}>View my orders</button><button className="secondary-button" onClick={() => { clearSession(); setSession(null); setNotification("You have signed out"); setModal(""); }}>Sign out</button></div> : <form className="mm-form" onSubmit={submitAccount}>
                {modal !== "login" && <label>Full name<input name="fullName" autoComplete="name" required minLength="2" /></label>}
                <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
                {modal !== "login" && <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="e.g. +263â€¦" /></label>}
                <label>Password<input name="password" type="password" autoComplete={(modal === "login" || modal === "account") ? "current-password" : "new-password"} minLength="8" required /></label>
                {modal === "seller" && <><label>Business name<input name="businessName" required /></label><label>Business address<input name="businessAddress" required /></label></>}
                {modal === "rider" && <><label>Vehicle type<select name="vehicleType" required><option value="">Choose vehicle</option><option value="BICYCLE">Bicycle</option><option value="MOTORCYCLE">Motorcycle</option><option value="CAR">Car</option><option value="VAN">Van</option></select></label><label>Service area<input name="serviceArea" required placeholder="e.g. Mbare" /></label></>}
                <button className="primary-button mm-full-button" disabled={formBusy}>{formBusy ? "Please waitâ€¦" : modal === "login" ? "Sign in" : "Create account"}</button>
                {(modal === "login" || modal === "account") && <p className="mm-switch">New here? <button type="button" onClick={() => { setModal("register"); setFormError(""); }}>Create an account</button></p>}
                {modal === "register" && <p className="mm-switch">Already registered? <button type="button" onClick={() => { setModal("login"); setFormError(""); }}>Sign in</button></p>}
              </form>}
            </>}
            {modal === "product" && selectedProduct && <><span className="eyebrow">PRODUCT DETAILS</span><h2 id="mm-modal-title">{selectedProduct.name}</h2><img className="mm-product-detail-image" src={selectedProduct.image} alt={selectedProduct.name} /><p>Sold by <strong>{selectedProduct.seller}</strong></p><p>Category: {selectedProduct.category}</p><p className="mm-product-detail-price">{selectedProduct.currency || "USD"} {selectedProduct.price.toFixed(2)}</p>{selectedProduct.isLive ? <button className="primary-button mm-full-button" onClick={() => { addToCart(selectedProduct); setModal("cart"); }}>Add to cart</button> : <p className="mm-muted">This is a preview listing. Live checkout requires an approved product from the marketplace API.</p>}</>}
            {modal === "orders" && <><span className="eyebrow">CUSTOMER ACCOUNT</span><h2 id="mm-modal-title">My orders</h2>{ordersBusy ? <p>Loading your ordersâ€¦</p> : orders.length === 0 ? <p>No orders were returned for this account yet.</p> : <div className="mm-orders-list">{orders.map((order, index) => <article className="mm-order-card" key={order.id || index}><div><strong>Order {String(order.id || index + 1).slice(0, 12)}</strong><span>{order.status || "Status unavailable"}</span></div><p>{order.currency || "USD"} {Number(order.total || 0).toFixed(2)}</p><small>{order.created_at ? new Date(order.created_at).toLocaleString() : "Date not provided"}</small></article>)}</div>}<button className="secondary-button mm-full-button" onClick={() => setModal("account")}>Back to account</button></>}
            {modal === "checkout" && <><span className="eyebrow">DELIVERY DETAILS</span><h2 id="mm-modal-title">Checkout</h2><p>Confirm where your order should be delivered. Your order will be sent to the marketplace API.</p><form className="mm-form" onSubmit={submitOrder}><label>Delivery area<input name="deliveryArea" placeholder="e.g. Mbare, Harare" required /></label><label>Full delivery address<textarea name="deliveryAddress" minLength="5" maxLength="1000" required placeholder="Street, stand/house number, and delivery instructions" /></label><label>Contact phone<input name="phone" type="tel" required placeholder="+263â€¦" /></label><div className="mm-cart-total"><span>Order subtotal</span><strong>{cart[0]?.currency || "USD"} {cartTotal.toFixed(2)}</strong></div><p className="mm-muted">Delivery fee and payment options will be confirmed by the marketplace. This checkout does not collect card details.</p><button className="primary-button mm-full-button" disabled={formBusy}>{formBusy ? "Submitting orderâ€¦" : "Place order"}</button></form></>}
            {["help", "delivery", "contact", "about"].includes(modal) && <><span className="eyebrow">MBARE MUSIKA</span><h2 id="mm-modal-title">{({help:"Help centre",delivery:"Delivery information",contact:"Contact Mbare Musika",about:"About our marketplace"})[modal]}</h2><p>{({help:"For account, product, or order support, contact the marketplace team. Include your order reference if you have one.",delivery:"Delivery availability and fees depend on the delivery area and seller. Enter your full address at checkout. Orders from different customers remain separate.",contact:"Contact Mbare Musika for customer support, seller onboarding, delivery enquiries, and orders.",about:"Mbare Musika connects Zimbabwean customers with local market sellers. This marketplace is being prepared for a production launch."})[modal]}</p>{modal === "contact" && <div className="mm-contact-details">
              <p><strong>Phone:</strong> <a href="tel:+263780373838">+263 784 307 443</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/263719407443" target="_blank" rel="noreferrer">+263 719 407 443 - Chat with us</a></p>
              <p><strong>Email:</strong> <a href="mailto:tkjeff3@gmail.com">tkjeff3@gmail.com</a></p>
            </div>}
            <button className="primary-button mm-full-button" onClick={() => setModal("")}>Got it</button></>}
            {formError && <div className="mm-form-message error" role="alert">{formError}</div>}
            {formSuccess && <div className="mm-form-message success" role="status">{formSuccess}{modal === "checkout" && <button onClick={() => setModal("")}>Close</button>}</div>}
          </section>
        </div>
      )}

    </div>
  
      )}
    </>
  );
}

export default App;

// Mbare Musika seller dashboard deployment refresh
