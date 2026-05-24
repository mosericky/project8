import "@/styles/Hero.css";

interface Props {
  onShopClick: () => void;
}

const Hero = ({ onShopClick }: Props) => (
  <section className="hero" id="top">
    <div>
      <div className="hero-eyebrow">New Arrivals · Season 26</div>
      <h1 className="hero-title">
        Style that <em>moves</em> with you.
      </h1>
      <p className="hero-sub">
        A curated edit of women's, men's, kids' and designer pieces — handpicked for
        everyday confidence and unforgettable moments. Free delivery on orders over Ksh 5,000.
      </p>
      <div className="hero-cta">
        <button className="btn" onClick={onShopClick}>Shop the collection</button>
        <a className="btn btn-outline" href="#contact">Contact us</a>
      </div>
      <div className="hero-stats">
        <div className="hero-stat"><strong>200+</strong><span>Styles in stock</span></div>
        <div className="hero-stat"><strong>4.9★</strong><span>Customer rating</span></div>
        <div className="hero-stat"><strong>24h</strong><span>Nairobi delivery</span></div>
      </div>
    </div>
    <div className="hero-image">
      <img
        src="/images/hero/hero.jpg"
        alt="Curated rack of folded clothing"
      />
    </div>
  </section>
);

export default Hero;
