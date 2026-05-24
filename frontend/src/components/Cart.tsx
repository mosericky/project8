  import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import "@/styles/Cart.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart = ({ open, onClose, onCheckout }: Props) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Shopping cart">
        <div className="drawer-header">
          <h2 className="drawer-title">Your Bag</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty">Your bag is empty.</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-info">
                  <span className="cart-item-brand">{item.brand}</span>
                  <p className="cart-item-name">{item.name}</p>
                  <div className="qty-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease">
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <span>Ksh {(item.price * item.quantity).toLocaleString()}</span>
                  <button className="cart-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <>
            {!user && (
              <div className="cart-login-prompt">
                Please log in first so you can complete your order.
                <Link to="/login">Login now</Link>
              </div>
            )}
            <div className="drawer-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>Ksh {cartTotal.toLocaleString()}</span>
              </div>
              <button className="btn" onClick={() => (user ? onCheckout() : navigate("/login"))}>
                {user ? "Checkout" : "Login to checkout"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default Cart;
