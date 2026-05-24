import { Heart, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/data/products";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";

interface Props {
  product: Product;
  onSelect: (p: Product) => void;
}

const formatKsh = (n: number) => `Ksh ${n.toLocaleString()}`;

const ProductCard = ({ product, onSelect }: Props) => {
  const { toggleLike, isLiked, addToCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const liked = isLiked(product.id);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/" } } });
      return;
    }
    addToCart(product);
  };

  return (
    <article className="product-card" onClick={() => onSelect(product)}>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <button
          className={`like-btn ${liked ? "liked" : ""}`}
          onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
          aria-label="Like"
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span>{formatKsh(product.price)}</span>
          <button
            className="add-cart-btn"
            onClick={handleAdd}
            aria-label="Add to cart"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
