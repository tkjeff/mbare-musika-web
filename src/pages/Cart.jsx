import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <section className="page-header">
          <span className="section-label">MBARE MARKETPLACE</span>
          <h1>Your Cart</h1>
          <p>Your shopping cart is currently empty.</p>
        </section>

        <section className="section empty-cart">
          <div className="empty-cart-icon">??</div>
          <h2>Your cart is empty</h2>
          <p>
            Discover products from Mbare sellers and start shopping.
          </p>

          <Link className="primary-btn" to="/products">
            Start Shopping
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page-header">
        <span className="section-label">MBARE MARKETPLACE</span>
        <h1>Your Cart</h1>
        <p>
          Review your items before continuing to checkout.
        </p>
      </section>

      <section className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-image">
                {item.emoji}
              </div>

              <div className="cart-item-info">
                <span className="product-category">
                  {item.category}
                </span>

                <h3>{item.name}</h3>

                <p className="seller">
                  Sold by {item.seller}
                </p>

                <strong className="cart-item-price">
                  ${item.price.toFixed(2)}
                </strong>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-control">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <strong>
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <strong>${deliveryFee.toFixed(2)}</strong>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <Link
            className="primary-btn checkout-btn"
            to="/checkout"
          >
            Proceed to Checkout
          </Link>

          <Link className="continue-shopping" to="/products">
            ? Continue Shopping
          </Link>
        </aside>
      </section>
    </div>
  );
}

export default Cart;
