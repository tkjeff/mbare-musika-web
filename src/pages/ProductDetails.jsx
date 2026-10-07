import { Link, useParams } from "react-router-dom";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="page">
        <section className="section">
          <h1>Product not found</h1>
          <Link to="/products">Back to products</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="product-details">
        <div className="product-details-image">
          {product.emoji}
        </div>

        <div className="product-details-info">
          <span className="section-label">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <p className="detail-seller">
            Sold by <strong>{product.seller}</strong>
          </p>

          <div className="detail-price">
            ${product.price.toFixed(2)}
          </div>

          <p className="detail-description">
            {product.description}
          </p>

          <div className="quantity-row">
            <button>-</button>
            <span>1</span>
            <button>+</button>
          </div>

          <button className="primary-btn add-cart-btn">
            Add to Cart
          </button>

          <Link className="back-link" to="/products">
            ? Continue Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
