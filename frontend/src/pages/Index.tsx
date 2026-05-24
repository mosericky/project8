import { useState } from "react";
import { ShopProvider } from "@/context/ShopContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import PromoSection from "@/components/PromoSection";
import ProductModal from "@/components/ProductModal";
import Cart from "@/components/Cart";
import Checkout from "@/components/Checkout";
import Contact from "@/components/Contact";
import { Product } from "@/data/products";
import "@/styles/global.css";
import "@/styles/Contact.css";

const Index = () => {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleCategoryClick = (c: string) => {
    setCategory(c);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ThemeProvider>
      <ShopProvider>
        <Header
          onCartClick={() => setCartOpen(true)}
          onCategoryClick={handleCategoryClick}
          activeCategory={category}
        />
      <main>
        <Hero onShopClick={() => handleCategoryClick("All")} />
        <PromoSection onProductSelect={setSelected} />
        <ProductGrid
          activeCategory={category}
          onCategoryChange={setCategory}
          onProductSelect={setSelected}
        />
        <Contact />
      </main>
      <footer className="footer">© {new Date().getFullYear()} amm_clothing_store — All rights reserved.</footer>
      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />
      <Checkout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      </ShopProvider>
    </ThemeProvider>
  );
};

export default Index;
