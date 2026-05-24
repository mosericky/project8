import { useMemo } from "react";
import { Product, products, categories } from "@/data/products";
import ProductCard from "./ProductCard";
import "@/styles/ProductGrid.css";

interface Props {
  activeCategory: string;
  onCategoryChange: (c: string) => void;
  onProductSelect: (p: Product) => void;
}

const ProductGrid = ({ activeCategory, onCategoryChange, onProductSelect }: Props) => {
  const filtered = useMemo(
    () => (activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory)),
    [activeCategory],
  );

  return (
    <section className="shop-section" id="shop">
      <div className="shop-header">
        <div>
          <h2 className="section-title">The Edit</h2>
          <p className="section-sub">Discover pieces curated for every occasion.</p>
        </div>
        <div className="category-tabs">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              className={`category-tab ${activeCategory === c ? "active" : ""}`}
              onClick={() => onCategoryChange(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="product-grid">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={onProductSelect} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
