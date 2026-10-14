import { useCallback, useEffect, useState } from "react";
import {
  API_BASE_URL,
  apiRequest,
  getSavedSession,
  clearSession
} from "./api.js";
import "./SellerDashboard.css";

function money(value, currency = "USD") {
  const amount = Number(value || 0);
  return `${currency === "ZWG" ? "ZWG" : "USD"} ${amount.toFixed(2)}`;
}

function productImage(product) {
  return product.image_url || product.imageUrl || "";
}

export default function SellerDashboard() {
  const [session, setSession] = useState(() => getSavedSession());
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [formKey, setFormKey] = useState(0);

  const role = String(session?.user?.role || "").toUpperCase();

  const loadDashboard = useCallback(async () => {
    if (!session?.token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [productResult, categoryResult] = await Promise.all([
        apiRequest("/products/mine", {}, session.token),
        apiRequest("/categories")
      ]);

      setProducts(
        Array.isArray(productResult.products)
          ? productResult.products
          : productResult.data?.products || []
      );

      setCategories(
        Array.isArray(categoryResult.categories)
          ? categoryResult.categories
          : categoryResult.data?.categories || []
      );
    } catch (requestError) {
      setError(
        requestError?.message ||
        "Could not load your seller dashboard. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function uploadImage() {
    if (!imageFile) {
      setError("Choose an image before uploading.");
      return;
    }

    if (!session?.token) {
      setError("Please sign in again.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${API_BASE_URL}/products/upload-image`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${session.token}`
        },
        body: formData
      });

      const text = await response.text();
      let result = {};

      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        result = { message: text || "Unexpected image service response." };
      }

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || `Image upload failed (${response.status}).`
        );
      }

      const url =
        result.imageUrl ||
        result.url ||
        result.data?.imageUrl ||
        result.data?.url ||
        result.product?.image_url;

      if (!url || typeof url !== "string") {
        throw new Error(
          "The image service did not return an image URL. The product has not been submitted."
        );
      }

      setImageUrl(url);
      setNotice("Image uploaded successfully. You can now create your listing.");
    } catch (uploadError) {
      setError(uploadError?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function createListing(event) {
    event.preventDefault();

    if (!session?.token) {
      setError("Please sign in before creating a listing.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    const form = new FormData(event.currentTarget);

    const price = Number(form.get("price"));
    const stockQuantity = Number(form.get("stockQuantity"));
    const categoryId = String(form.get("categoryId") || "").trim();

    if (!Number.isFinite(price) || price <= 0) {
      setSaving(false);
      setError("Enter a valid price greater than zero.");
      return;
    }

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setSaving(false);
      setError("Stock quantity must be a whole number of zero or more.");
      return;
    }

    const payload = {
      name: String(form.get("name") || "").trim(),
      description: String(form.get("description") || "").trim(),
      price,
      stockQuantity,
      categoryId: categoryId || null,
      imageUrl: imageUrl || null
    };

    try {
      const result = await apiRequest(
        "/products",
        { method: "POST", body: payload },
        session.token
      );

      if (!result.success && !result.product) {
        throw new Error(result.message || "The listing could not be created.");
      }

      setNotice(
        "Your listing was submitted successfully. Its public visibility depends on your seller approval status."
      );
      setImageUrl("");
      setImageFile(null);
      setFormKey((current) => current + 1);
      await loadDashboard();
    } catch (createError) {
      setError(
        createError?.message ||
        "Could not create the listing. Check your seller approval status."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deactivateListing(product) {
    const productId = product.id;

    if (!productId) {
      setError("This listing does not have a valid product ID.");
      return;
    }

    if (!window.confirm(`Remove "${product.name}" from the public catalogue?`)) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await apiRequest(
        `/products/${encodeURIComponent(productId)}`,
        { method: "DELETE" },
        session.token
      );

      setNotice("The listing has been removed from the public catalogue.");
      await loadDashboard();
    } catch (requestError) {
      setError(requestError?.message || "Could not deactivate this listing.");
    }
  }

  function signOut() {
    clearSession();
    setSession(null);
    window.location.replace("/account");
  }

  if (!session?.token || !session?.user) {
    return (
      <main className="mm-seller-page">
        <section className="mm-seller-card mm-seller-message">
          <div className="mm-seller-brand">MBARE MUSIKA</div>
          <h1>Sign in to your seller account</h1>
          <p>You need to sign in before managing marketplace listings.</p>
          <a className="mm-seller-primary" href="/account">Sign in or create an account</a>
          <a className="mm-seller-back" href="/">Back to marketplace</a>
        </section>
      </main>
    );
  }

  if (role !== "SELLER") {
    return (
      <main className="mm-seller-page">
        <section className="mm-seller-card mm-seller-message">
          <div className="mm-seller-brand">MBARE MUSIKA</div>
          <h1>Seller access required</h1>
          <p>
            This dashboard is for seller accounts. Your current account type is {role || "unknown"}.
          </p>
          <a className="mm-seller-primary" href="/account">Open your account</a>
          <a className="mm-seller-back" href="/">Back to marketplace</a>
        </section>
      </main>
    );
  }

  const activeCount = products.filter((product) => product.is_active === true).length;
  const stockCount = products.reduce(
    (total, product) => total + Number(product.stock_quantity ?? product.stockQuantity ?? 0),
    0
  );

  return (
    <main className="mm-seller-page">
      <header className="mm-seller-header">
        <a className="mm-seller-brand" href="/">
          <span className="mm-seller-logo">MM</span>
          <span>MBARE MUSIKA<small>SELLER CENTRE</small></span>
        </a>
        <nav className="mm-seller-header-actions">
          <a href="/">View marketplace</a>
          <a href="/account">My account</a>
          <button type="button" onClick={signOut}>Sign out</button>
        </nav>
      </header>

      <section className="mm-seller-content">
        <div className="mm-seller-welcome">
          <div>
            <span className="mm-seller-eyebrow">SELLER WORKSPACE</span>
            <h1>Your Seller Dashboard</h1>
            <p>
              Welcome, {session.user.full_name || session.user.fullName || session.user.email || "Seller"}.
              Create listings and manage your products in one place.
            </p>
          </div>
          <a className="mm-seller-primary" href="#create-listing">+ Create a listing</a>
        </div>

        {error && <div className="mm-seller-alert" role="alert">{error}</div>}
        {notice && <div className="mm-seller-notice" role="status">{notice}</div>}

        <div className="mm-seller-stats">
          <article className="mm-seller-stat">
            <span>YOUR LISTINGS</span>
            <strong>{products.length}</strong>
            <small>Products linked to your account</small>
          </article>
          <article className="mm-seller-stat">
            <span>ACTIVE LISTINGS</span>
            <strong>{activeCount}</strong>
            <small>Listings marked active</small>
          </article>
          <article className="mm-seller-stat">
            <span>UNITS IN STOCK</span>
            <strong>{stockCount}</strong>
            <small>Total recorded stock</small>
          </article>
        </div>

        <section className="mm-seller-card" id="create-listing">
          <div className="mm-seller-section-heading">
            <div>
              <span className="mm-seller-eyebrow">SELL ON MBARE MUSIKA</span>
              <h2>Create a product listing</h2>
            </div>
          </div>

          <p className="mm-seller-help">
            Complete the product details below. Seller approval is required for products
            to appear in the public catalogue.
          </p>

          <form className="mm-seller-form" onSubmit={createListing} key={formKey}>
            <label>
              Product name *
              <input name="name" required minLength={2} maxLength={150}
                placeholder="e.g. Fresh tomatoes, school shoes, phone charger" />
            </label>

            <label>
              Category
              <select name="categoryId" defaultValue="">
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="mm-seller-wide">
              Description
              <textarea name="description" maxLength={5000} rows={4}
                placeholder="Describe the product, size, condition, or other useful details." />
            </label>

            <label>
              Price (USD) *
              <input name="price" type="number" min="0.01" step="0.01" required
                placeholder="0.00" />
            </label>

            <label>
              Available stock *
              <input name="stockQuantity" type="number" min="0" step="1" required
                defaultValue="1" />
            </label>

            <div className="mm-seller-wide mm-seller-image-field">
              <label htmlFor="mm-seller-image">Product image</label>
              <input
                id="mm-seller-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={(event) => {
                  setImageFile(event.target.files?.[0] || null);
                  setImageUrl("");
                  setError("");
                  setNotice("");
                }}
              />
              <button
                className="mm-seller-secondary"
                type="button"
                onClick={uploadImage}
                disabled={uploading || !imageFile}
              >
                {uploading ? "Uploading image..." : "Upload selected image"}
              </button>
              {imageUrl && (
                <div className="mm-seller-image-preview">
                  <img src={imageUrl} alt="Uploaded product preview" />
                  <span>Image uploaded and ready to attach to your listing.</span>
                </div>
              )}
              <small>Accepted formats: JPEG, PNG, WebP and AVIF. Maximum size: 5 MB.</small>
            </div>

            <div className="mm-seller-wide mm-seller-submit-row">
              <button className="mm-seller-primary" type="submit" disabled={saving || uploading}>
                {saving ? "Creating listing..." : "Create listing"}
              </button>
            </div>
          </form>
        </section>

        <section className="mm-seller-card mm-seller-listings">
          <div className="mm-seller-section-heading">
            <div>
              <span className="mm-seller-eyebrow">PRODUCT MANAGEMENT</span>
              <h2>My listings</h2>
            </div>
            <button className="mm-seller-secondary" type="button" onClick={loadDashboard}
              disabled={loading}>
              {loading ? "Refreshing..." : "Refresh listings"}
            </button>
          </div>

          {loading ? (
            <p className="mm-seller-empty">Loading your listings...</p>
          ) : products.length === 0 ? (
            <div className="mm-seller-empty">
              <h3>No listings yet</h3>
              <p>Create your first product listing using the form above.</p>
            </div>
          ) : (
            <div className="mm-seller-product-list">
              {products.map((product) => {
                const image = productImage(product);
                const isActive = product.is_active === true || product.is_active === "true";

                return (
                  <article className="mm-seller-product" key={product.id}>
                    <div className="mm-seller-product-image">
                      {image ? (
                        <img src={image} alt={product.name} loading="lazy" />
                      ) : (
                        <span>NO IMAGE</span>
                      )}
                    </div>
                    <div className="mm-seller-product-info">
                      <h3>{product.name}</h3>
                      <p>{product.category_name || "Uncategorised"}</p>
                      <strong>{money(product.price, product.currency === "W" ? "ZWG" : product.currency)}</strong>
                      <small>
                        Stock: {Number(product.stock_quantity ?? product.stockQuantity ?? 0)}
                        {" · "}
                        {isActive ? "Active" : "Inactive"}
                      </small>
                    </div>
                    <div className="mm-seller-product-actions">
                      <span className={isActive ? "mm-seller-badge active" : "mm-seller-badge"}>
                        {isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                      {isActive && (
                        <button type="button" className="mm-seller-remove"
                          onClick={() => deactivateListing(product)}>
                          Deactivate
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="mm-seller-footer">
          Mbare Musika Seller Centre · Keep your listings accurate and your stock up to date.
        </footer>
      </section>
    </main>
  );
}
