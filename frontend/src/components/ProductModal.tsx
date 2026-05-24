import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import "@/styles/ProductModal.css";

interface Props {
  product: Product | null;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: Props) => {
  const { addToCart, reviews, addReview } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!product) return null;

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    addReview({ productId: product.id, name: name.trim(), rating, comment: comment.trim() });
    setName(""); setComment(""); setRating(5);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="modal-grid">
          <div className="modal-image"><img src={product.image} alt={product.name} /></div>
          <div className="modal-content">
            <div className="modal-brand">{product.brand}</div>
            <h2 className="modal-name">{product.name}</h2>
            <p className="modal-price">Ksh {product.price.toLocaleString()}</p>
            <p className="modal-desc">{product.description}</p>
            <button
              className="btn"
              onClick={() => {
                if (!user) {
                  navigate("/login", { state: { from: { pathname: "/" } } });
                  return;
                }
                addToCart(product);
                onClose();
              }}
            >
              Add to cart
            </button>

            <div className="reviews-block">
              <h4>Reviews ({productReviews.length})</h4>
              {productReviews.length === 0 && (
                <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>
                  No reviews yet — be the first to share your thoughts.
                </p>
              )}
              {productReviews.map((r) => (
                <div key={r.id} className="review">
                  <div className="review-head">
                    <span className="review-name">{r.name}</span>
                    <span className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  </div>
                  <p className="review-text">{r.comment}</p>
                </div>
              ))}

              <form className="review-form" onSubmit={submitReview}>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  required
                />
                <div className="star-picker">
                  {[1,2,3,4,5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={n <= rating ? "active" : ""}
                      onClick={() => setRating(n)}
                      aria-label={`${n} stars`}
                    >
                      <Star size={20} fill={n <= rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  required
                />
                <button type="submit" className="btn">Post review</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
