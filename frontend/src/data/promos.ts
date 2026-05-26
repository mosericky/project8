import { Product } from "./products";

// Edit this to set when the promo ends. ISO 8601 format.
export const PROMO_END_DATE = "2026-06-01T23:59:59+03:00";

export interface PromoProduct extends Product {
  originalPrice: number;
  discountPercent: number;
  savings: number;
}

const mk = (p: Omit<PromoProduct, "discountPercent" | "savings">): PromoProduct => ({
  ...p,
  savings: p.originalPrice - p.price,
  discountPercent: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100),
});

export const promoProducts: PromoProduct[] = [
  mk({
    id: "p1",
    name: "Cropped Denim Jacket",
    brand: "Studio Rue",
    originalPrice: 5500,
    price: 3850,
    category: "Women",
    image: "/images/women/w1.jpg",
    description: "Classic cropped denim jacket — limited promo pricing.",
  }),
  mk({
    id: "p2",
    name: "Wool Blend Scarf",
    brand: "Heritage 47",
    originalPrice: 2400,
    price: 1440,
    category: "Men",
    image: "/images/men/m2.jpg",
    description: "Soft wool blend scarf in neutral tones.",
  }),
  mk({
    id: "p3",
    name: "Knit Cardigan",
    brand: "Atelier Nord",
    originalPrice: 4200,
    price: 2940,
    category: "Women",
    image: "/images/women/w3.jpg",
    description: "Cozy knit cardigan, perfect for cool evenings.",
  }),
  mk({
    id: "p4",
    name: "Linen Trousers",
    brand: "North & Co.",
    originalPrice: 3800,
    price: 2470,
    category: "Men",
    image: "/images/men/m3.jpg",
    description: "Breathable linen trousers with a relaxed fit.",
  }),
  mk({
    id: "p5",
    name: "Silk Slip Dress",
    brand: "Maison Lior",
    originalPrice: 6800,
    price: 4420,
    category: "Women",
    image: "/images/women/w2.jpg",
    description: "Bias-cut silk slip dress with adjustable straps.",
  }),
  mk({
    id: "p6",
    name: "Leather Loafers",
    brand: "Vermont Atelier",
    originalPrice: 7200,
    price: 4680,
    category: "Designer",
    image: "/images/designers/d1.jpg",
    description: "Hand-stitched leather loafers built for everyday wear.",
  }),
];
