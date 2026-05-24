import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { promoProducts, PROMO_END_DATE, PromoProduct } from "@/data/promos";
import "@/styles/Promo.css";

interface Props {
  onProductSelect: (p: PromoProduct) => void;
}

const computeRemaining = (deadline: number) => {
  const diff = deadline - Date.now();
  if (diff <= 0) return null;
  const total = Math.floor(diff / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
};

const PromoSection = ({ onProductSelect }: Props) => {
  const { addToCart, toggleLike, likes } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const deadline = new Date(PROMO_END_DATE).getTime();
  const [remaining, setRemaining] = useState(() => computeRemaining(deadline));
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const total = promoProducts.length;

  useEffect(() => {
    const id = setInterval(() => setRemaining(computeRemaining(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  // Auto-advance every 4s
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 4000);
    return () => clearInterval(id);
  }, [total]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const go = (i: number) => setIndex((i + total) % total);

  return (
    <section className="promo-section" id="promo">
      <div className="promo-header">
        <div className="promo-title-block">
          <h2>Limited <span className="accent">promo</span> drop</h2>
          <p>Six hand-picked styles. Slide through and grab your savings.</p>
        </div>
        {remaining ? (
          <div className="promo-timer" aria-live="polite">
            <span className="promo-timer-label">Ends in</span>
            <div className="promo-timer-units">
              <div className="promo-unit"><strong>{pad(remaining.days)}</strong><span>days</span></div>
              <div className="promo-unit"><strong>{pad(remaining.hours)}</strong><span>hrs</span></div>
              <div className="promo-unit"><strong>{pad(remaining.minutes)}</strong><span>min</span></div>
              <div className="promo-unit"><strong>{pad(remaining.seconds)}</strong><span>sec</span></div>
            </div>
          </div>
        ) : (
          <div className="promo-ended">Promo has ended — check back soon.</div>
        )}
      </div>

      <div className="promo-slider">
        <button className="promo-nav prev" onClick={() => go(index - 1)} aria-label="Previous">
          <ChevronLeft size={22} />
        </button>

        <div className="promo-viewport">
          <div
            ref={trackRef}
            className="promo-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {promoProducts.map((p) => (
              <article key={p.id} className="promo-slide" onClick={() => onProductSelect(p)}>
                <div className="promo-slide-image">
                  <span className="promo-badge">-{p.discountPercent}%</span>
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <button
                    className={`like-btn ${likes.includes(p.id) ? "liked" : ""}`}
                    onClick={(e) => { e.stopPropagation(); toggleLike(p.id); }}
                    aria-label="Like"
                  >
                    <Heart size={18} fill={likes.includes(p.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="promo-slide-info">
                  <div className="product-brand">{p.brand}</div>
                  <h3>{p.name}</h3>
                  <p className="promo-desc">{p.description}</p>
                  <div className="promo-prices">
                    <span className="promo-original">Ksh {p.originalPrice.toLocaleString()}</span>
                    <span className="promo-current">Ksh {p.price.toLocaleString()}</span>
                  </div>
                  <div className="promo-savings">
                    You save <strong>Ksh {p.savings.toLocaleString()}</strong>
                  </div>
                  <button
                    className="btn promo-add"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        navigate("/login", { state: { from: { pathname: "/" } } });
                        return;
                      }
                      addToCart(p);
                    }}
                  >
                    <Plus size={16} /> Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <button className="promo-nav next" onClick={() => go(index + 1)} aria-label="Next">
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="promo-dots" role="tablist">
        {promoProducts.map((_, i) => (
          <button
            key={i}
            className={`promo-dot ${i === index ? "active" : ""}`}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default PromoSection;
