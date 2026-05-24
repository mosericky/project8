export type Category = "Women" | "Men" | "Kids" | "Designer";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: Category;
  image: string;
  description: string;
}

// Garment-only product shots (no faces). Sourced from Unsplash.
export const products: Product[] = [
  {
    id: "w1",
    name: "Linen Wrap Dress",
    brand: "Atelier Nord",
    price: 4500,
    category: "Women",
      image: "/images/women/w1.jpg",
    description: "Soft linen wrap dress with a flattering silhouette. Perfect for summer days.",
  },
  {
    id: "w2",
    name: "Silk Blouse",
    brand: "Maison Lior",
    price: 3800,
    category: "Women",
      image: "/images/women/w2.jpg",
    description: "Lightweight silk blouse with a relaxed fit and pearl buttons.",
  },
  {
    id: "w3",
    name: "Pleated Midi Skirt",
    brand: "Studio Rue",
    price: 3200,
    category: "Women",
      image: "/images/women/w3.jpg",
    description: "Flowy pleated midi skirt that pairs with everything in your wardrobe.",
  },
  {
    id: "m1",
    name: "Tailored Wool Coat",
    brand: "North & Co.",
    price: 8900,
    category: "Men",
      image: "/images/men/m1.jpg",
    description: "Single-breasted wool coat with a classic tailored fit.",
  },
  {
    id: "m2",
    name: "Oxford Shirt",
    brand: "Heritage 47",
    price: 2900,
    category: "Men",
      image: "/images/men/m2.jpg",
    description: "Crisp cotton Oxford shirt, breathable and built to last.",
  },
  {
    id: "m3",
    name: "Slim Chinos",
    brand: "Heritage 47",
    price: 3400,
    category: "Men",
      image: "/images/men/m3.jpg",
    description: "Versatile chinos in a modern slim cut.",
  },
  {
    id: "k1",
    name: "Striped Knit Sweater",
    brand: "Little Bear",
    price: 1800,
    category: "Kids",
      image: "/images/kids/k1.jpg",
    description: "Cozy cotton-blend sweater for active kids.",
  },
  {
    id: "k2",
    name: "Denim Overalls",
    brand: "Tiny Threads",
    price: 2200,
    category: "Kids",
      image: "/images/kids/k2.jpg",
    description: "Durable denim overalls with adjustable straps.",
  },
  {
    id: "k3",
    name: "Sunshine Summer Dress",
    brand: "Little Bear",
    price: 1600,
    category: "Kids",
      image: "/images/kids/k3.jpg",
    description: "Light, airy dress with playful print.",
  },
  {
    id: "d1",
    name: "Designer Leather Jacket",
    brand: "Vermont Atelier",
    price: 24500,
    category: "Designer",
      image: "/images/designers/d1.jpg",
    description: "Hand-finished lambskin leather jacket. Limited edition.",
  },
  {
    id: "d2",
    name: "Cashmere Overcoat",
    brand: "Maison Lior",
    price: 32000,
    category: "Designer",
      image: "/images/designers/d2.jpg",
    description: "Pure cashmere overcoat with hand-stitched lapels.",
  },
  {
    id: "d3",
    name: "Evening Gown",
    brand: "Vermont Atelier",
    price: 38500,
    category: "Designer",
    image: "/images/designers/d3.jpg",
    description: "Floor-length evening gown crafted for unforgettable nights.",
  },
  {
    id: "p1",
    name: "Cropped Denim Jacket",
    brand: "Studio Rue",
    price: 3850,
    category: "Women",
    image: "/images/promos/p1.jpg",
    description: "A versatile denim jacket with modern cropped styling.",
  },
  {
    id: "p2",
    name: "Wool Blend Scarf",
    brand: "Heritage 47",
    price: 1440,
    category: "Men",
    image: "/images/promos/p2.jpg",
    description: "Soft wool scarf in neutral shades for everyday wear.",
  },
  {
    id: "p3",
    name: "Knit Cardigan",
    brand: "Atelier Nord",
    price: 2940,
    category: "Women",
    image: "/images/promos/p3.jpg",
    description: "Cozy knit cardigan with a relaxed fit for layering.",
  },
  {
    id: "p4",
    name: "Linen Trousers",
    brand: "North & Co.",
    price: 2470,
    category: "Men",
    image: "/images/promos/p4.jpg",
    description: "Lightweight linen trousers with a relaxed cut.",
  },
  {
    id: "p5",
    name: "Silk Slip Dress",
    brand: "Maison Lior",
    price: 4420,
    category: "Women",
    image: "/images/promos/p5.jpg",
    description: "Silky slip dress with soft drape and rich finish.",
  },
  {
    id: "p6",
    name: "Leather Loafers",
    brand: "Vermont Atelier",
    price: 4680,
    category: "Designer",
    image: "/images/promos/p6.jpg",
    description: "Hand-finished leather loafers with timeless appeal.",
  },
];

export const categories: Category[] = ["Women", "Men", "Kids", "Designer"];
