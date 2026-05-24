import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Instagram, MessageCircle, Sun, Moon, User } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import "@/styles/Header.css";

interface Props {
  onCartClick: () => void;
  onCategoryClick: (cat: string) => void;
  activeCategory: string;
}

const NAV: { label: string; cat?: string; href?: string }[] = [
  { label: "Shop", cat: "All" },
  { label: "Women", cat: "Women" },
  { label: "Men", cat: "Men" },
  { label: "Kids", cat: "Kids" },
  { label: "Designer", cat: "Designer" },
  { label: "Contact", href: "#contact" },
];

const Header = ({ onCartClick, onCategoryClick, activeCategory }: Props) => {
  const { cartCount, likes } = useShop();
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contactActive, setContactActive] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <a href="#top" className="brand">
          amm<span>_</span>clothing<span>_</span>store
        </a>
        <nav className="nav-links">
          {NAV.map((item) => {
            const isActive = item.cat
              ? activeCategory === item.cat && !contactActive
              : contactActive;
            return (
              <a
                key={item.label}
                role="button"
                className={isActive ? "active" : ""}
                onClick={() => {
                  if (item.cat) {
                    setContactActive(false);
                    onCategoryClick(item.cat);
                  } else if (item.href) {
                    setContactActive(true);
                    document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="header-actions">
          <a
            className="icon-btn whatsapp-btn"
            href="https://wa.me/254791473580"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp 0791473580"
            title="WhatsApp 0791 473 580"
          >
            <MessageCircle size={20} />
          </a>
          <a
            className="icon-btn"
            href="https://instagram.com/maynairr"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram @maynairr"
            title="@maynairr"
          >
            <Instagram size={20} />
          </a>
          <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            {theme === "light" ? "Dark" : "Light"}
          </button>
          <button className="icon-btn" aria-label="Wishlist">
            <Heart size={20} />
            {likes.length > 0 && <span className="badge">{likes.length}</span>}
          </button>
          <button
            className={user?.avatar ? "header-avatar-btn" : "btn btn-outline"}
            type="button"
            onClick={() => navigate(user ? "/profile" : "/login")}
            aria-label={user ? "View profile" : "Log in"}
            title={user ? `${user.fullName} — View profile` : "Log in"}
          >
            {user ? (
              user.avatar ? (
                <img src={user.avatar} alt={user.fullName} />
              ) : (
                <><User size={15} />{user.fullName.split(" ")[0]}</>
              )
            ) : (
              "Login"
            )}
          </button>
          <button className="icon-btn" onClick={onCartClick} aria-label="Cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
