import { Product } from "@/types/product";

const PRODUCT_STORAGE_KEY = "drishyam_products";

export const defaultProducts: Product[] = [
  {
    id: "frame-001",
    name: "Avery Classic",
    slug: "avery-classic",
    category: "Eyeglasses",
    shape: "Rectangle",
    price: 249,
    originalPrice: 329,
    rating: 4.8,
    reviewsCount: 124,
    colors: [
      { name: "Obsidian Black", hex: "#111111" },
      { name: "Havana Tortoise", hex: "#70483c" },
      { name: "Clear Crystal", hex: "#e2e8f0" }
    ],
    images: [
      "https://res.cloudinary.com/bc06zmzq/image/upload/v1787046677/20260411_213355.webp",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "Unisex",
    material: "Acetate",
    size: "Medium",
    prescription: true,
    description: "Architectural lines meet everyday comfort. The Avery features a timeless rectangular shape constructed from premium block acetate, hand-polished to a high-gloss finish.",
    details: [
      "Premium Italian Mazzucchelli acetate frame",
      "Robust 5-barrel hinges for extra durability",
      "Anti-reflective, scratch-resistant demo lenses",
      "Comes with custom signature hard case and cleaning cloth"
    ],
    dimensions: "50-20-145",
    isBestSeller: true,
    isNew: false
  },
  {
    id: "frame-002",
    name: "Sienna Round",
    slug: "sienna-round",
    category: "Sunglasses",
    shape: "Round",
    price: 289,
    rating: 4.9,
    reviewsCount: 89,
    colors: [
      { name: "Polished Gold", hex: "#d4af37" },
      { name: "Gunmetal Gray", hex: "#4a5568" }
    ],
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "Women",
    material: "Metal",
    size: "Small",
    prescription: true,
    description: "An elegant, circular metal frame featuring minimalist details. Crafted from ultra-lightweight stainless steel and plated in precious metals.",
    details: [
      "Surgical-grade stainless steel frame",
      "100% UVA/UVB protection optical lenses",
      "Adjustable ceramic nose pads for custom fit",
      "Ultra-thin temples with acetate tips"
    ],
    dimensions: "48-21-140",
    isBestSeller: true,
    isNew: true
  },
  {
    id: "frame-003",
    name: "Vantage Square",
    slug: "vantage-square",
    category: "Eyeglasses",
    shape: "Square",
    price: 269,
    originalPrice: 349,
    rating: 4.7,
    reviewsCount: 56,
    colors: [
      { name: "Charcoal", hex: "#2d3748" },
      { name: "Champagne Toast", hex: "#ebd8be" }
    ],
    images: [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "Men",
    material: "Acetate",
    size: "Large",
    prescription: true,
    description: "An oversized retro-classic square silhouette designed to stand out. Highly robust acetate frame paired with clean metal rivet details.",
    details: [
      "Handcrafted cellulose acetate",
      "Comfort-fit keyhole bridge",
      "Duraflex flexible temple core",
      "Warm, premium polished finish"
    ],
    dimensions: "52-19-148",
    isBestSeller: false,
    isNew: true
  },
  {
    id: "frame-004",
    name: "Maven Aviator",
    slug: "maven-aviator",
    category: "Sunglasses",
    shape: "Aviator",
    price: 329,
    rating: 4.9,
    reviewsCount: 210,
    colors: [
      { name: "Matte Black", hex: "#1a202c" },
      { name: "Brushed Bronze", hex: "#8c6239" }
    ],
    images: [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "Unisex",
    material: "Titanium",
    size: "Large",
    prescription: false,
    description: "A reimagined pilot frame constructed from pure Japanese aerospace-grade titanium. Featherlight strength paired with polarized glass lenses.",
    details: [
      "Pure Japanese beta-titanium chassis",
      "Polarized HD glare-reduction lenses",
      "Laser-etched logo branding on temple tips",
      "Ultra-soft silicone saddle nose pads"
    ],
    dimensions: "58-14-142",
    isBestSeller: true,
    isNew: false
  },
  {
    id: "frame-005",
    name: "Koa Geometric",
    slug: "koa-geometric",
    category: "Eyeglasses",
    shape: "Geometric",
    price: 279,
    rating: 4.8,
    reviewsCount: 77,
    colors: [
      { name: "Emerald Moss", hex: "#2f4f4f" },
      { name: "Honey Amber", hex: "#b45309" }
    ],
    images: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "Women",
    material: "Acetate",
    size: "Medium",
    prescription: true,
    description: "Subtle octagonal styling adds an architectural edge to this soft, versatile profile. Handcrafted from bio-acetate.",
    details: [
      "M2 bio-acetate, 100% biodegradable",
      "Beveled edge contour detailing",
      "Custom wire core engraved with signature pattern",
      "Includes premium velvet-lined protective case"
    ],
    dimensions: "49-20-145",
    isBestSeller: false,
    isNew: false
  }
];

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") {
    return defaultProducts;
  }

  try {
    const raw = window.localStorage.getItem(PRODUCT_STORAGE_KEY);

    if (raw !== null) {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  return defaultProducts;
}

/*
 * IMPORTANT:
 * Keep the initial exported products static.
 *
 * This prevents localStorage from being read during
 * server rendering, which was causing the hydration mismatch.
 *
 * Your dynamic localStorage functionality is NOT removed.
 * getStoredProducts(), saveProducts(), addProductToCatalog(),
 * deleteProductFromCatalog(), etc. still work exactly the same.
 */
export let products: Product[] = defaultProducts;

export function notifyProductsUpdate() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("drishyam:products-update")
  );
}

export function saveProducts(nextProducts: Product[]) {
  products = nextProducts;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(nextProducts)
    );

    notifyProductsUpdate();
  }
}

export function addProductToCatalog(product: Product) {
  const current = getStoredProducts();

  const nextProducts = [...current, product];

  saveProducts(nextProducts);

  return product;
}

export function deleteProductFromCatalog(id: string) {
  const current = getStoredProducts();

  const nextProducts = current.filter(
    (p) => p.id !== id
  );

  saveProducts(nextProducts);

  return nextProducts;
}

export function clearAllCatalogProducts() {
  saveProducts([]);

  return [];
}

export function restoreDefaultCatalogProducts() {
  saveProducts([...defaultProducts]);

  return defaultProducts;
}