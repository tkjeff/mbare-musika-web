import { Link } from "react-router-dom";
import products from "../data/products";

function Products() {
  return (
    <div className="page">
      <section className="page-header">
        <span className="section-label">MBARE MARKETPLACE</span>
        <h1>Shop Products</h1>
        <p>
          Discover products from local sellers across Mbare.
        </p>
      </section>

      <section className="section">
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                {product.emoji}
              </div>

              <div className="product-info">
                <span className="product-category">
                  {product.category}
                </span>

                <h3>{product.name}</h3>

                <p className="seller">
                  {product.seller}
                </p>

                <div className="product-bottom">
                  <strong>${product.price.toFixed(2)}</strong>

                  <Link
                    className="product-link"
                    to={`/products/${product.id}`}
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Products;
