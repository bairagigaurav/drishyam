import { categories as defaultCategories } from "@/data/categories";

export interface BannerSlide {
  id: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
  badge: string;
}

export interface HomeMetric {
  id: string;
  value: string;
  label: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  icon: string; // e.g. "ShieldCheck", "ClipboardCheck", "ArrowLeftRight", "Truck", "Eye", "Sparkles", "Award", "HeartHandshake"
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  image: string;
}

export interface StoreCardContent {
  title: string;
  subtitle: string;
  location: string;
  phone: string;
  image1: string;
  image2: string;
  timings?: string;
  tagline?: string;
}

export interface OfflineSaleRecord {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  status: "Paid" | "Pending" | "Partial";
  date: string;
  phone: string;
  notes: string;
}

export interface SiteContent {
  hero: {
    slides: BannerSlide[];
    headline: string;
    highlight: string;
    description: string;
    badges: string[];
  };
  labels: {
    favorites: string;
    whyDrishyam: string;
    storeTitle: string;
    newArrivals: string;
  };
  metrics: HomeMetric[];
  store: StoreCardContent;
  benefits: BenefitItem[];
  testimonials: TestimonialItem[];
  categories: AdminCategory[];
  featuredProductIds?: string[];
  newArrivalProductIds?: string[];
  shopByStyleProductIds?: string[];
  sales: OfflineSaleRecord[];
}

export interface OnboardingLead {
  id: string;
  name: string;
  number: string;
  email: string;
  createdAt: string;
}

export const DEFAULT_BENEFITS: BenefitItem[] = [
  {
    id: "benefit-1",
    title: "Premium Quality",
    description: "Handcrafted from Italian acetate and Japanese aerospace titanium.",
    icon: "ShieldCheck",
  },
  {
    id: "benefit-2",
    title: "Prescription Ready",
    description: "Custom lenses fitted by licensed opticians to your exact prescription.",
    icon: "ClipboardCheck",
  },
  {
    id: "benefit-3",
    title: "Easy Returns",
    description: "Risk-free 30-day return window with complimentary shipping.",
    icon: "ArrowLeftRight",
  },
  {
    id: "benefit-4",
    title: "Fast Delivery",
    description: "Dispatched within 24 hours with custom packaging protection.",
    icon: "Truck",
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "review-1",
    name: "Eleanor Vance",
    role: "Architect, Stockholm",
    rating: 5,
    text: "The acetate density and frame polishing are exceptional. They feel substantial yet perfectly balanced. Drishyam frames have redefined my everyday profile.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "review-2",
    name: "Oliver Harrison",
    role: "Creative Director, London",
    rating: 5,
    text: "I was skeptical about trying glasses virtually, but the recommendations based on my face shape were spot on. The Avery Classic fits my square facial structure beautifully.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "review-3",
    name: "Sophia Martinez",
    role: "Fine Arts Curator, Madrid",
    rating: 5,
    text: "Remarkable clarity in their blue-light lenses. I spend hours under museum gallery lights and in front of screens, and my visual fatigue has dropped drastically.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
  },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    slides: [
      {
        id: "slide-1",
        image: "https://images.unsplash.com/photo-1577803947579-9f2d05d7f9cf?q=80&w=1400&auto=format&fit=crop",
        alt: "Premium optical frames on display",
        eyebrow: "Curated comfort",
        title: "Curated comfort",
        subtitle: "Luxury frames for daily confidence",
        primaryLabel: "See All Collections",
        secondaryLabel: "Enquire Now",
        badge: "Best Seller",
      },
      {
        id: "slide-2",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1400&auto=format&fit=crop",
        alt: "Modern eyewear boutique collection",
        eyebrow: "Crafted in-store",
        title: "Crafted in-store",
        subtitle: "Real guidance, real fit, real style",
        primaryLabel: "See All Collections",
        secondaryLabel: "Enquire Now",
        badge: "Personal Styling",
      },
      {
        id: "slide-3",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1400&auto=format&fit=crop",
        alt: "Sunglasses and optical frames close-up",
        eyebrow: "Designed for you",
        title: "Designed for you",
        subtitle: "Signature shapes, warm service, expert care",
        primaryLabel: "See All Collections",
        secondaryLabel: "Enquire Now",
        badge: "New Arrival",
      },
    ],
    headline: "Get 20% off on your first purchase",
    highlight: "USE THIS CODE KLSJDLJ20",
    description: "Curated designer eyewear, fashion-forward sunglasses, and precision vision care for every moment of your day.",
    badges: ["Free eye checkup", "1-year frame care", "5000+ happy customers"],
  },
  labels: {
    favorites: "Favorites",
    whyDrishyam: "Why Drishyam",
    storeTitle: "Premium frames in Indore",
    newArrivals: "New Arrivals",
  },
  metrics: [
    { id: "metric-1", value: "10k+", label: "Frames sold" },
    { id: "metric-2", value: "4.9/5", label: "Customer rating" },
    { id: "metric-3", value: "Same-day", label: "Eye check support" },
  ],
  store: {
    title: "Handcrafted frames, expert care.",
    subtitle: "Stop by for a personalized fitting and see our full collection in person.",
    location: "Shiv Dham Gate, Khandwa Road, Indore",
    phone: "+91 79999-65453",
    image1: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=500&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=500&auto=format&fit=crop",
    timings: "Open Mon-Sun: 10:00 AM - 9:30 PM",
    tagline: "Drishyam Optical Boutique",
  },
  benefits: DEFAULT_BENEFITS,
  testimonials: DEFAULT_TESTIMONIALS,
  categories: [],
  featuredProductIds: ["frame-001", "frame-002", "frame-004", "frame-005"],
  newArrivalProductIds: ["frame-003", "frame-006", "frame-007", "frame-010"],
  shopByStyleProductIds: ["frame-001", "frame-003", "frame-005", "frame-008"],
  sales: [
    {
      id: "sale-1",
      customerName: "Aarav Sharma",
      product: "Avery Classic",
      amount: 2490,
      status: "Paid",
      date: "2026-08-06",
      phone: "+91 98765 43210",
      notes: "Offline store purchase",
    },
    {
      id: "sale-2",
      customerName: "Neha Verma",
      product: "Maven Aviator",
      amount: 3290,
      status: "Pending",
      date: "2026-08-09",
      phone: "+91 98111 44556",
      notes: "Frame with lens fitting pending",
    },
  ],
};

