import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/data/products";

interface CartItem extends Product {
  quantity: number;
}

interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ShopContextValue {
  cart: CartItem[];
  likes: string[];
  reviews: Review[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;
  cartCount: number;
  cartTotal: number;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const load = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => load("cart", []));
  const [likes, setLikes] = useState<string[]>(() => load("likes", []));
  const [reviews, setReviews] = useState<Review[]>(() => load("reviews", []));

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("likes", JSON.stringify(likes)), [likes]);
  useEffect(() => localStorage.setItem("reviews", JSON.stringify(reviews)), [reviews]);

  const addToCart = (p: Product) =>
    setCart((c) => {
      const existing = c.find((i) => i.id === p.id);
      if (existing) return c.map((i) => (i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...c, { ...p, quantity: 1 }];
    });

  const removeFromCart = (id: string) => setCart((c) => c.filter((i) => i.id !== id));
  const updateQuantity = (id: string, qty: number) =>
    setCart((c) => (qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, quantity: qty } : i))));
  const clearCart = () => setCart([]);

  const toggleLike = (id: string) =>
    setLikes((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const isLiked = (id: string) => likes.includes(id);

  const addReview: ShopContextValue["addReview"] = (r) =>
    setReviews((rs) => [
      { ...r, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
      ...rs,
    ]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        likes,
        reviews,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleLike,
        isLiked,
        addReview,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};
