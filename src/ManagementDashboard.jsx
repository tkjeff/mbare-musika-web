import { useCallback, useEffect, useState } from "react";
import { apiRequest, getSavedSession, clearSession } from "./api.js";
import "./ManagementDashboard.css";

const sections = [
  ["Overview", "Overview"],
  ["Seller Approvals", "Sellers"],
  ["Rider Approvals", "Riders"],
  ["Customers", "Customers"],
  ["Products & Categories", "Products"],
  ["Orders & Deliveries", "Orders"],
  ["Payments & Refunds", "Payments"],
  ["Seller Wallets", "Seller Wallets"],
  ["Rider Earnings", "Rider Earnings"],
  ["Platform Commission", "Commission"],
  ["Administrator Management", "Administrators"],
  ["Audit Logs & Security", "Security"],
];


function ProductManagementPanel({ token }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [approvedSellers, setApprovedSellers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const blank = {
    name: "", description: "", price: "", currency: "USD", categoryId: "", sellerId: "", stockQuantity: "0", imageUrl: ""
  };
  const [form, setForm] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);
      const result = await apiRequest(
        `/management/products?${params.toString()}`, {}, token
      );
      setProducts(Array.isArray(result.products) ? result.products : []);
      setCategories(Array.isArray(result.categories) ? result.categories : []);
      setApprovedSellers(Array.isArray(result.sellers) ? result.sellers : []);
    } catch (e) {
      setError(e.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [token, search, status]);

  useEffect(() => { load(); }, [load]);

  function startCreate() {
    setEditingId(null);
    setForm(blank);
    setFormOpen(true);
    setError("");
    setMessage("");
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      currency: product.currency || "USD",
      categoryId: product.category_id || "",
      stockQuantity: String(product.stock_quantity ?? 0),
      imageUrl: product.image_url || ""
    });
    setFormOpen(true);
    setError("");
    setMessage("");
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        currency: form.currency.trim().toUpperCase(),
        categoryId: form.categoryId || null,
        stockQuantity: Number(form.stockQuantity),
        imageUrl: form.imageUrl.trim() || null
      };

      if (!editingId) body.sellerId = form.sellerId;

      const result = await apiRequest(
        editingId
          ? `/management/products/${encodeURIComponent(editingId)}`
          : "/management/products",
        { method: editingId ? "PATCH" : "POST", body },
        token
      );

      setMessage(result.message || "Product saved.");
      setFormOpen(false);
      await load();
    } catch (e) {
      setError(e.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  async function deactivate(product) {
    if (!window.confirm(`Deactivate "${product.name}"? This hides it from active listings.`)) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await apiRequest(
        `/management/products/${encodeURIComponent(product.id)}`,
        { method: "DELETE" },
        token
      );
      setMessage(result.message || "Product deactivated.");
      await load();
    } catch (e) {
      setError(e.message || "Unable to deactivate product.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(product) {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await apiRequest(
        `/management/products/${encodeURIComponent(product.id)}`,
        { method: "PATCH", body: { isActive: !product.is_active } },
        token
      );
      setMessage(result.message || "Product status updated.");
      await load();
    } catch (e) {
      setError(e.message || "Unable to update product status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="md-panel">
      <div className="md-panel-heading">
        <div>
          <h2>Products &amp; Categories</h2>
          <p>Live product records from the marketplace database.</p>
        </div>
        <button className="md-admin-submit" onClick={startCreate}>+ Add product</button>
      </div>

      {error && <div role="alert" className="md-error">{error}</div>}
      {message && <div role="status" className="md-success">{message}</div>}

      {formOpen && (
        <form className="md-admin-form" onSubmit={save}>
          <h3>{editingId ? "Edit product" : "Create product"}</h3>    
    {!editingId && (
      <label>
        Approved seller
        <select
          value={form.sellerId}
          onChange={(event) => setForm((current) => ({ ...current, sellerId: event.target.value }))}
          required
        >
          <option value="">Select an approved seller</option>
          {approvedSellers.map((seller) => (
            <option key={seller.id} value={seller.id}>
              {(seller.business_name || seller.full_name || seller.email) + " — " + seller.email}
            </option>
          ))}
        </select>
        {approvedSellers.length === 0 && (
          <span>No approved sellers are available. Approve a seller before creating a product.</span>
        )}
      </label>
    )}
          <div className="md-admin-grid">
            <label>Product name
              <input required minLength={2} maxLength={180} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </label>
            <label>Price
              <input required type="number" min="0" step="0.01" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })} />
            </label>
            <label>Currency
              <select value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}>
                <option value="USD">USD</option>
                <option value="ZWG">ZWG</option>
              </select>
            </label>
            <label>Category
              <select value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                <option value="">Uncategorised</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label>Stock quantity
              <input required type="number" min="0" step="1" value={form.stockQuantity}
                onChange={e => setForm({ ...form, stockQuantity: e.target.value })} />
            </label>
            <label>Image URL
              <input type="url" maxLength={2000} value={form.imageUrl}
                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..." />
            </label>
          </div>
          <label>Description
            <textarea maxLength={5000} rows={3} value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="md-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Create product"}
            </button>
            <button type="button" disabled={saving} onClick={() => setFormOpen(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="md-admin-grid" style={{ margin: "20px 0" }}>
        <label>Search products
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name or description…" />
        </label>
        <label>Status
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All products</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
      </div>

      <div className="md-panel-heading">
        <h3>{products.length} product(s) loaded</h3>
        <button disabled={loading || saving} onClick={load}>Refresh</button>
      </div>

      {loading && <div className="md-empty">Loading live products…</div>}
      {!loading && products.length === 0 && !error &&
        <div className="md-empty">No products match this search.</div>}

      {products.length > 0 && (
        <div className="md-table-wrap">
          <table className="md-table">
            <thead><tr>
              <th>Product</th><th>Category</th><th>Seller</th>
              <th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    {p.image_url && <small><a href={p.image_url} target="_blank" rel="noreferrer">View image</a></small>}
                    <small>{String(p.id).slice(0, 12)}</small>
                  </td>
                  <td>{p.category_name || "Uncategorised"}</td>
                  <td>{p.seller_name || p.seller_email || "—"}</td>
                  <td>{p.currency || "USD"} {Number(p.price).toFixed(2)}</td>
                  <td>{p.stock_quantity}</td>
                  <td><span className="md-badge">{p.is_active ? "ACTIVE" : "INACTIVE"}</span></td>
                  <td className="md-actions">
                    <button disabled={saving} onClick={() => startEdit(p)}>Edit</button>
                    <button disabled={saving} onClick={() => toggleActive(p)}>
                      {p.is_active ? "Deactivate" : "Activate"}
                    </button>
                    {p.is_active && <button disabled={saving} onClick={() => deactivate(p)}>Remove</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default function ManagementDashboard() {
  const [session, setSession] = useState(() => getSavedSession());
  const [section, setSection] = useState("Overview");
  const [sellers, setSellers] = useState([]);
  const [riders, setRiders] = useState([]);
  const [marketplaceStats, setMarketplaceStats] = useState(null);
  const [administrators, setAdministrators] = useState([]);
  const [adminForm, setAdminForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const role = String(session?.user?.role || "").toUpperCase();
  const token = session?.token;
  const isManagement = role === "ADMIN" || role === "OWNER";
  const isOwner = role === "OWNER";
  const visibleSections = sections.filter(([label]) =>
    label !== "Administrator Management" || isOwner
  );

  const loadApplications = useCallback(async () => {
    if (!token || !isManagement) return;
    setBusy(true);
    setError("");
    try {
      const results = await Promise.allSettled([
        apiRequest("/admin/sellers/pending", {}, token),
        apiRequest("/admin/riders/pending", {}, token),
        apiRequest("/admin/marketplace-stats", {}, token),
      ]);
      const extract = (result) => {
        if (result.status !== "fulfilled") return [];
        const value = result.value;
        if (Array.isArray(value)) return value;
        return value.sellers || value.riders || value.data || value.items || [];
      };
      setSellers(extract(results[0]));
      setRiders(extract(results[1]));

      if (results[2].status === "fulfilled") {
        setMarketplaceStats(results[2].value?.stats || null);
      } else {
        setMarketplaceStats(null);
      }

      const failed = results.filter((item) => item.status === "rejected");
      if (failed.length) {
        setError(failed.map((item) => item.reason?.message || "Could not load applications").join(" "));
      }
    } catch (e) {
      setError(e.message || "Unable to load management data.");
    } finally {
      setBusy(false);
    }
  }, [token, isManagement]);

  const loadAdministrators = useCallback(async () => {
    if (!token || !isOwner) return;
    setBusy(true);
    setError("");
    try {
      const result = await apiRequest("/management/administrators", {}, token);
      setAdministrators(Array.isArray(result.administrators) ? result.administrators : []);
    } catch (e) {
      setError(e.message || "Unable to load administrator accounts.");
    } finally {
      setBusy(false);
    }
  }, [token, isOwner]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    if (section === "Administrators" && isOwner) {
      loadAdministrators();
    }
  }, [section, isOwner, loadAdministrators]);

  async function createAdministrator(event) {
    event.preventDefault();
    if (!isOwner || adminSubmitting) return;

    setAdminSubmitting(true);
    setError("");
    setMessage("");

    try {
      const result = await apiRequest(
        "/management/administrators",
        {
          method: "POST",
          body: {
            fullName: adminForm.fullName.trim(),
            email: adminForm.email.trim(),
            phone: adminForm.phone.trim(),
            password: adminForm.password,
          },
        },
        token
      );

      setMessage(result.message || "Administrator account created successfully.");
      setAdminForm({ fullName: "", email: "", phone: "", password: "" });
      await loadAdministrators();
    } catch (e) {
      setError(e.message || "Could not create the administrator account.");
    } finally {
      setAdminSubmitting(false);
    }
  }

  async function changeAdministratorStatus(admin, isActive) {
    if (!isOwner || busy) return;

    const action = isActive ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${action} ${admin.fullName || admin.email}?`)) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await apiRequest(
        `/management/administrators/${encodeURIComponent(admin.id)}/status`,
        { method: "PATCH", body: { isActive } },
        token
      );

      setMessage(result.message || `Administrator ${action}d successfully.`);
      await loadAdministrators();
    } catch (e) {
      setError(e.message || `Could not ${action} this administrator.`);
    } finally {
      setBusy(false);
    }
  }

  async function reviewApplication(kind, item, status) {
    const profileId = item.id || item.profile_id || item.seller_profile_id || item.rider_profile_id;
    if (!profileId) {
      setError("This application does not contain a profile ID. No changes were made.");
      return;
    }
    let reason;
    if (status === "REJECTED") {
      reason = window.prompt("Enter a reason for rejecting this application:");
      if (reason === null) return;
      if (!reason.trim()) {
        setError("A rejection reason is required.");
        return;
      }
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await apiRequest(`/admin/${kind}/${encodeURIComponent(profileId)}/approval`, {
        method: "PATCH",
        body: { status, reason },
      }, token);
      setMessage(`${kind === "sellers" ? "Seller" : "Rider"} application ${status.toLowerCase()}.`);
      await loadApplications();
    } catch (e) {
      setError(e.message || "The application could not be updated.");
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    clearSession();
    setSession(null);
    window.location.href = "/";
  }

  function renderApplications(items, kind) {
    if (busy && items.length === 0) return <div className="md-empty">Loading applications…</div>;
    if (!items.length) return <div className="md-empty">No pending applications returned by the API.</div>;
    return (
      <div className="md-table-wrap">
        <table className="md-table">
          <thead><tr><th>Applicant</th><th>Contact</th><th>Application details</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{items.map((item, index) => {
            const id = item.id || item.profile_id || item.seller_profile_id || item.rider_profile_id || index;
            const applicant = item.full_name || item.fullName || item.user?.full_name || item.user?.fullName || item.name || "Applicant";
            const contact = item.email || item.user?.email || item.phone || item.user?.phone || "Not provided";
            const details = kind === "sellers"
              ? item.business_name || item.businessName || item.description || "Business details not provided"
              : [item.vehicle_type || item.vehicleType, item.license_number || item.licenseNumber].filter(Boolean).join(" · ") || "Vehicle details not provided";
            return (
              <tr key={id}>
                <td><strong>{applicant}</strong><small>Ref: {String(id).slice(0, 12)}</small></td>
                <td>{contact}</td>
                <td>{details}</td>
                <td><span className="md-badge">{item.approval_status || item.status || "PENDING"}</span></td>
                <td className="md-actions">
                  <button disabled={busy} onClick={() => reviewApplication(kind, item, "APPROVED")}>Approve</button>
                  <button className="md-reject" disabled={busy} onClick={() => reviewApplication(kind, item, "REJECTED")}>Reject</button>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    );
  }

  if (!session?.token) {
    return (
      <main className="md-gate">
        <div className="md-login-card">
          <div className="md-logo">MM</div>
          <p className="md-eyebrow">MBARE MUSIKA</p>
          <h1>Management access</h1>
          <p>Sign in through the marketplace website using an authorised management account.</p>
          <button onClick={() => { window.location.href = "/"; }}>Go to marketplace sign in</button>
          <small>Administrator and owner access must be granted securely by the backend.</small>
        </div>
      </main>
    );
  }

  if (!isManagement) {
    return (
      <main className="md-gate">
        <div className="md-login-card">
          <div className="md-logo">MM</div>
          <h1>Access restricted</h1>
          <p>Your current account does not have a recognised management role.</p>
          <button onClick={signOut}>Sign out</button>
          <button className="md-secondary" onClick={() => { window.location.href = "/"; }}>Return to marketplace</button>
        </div>
      </main>
    );
  }

  const displayName = session.user?.full_name || session.user?.fullName || session.user?.email || "Management user";

  return (
    <main className="md-shell">
      <aside className="md-sidebar">
        <a className="md-brand" href="/"><span className="md-logo">MM</span><span>MBARE MUSIKA<small>MANAGEMENT CENTRE</small></span></a>
        <div className="md-nav-label">MARKETPLACE CONTROL</div>
        <nav>{visibleSections.map(([label, key]) => (
          <button key={key} className={section === key ? "md-nav-item active" : "md-nav-item"} onClick={() => { setSection(key); setError(""); setMessage(""); }}>
            <span>{label}</span>{["Sellers", "Riders"].includes(key) && <span className="md-nav-dot">›</span>}
          </button>
        ))}</nav>
        <div className="md-sidebar-bottom">
          <span className="md-online-dot" /> API-connected dashboard
          <button onClick={() => { window.location.href = "/"; }}>View storefront ↗</button>
          <button onClick={signOut}>Sign out</button>
        </div>
      </aside>

      <section className="md-main">
        <header className="md-topbar">
          <div><span className="md-eyebrow">MBARE MUSIKA / MANAGEMENT</span><h1>{section}</h1></div>
          <div className="md-user"><span className="md-avatar">{displayName.charAt(0).toUpperCase()}</span><span><strong>{displayName}</strong><small>{role}</small></span></div>
        </header>

        <div className="md-content">
          {error && <div className="md-alert md-alert-error">{error}</div>}
          {message && <div className="md-alert md-alert-success">{message}</div>}

          {section === "Overview" && <>
            <div className="md-welcome"><div><span className="md-eyebrow">MARKETPLACE OPERATIONS</span><h2>Welcome to your control centre.</h2><p>Monitor applications and manage marketplace operations from one place.</p></div><button onClick={loadApplications} disabled={busy}>{busy ? "Refreshing…" : "↻ Refresh data"}</button></div>
            <div className="md-stats">
              <article><span>Total customers</span><strong>{marketplaceStats ? marketplaceStats.totalCustomers.toLocaleString() : "—"}</strong><small>Registered customer accounts</small></article>
              <article><span>Total sellers</span><strong>{marketplaceStats ? marketplaceStats.totalSellers.toLocaleString() : "—"}</strong><small>Registered seller accounts</small></article>
              <article><span>Approved sellers</span><strong>{marketplaceStats ? marketplaceStats.approvedSellers.toLocaleString() : "—"}</strong><small>Approved seller profiles</small></article>
              <article><span>Total riders</span><strong>{marketplaceStats ? marketplaceStats.totalRiders.toLocaleString() : "—"}</strong><small>Registered rider accounts</small></article>
              <article><span>Approved riders</span><strong>{marketplaceStats ? marketplaceStats.approvedRiders.toLocaleString() : "—"}</strong><small>Approved rider profiles</small></article>
              <article><span>Pending sellers</span><strong>{marketplaceStats ? marketplaceStats.pendingSellers.toLocaleString() : "—"}</strong><small>Applications awaiting review</small></article>
              <article><span>Pending riders</span><strong>{marketplaceStats ? marketplaceStats.pendingRiders.toLocaleString() : "—"}</strong><small>Applications awaiting review</small></article>
              <article><span>Platform commission</span><strong>3%</strong><small>Configured business policy</small></article>
            </div>
            <div className="md-panel"><div className="md-panel-heading"><div><h3>Applications requiring review</h3><p>Review seller and rider applications before granting marketplace access.</p></div></div>
              <div className="md-shortcuts"><button onClick={() => setSection("Sellers")}>Review seller applications <span>→</span></button><button onClick={() => setSection("Riders")}>Review rider applications <span>→</span></button></div>
            </div>
            <div className="md-notice"><strong>Financial safety</strong><p>The 3% commission policy is displayed for reference. This dashboard does not hold funds, initiate payouts, or prove that payment-provider settlement is connected. Seller payouts must follow delivery confirmation or an authorised dispute/timeout resolution.</p></div>
            {!isOwner && <div className="md-notice"><strong>Owner controls not enabled for this account</strong><p>Your current role is {role}. Administrator account management is reserved for the OWNER role. Your current account cannot access these controls.</p></div>}
          </>}

          {section === "Sellers" && <div className="md-panel"><div className="md-panel-heading"><div><h2>Seller applications</h2><p>Approve or reject applications returned by the backend.</p></div><button onClick={loadApplications} disabled={busy}>Refresh</button></div>{renderApplications(sellers, "sellers")}</div>}
          {section === "Riders" && <div className="md-panel"><div className="md-panel-heading"><div><h2>Rider applications</h2><p>Review rider and vehicle details before approval.</p></div><button onClick={loadApplications} disabled={busy}>Refresh</button></div>{renderApplications(riders, "riders")}</div>}

          {section === "Administrators" && isOwner && <div className="md-panel">
            <div className="md-panel-heading">
              <div>
                <h2>Administrator accounts</h2>
                <p>Create authorised administrator accounts and control their access. Only the OWNER can use these controls.</p>
              </div>
              <button onClick={loadAdministrators} disabled={busy}>Refresh</button>
            </div>

            <form className="md-admin-form" onSubmit={createAdministrator}>
              <h3>Create an administrator</h3>
              <div className="md-admin-form-grid">
                <label>
                  Full name
                  <input
                    required
                    minLength={2}
                    maxLength={150}
                    value={adminForm.fullName}
                    onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                    autoComplete="name"
                  />
                </label>
                <label>
                  Email address
                  <input
                    required
                    type="email"
                    maxLength={254}
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    autoComplete="email"
                  />
                </label>
                <label>
                  Phone number
                  <input
                    maxLength={30}
                    value={adminForm.phone}
                    onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                    autoComplete="tel"
                  />
                </label>
                <label>
                  Temporary password
                  <input
                    required
                    type="password"
                    minLength={12}
                    maxLength={72}
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    autoComplete="new-password"
                  />
                  <small>Use at least 12 characters. Share credentials securely.</small>
                </label>
              </div>
              <button className="md-admin-submit" type="submit" disabled={adminSubmitting}>
                {adminSubmitting ? "Creating account…" : "Create administrator"}
              </button>
            </form>

            <div className="md-panel-heading md-admin-list-heading">
              <div>
                <h3>Registered administrators</h3>
                <p>{administrators.length} account(s) returned by the backend.</p>
              </div>
            </div>

            {busy && administrators.length === 0
              ? <div className="md-empty">Loading administrator accounts…</div>
              : administrators.length === 0
                ? <div className="md-empty">No administrator accounts found.</div>
                : <div className="md-table-wrap">
                    <table className="md-table">
                      <thead>
                        <tr>
                          <th>Administrator</th>
                          <th>Contact</th>
                          <th>Created</th>
                          <th>Access</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {administrators.map((admin) => (
                          <tr key={admin.id}>
                            <td>
                              <strong>{admin.fullName || "Administrator"}</strong>
                              <small>Ref: {String(admin.id).slice(0, 12)}</small>
                            </td>
                            <td>{admin.email}{admin.phone ? <small>{admin.phone}</small> : null}</td>
                            <td>{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : "—"}</td>
                            <td>
                              <span className="md-badge">
                                {admin.isActive ? "ACTIVE" : "INACTIVE"}
                              </span>
                            </td>
                            <td className="md-actions">
                              <button
                                disabled={busy}
                                onClick={() => changeAdministratorStatus(admin, !admin.isActive)}
                              >
                                {admin.isActive ? "Deactivate" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
            }
          </div>}

          {section === "Products" && isManagement && <ProductManagementPanel token={token} />}
          {section !== "Overview" && section !== "Sellers" && section !== "Riders" && section !== "Products" &&
            !(section === "Administrators" && isOwner) && <div className="md-panel md-coming"><span className="md-coming-icon">◇</span><h2>{section}</h2><p>This section is reserved for the next implementation stage. It must be connected to real, permission-protected backend endpoints before it can display or change live records.</p><span className="md-badge">BACKEND INTEGRATION REQUIRED</span>{["Administrators", "Security"].includes(section) && <p className="md-security-note">Security and audit-log views require dedicated backend integration before they can display complete live records.</p>}</div>}
        </div>
        <footer className="md-footer">Mbare Musika · Management access is logged and enforced by the backend where supported.</footer>
      </section>
    </main>
  );
}