const SITE_CONTENT_KEY = "drishyam_site_content";
const ONBOARDING_LEADS_KEY = "drishyam_onboarding_leads";

function mergeContent(saved: Partial<SiteContent>): SiteContent {
  return {
    ...DEFAULT_SITE_CONTENT,
    ...saved,
    hero: {
      ...DEFAULT_SITE_CONTENT.hero,
      ...(saved.hero ?? {}),
      slides: saved.hero?.slides ?? DEFAULT_SITE_CONTENT.hero.slides,
      badges: saved.hero?.badges ?? DEFAULT_SITE_CONTENT.hero.badges,
    },
    labels: {
      ...DEFAULT_SITE_CONTENT.labels,
      ...(saved.labels ?? {}),
    },
    metrics: saved.metrics ?? DEFAULT_SITE_CONTENT.metrics,
    store: {
      ...DEFAULT_SITE_CONTENT.store,
      ...(saved.store ?? {}),
    },
    benefits: saved.benefits ?? DEFAULT_SITE_CONTENT.benefits,
    testimonials: saved.testimonials ?? DEFAULT_SITE_CONTENT.testimonials,
    categories: saved.categories ?? DEFAULT_SITE_CONTENT.categories,
    featuredProductIds: saved.featuredProductIds ?? DEFAULT_SITE_CONTENT.featuredProductIds,
    newArrivalProductIds: saved.newArrivalProductIds ?? DEFAULT_SITE_CONTENT.newArrivalProductIds,
    shopByStyleProductIds: saved.shopByStyleProductIds ?? DEFAULT_SITE_CONTENT.shopByStyleProductIds,
    sales: saved.sales ?? DEFAULT_SITE_CONTENT.sales,
  };
}

export function notifySiteContentUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("drishyam:content-update"));
}

export function getSiteContent(): SiteContent {
  if (typeof window === "undefined") {
    return DEFAULT_SITE_CONTENT;
  }

  const saved = window.localStorage.getItem(SITE_CONTENT_KEY);

  if (!saved) {
    return DEFAULT_SITE_CONTENT;
  }

  try {
    return mergeContent(JSON.parse(saved) as Partial<SiteContent>);
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content));
  notifySiteContentUpdate();
}

export function getSales(): OfflineSaleRecord[] {
  return getSiteContent().sales ?? DEFAULT_SITE_CONTENT.sales;
}

export function saveSales(sales: OfflineSaleRecord[]) {
  const content = getSiteContent();
  const nextContent = { ...content, sales };
  saveSiteContent(nextContent);
}

export function addOfflineSale(sale: Omit<OfflineSaleRecord, "id">) {
  const currentSales = getSales();
  const nextSale: OfflineSaleRecord = {
    ...sale,
    id: `sale-${Date.now()}`,
  };

  saveSales([nextSale, ...currentSales]);
  return nextSale;
}

export function getOnboardingLeads(): OnboardingLead[] {
  if (typeof window === "undefined") return [];

  const saved = window.localStorage.getItem(ONBOARDING_LEADS_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved) as OnboardingLead[];
  } catch {
    return [];
  }
}

export function notifyOnboardingLeadUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("drishyam:lead-update"));
}

export function saveOnboardingLeads(leads: OnboardingLead[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_LEADS_KEY, JSON.stringify(leads));
  notifyOnboardingLeadUpdate();
}

export function submitOnboardingLead(data: { name: string; number: string; email: string }) {
  const leads = getOnboardingLeads();
  const newLead: OnboardingLead = {
    id: `${Date.now()}`,
    name: data.name.trim(),
    number: data.number.trim(),
    email: data.email.trim(),
    createdAt: new Date().toISOString(),
  };

  saveOnboardingLeads([newLead, ...leads]);
  return newLead;
}
