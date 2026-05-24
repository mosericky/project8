Place your product and hero images into the `public/images` folder following this structure:

- images/
  - women/      -> product images for Women category (w1.jpg, w2.jpg, w3.jpg, p1.jpg, p3.jpg, p5.jpg)
  - men/        -> product images for Men category (m1.jpg, m2.jpg, m3.jpg, p2.jpg, p4.jpg)
  - kids/       -> product images for Kids category (k1.jpg, k2.jpg, k3.jpg)
  - designers/  -> product images for Designer category (d1.jpg, d2.jpg, d3.jpg, p6.jpg)
  - hero/       -> hero/hero.jpg (single hero banner image)

Naming conventions used by the app (match these filenames):
- Products from `src/data/products.ts` expect:
  - `/images/women/w1.jpg`, `/images/women/w2.jpg`, `/images/women/w3.jpg`
  - `/images/men/m1.jpg`, `/images/men/m2.jpg`, `/images/men/m3.jpg`
  - `/images/kids/k1.jpg`, `/images/kids/k2.jpg`, `/images/kids/k3.jpg`
  - `/images/designers/d1.jpg`, `/images/designers/d2.jpg`, `/images/designers/d3.jpg`

- Promo products from `src/data/promos.ts` expect:
  - `/images/women/p1.jpg`, `/images/women/p3.jpg`, `/images/women/p5.jpg`
  - `/images/men/p2.jpg`, `/images/men/p4.jpg`
  - `/images/designers/p6.jpg`

- Hero component expects `/images/hero/hero.jpg`.

How to add files:
1. Copy your pictures into the appropriate folder.
2. Rename each file to match the expected filename (for example `w1.jpg`).
3. Restart the dev server if it is running (`npm run dev` or `yarn dev`).

If you want different filenames, update `src/data/products.ts`, `src/data/promos.ts` and `src/components/Hero.tsx` to match.
