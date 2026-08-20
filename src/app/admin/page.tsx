"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Save,
  ShoppingBag,
  Star,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  Users,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
  ShieldCheck,
  ClipboardCheck,
  ArrowLeftRight,
  Truck,
  Eye,
  Award,
  HeartHandshake,
  Glasses,
  Clock,
  MessageSquare,
  Building,
  BarChart3,
  RotateCcw,
  Package,
} from "lucide-react";
import {
  getStoredProducts,
  hydrateProducts,
  saveProducts,
  deleteProductFromCatalog,
  clearAllCatalogProducts,
  restoreDefaultCatalogProducts,
} from "@/data/products";
import type { Product } from "@/types/product";
import {
  DEFAULT_SITE_CONTENT,
  getOnboardingLeads,
  getSiteContent,
  hydrateSiteContent,
  saveSiteContent,
  type OfflineSaleRecord,
  type SiteContent,
  type BenefitItem,
  type TestimonialItem,
  type HomeMetric,
  addOfflineSale,
} from "@/lib/site-content";
import BrandLogo from "@/components/BrandLogo";
import ImageUploader from "@/components/ImageUploader";

/* ─── Auth ─── */
const AUTH_KEY = "drishyam_admin_auth";

/* ─── Types ─── */
type DashboardTab = "overview" | "banner" | "categories" | "cards" | "customers";

const tabs: Array<{ id: DashboardTab; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "banner", label: "Banner & Hero", icon: ImageIcon },
  { id: "categories", label: "Categories & Products", icon: Tag },
  { id: "cards", label: "Cards & Content", icon: Layers },
  { id: "customers", label: "Customers", icon: Users },
  // { id: "sales", label: "Sales", icon: ShoppingBag },
];

const AVAILABLE_ICONS = [
  { id: "ShieldCheck", label: "Shield / Quality", icon: ShieldCheck },
  { id: "ClipboardCheck", label: "Clipboard / Prescription", icon: ClipboardCheck },
  { id: "ArrowLeftRight", label: "Exchange / Returns", icon: ArrowLeftRight },
  { id: "Truck", label: "Truck / Fast Delivery", icon: Truck },
  { id: "Eye", label: "Eye / Vision", icon: Eye },
  { id: "Sparkles", label: "Sparkles / Luxury", icon: Sparkles },
  { id: "Award", label: "Award / Craftsmanship", icon: Award },
  { id: "HeartHandshake", label: "Handshake / Trust", icon: HeartHandshake },
  { id: "Glasses", label: "Glasses / Spectacles", icon: Glasses },
  { id: "Clock", label: "Clock / Fast Service", icon: Clock },
  { id: "Star", label: "Star / Rating", icon: Star },
  { id: "CheckCircle2", label: "Check / Guarantee", icon: CheckCircle2 },
];

type ConfirmAction = { title: string; message: string; confirmLabel: string; onConfirm: () => void };
const PAGE_SIZE = 10;

/* ─── Validation ─── */
const validateCategory = (cat: SiteContent["categories"][number]) => {
  const e: Record<string, string> = {};
  if (!cat.name.trim()) e.name = "Name is required.";
  if (!cat.slug.trim()) e.slug = "Slug is required.";
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cat.slug)) e.slug = "Lowercase letters, numbers and hyphens only.";
  if (!cat.image.trim()) e.image = "Image is required (upload local file or enter URL).";
  if (!cat.description.trim()) e.description = "Description is required.";
  else if (cat.description.trim().length < 4) e.description = "At least 4 characters.";
  return e;
};

/* ─── Defaults ─── */
const defaultSale = {
  customerName: "", product: "", amount: "", phone: "", notes: "",
  status: "Paid" as OfflineSaleRecord["status"],
  date: "",
};

const defaultNewProduct = {
  name: "", slug: "", price: "", image: "", description: "",
  category: "Eyeglasses" as Product["category"],
  shape: "Rectangle" as Product["shape"],
  gender: "Unisex" as Product["gender"],
  material: "Acetate" as Product["material"],
  size: "Medium" as Product["size"],
  prescription: true,
};

/* ══════════════════════════════════════
   PRODUCT SECTION COMPONENT
══════════════════════════════════════ */
function ProductSectionPanel({
  title,
  icon: Icon,
  iconColor,
  selectedIds,
  onToggle,
  allProductsList,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  selectedIds: string[];
  onToggle: (id: string) => void;
  allProductsList: Product[];
}) {
  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const selectedProducts = allProductsList.filter((p) => selectedIds.includes(p.id));
  const unselectedProducts = allProductsList.filter((p) => !selectedIds.includes(p.id));

  const filteredUnselected = unselectedProducts.filter((p) => {
    const q = search.trim().toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const getImg = (p: Product) =>
    typeof p.images[0] === "string" ? p.images[0] : (p.images[0] as any).src;

  return (
    <div className="rounded-[24px] border border-[#eadcc6] bg-white overflow-hidden shadow-[0_8px_24px_rgba(17,17,17,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#f1e8db] bg-[#fffaf5] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconColor}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-[#111111]">{title}</h4>
            <p className="text-[10px] text-[#111111]/50">{selectedIds.length} product{selectedIds.length !== 1 ? "s" : ""} pinned</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#111111] px-3 py-2 text-[10px] font-bold uppercase -[0.18em] text-white hover:bg-[#333] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
          {pickerOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Picker (search + add) */}
      {pickerOpen && (
        <div className="border-b border-[#f1e8db] bg-[#fffdf9] p-4">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#bbb]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search products to add to ${title}…`}
              className="w-full rounded-xl border border-[#eadcc6] bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#f59e0b]"
            />
          </div>
          {filteredUnselected.length === 0 ? (
            <p className="py-2 text-center text-sm text-[#111111]/40">
              {unselectedProducts.length === 0 ? "All products are already added!" : "No matching products found."}
            </p>
          ) : (
            <div className="grid gap-2 max-h-52 overflow-y-auto sm:grid-cols-2">
              {filteredUnselected.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { onToggle(p.id); }}
                  className="flex items-center gap-3 rounded-xl border border-[#eadcc6] bg-white p-2.5 text-left transition hover:border-[#f59e0b] hover:bg-[#fff7eb]"
                >
                  <img src={getImg(p)} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#111111]">{p.name}</p>
                    <p className="text-[10px] uppercase -[0.14em] text-[#111111]/45">₹{p.price} · {p.category}</p>
                  </div>
                  <Plus className="ml-auto h-4 w-4 shrink-0 text-[#f59e0b]" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pinned products list */}
      <div className="p-4">
        {selectedProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#eadcc6] py-6 text-center">
            <p className="text-sm text-[#111111]/40">No products pinned yet.</p>
            <p className="mt-1 text-xs text-[#111111]/30">Click "Add" above to pick products.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-[#f1e8db] bg-[#fffaf5] p-2.5"
              >
                <img src={getImg(p)} alt={p.name} className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#111111]">{p.name}</p>
                  <p className="text-[10px] uppercase -[0.14em] text-[#111111]/45">₹{p.price} · {p.category}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggle(p.id)}
                  aria-label={`Remove ${p.name}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN ADMIN PAGE
══════════════════════════════════════ */
export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(AUTH_KEY) === "1") setAuthed(true);
    else router.replace("/admin/login");
  }, [router]);

  /* ── State ── */
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [productList, setProductList] = useState<Product[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newSale, setNewSale] = useState(defaultSale);
  const [isHydrated, setIsHydrated] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [customerPage, setCustomerPage] = useState(1);
  const [salesPage, setSalesPage] = useState(1);
  const [newCategoryIds, setNewCategoryIds] = useState<string[]>([]);
  const [categoryErrors, setCategoryErrors] = useState<Array<Record<string, string>>>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState(defaultNewProduct);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  /* ── Hydrate ── */
  useEffect(() => {
    setContent(getSiteContent());
    setProductList(getStoredProducts());
    setLeads(getOnboardingLeads());
    setIsHydrated(true);
    void Promise.all([hydrateSiteContent(), hydrateProducts()]).then(([remoteContent, remoteProducts]) => {
      setContent(remoteContent);
      setProductList(remoteProducts);
    });
  }, []);

  useEffect(() => {
    const sync = () => {
      setLeads(getOnboardingLeads());
      setProductList(getStoredProducts());
    };
    window.addEventListener("storage", sync);
    window.addEventListener("drishyam:lead-update", sync);
    window.addEventListener("drishyam:products-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("drishyam:lead-update", sync);
      window.removeEventListener("drishyam:products-update", sync);
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  useEffect(() => {
    setCategoryErrors((prev) =>
      Array.from({ length: content.categories.length }, (_, i) => prev[i] ?? validateCategory(content.categories[i]))
    );
  }, [content.categories]);

  /* ── Derived ── */
  const totalRevenue = useMemo(() => (content.sales ?? []).reduce((s, r) => s + r.amount, 0), [content.sales]);
  const totalCustomers = leads.length;

  const categoryOptions = useMemo(
    () => content.categories.length > 0 ? content.categories.map((c) => c.name) : ["Eyeglasses", "Sunglasses", "Blue Light", "Prescription Ready"],
    [content.categories]
  );

  const customerTotalPages = Math.max(1, Math.ceil(leads.length / PAGE_SIZE));
  const salesTotalPages = Math.max(1, Math.ceil((content.sales ?? []).length / PAGE_SIZE));
  const paginatedLeads = leads.slice((customerPage - 1) * PAGE_SIZE, customerPage * PAGE_SIZE);
  const paginatedSales = (content.sales ?? []).slice((salesPage - 1) * PAGE_SIZE, salesPage * PAGE_SIZE);

  useEffect(() => { setCustomerPage((p) => Math.min(p, customerTotalPages)); }, [customerTotalPages]);
  useEffect(() => { setSalesPage((p) => Math.min(p, salesTotalPages)); }, [salesTotalPages]);

  /* ── Section toggles ── */
  const toggleSection = useCallback((
    key: "featuredProductIds" | "newArrivalProductIds" | "shopByStyleProductIds",
    productId: string
  ) => {
    setContent((c) => {
      const ids = (c[key] ?? []) as string[];
      const nextIds = ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId];
      const nextContent = { ...c, [key]: nextIds };
      saveSiteContent(nextContent);
      return nextContent;
    });
  }, []);

  /* ── Banner handlers ── */
  const updateHeroSlide = (i: number, field: string, value: string) =>
    setContent((c) => {
      const slides = [...(c.hero.slides ?? [])];
      slides[i] = { ...slides[i], [field]: value };
      return { ...c, hero: { ...c.hero, slides } };
    });

  const addHeroSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1400&auto=format&fit=crop",
      alt: "New Eyewear Collection",
      eyebrow: "New Collection",
      title: "Signature Design",
      subtitle: "Handcrafted frames for effortless style",
      primaryLabel: "See All Collections",
      secondaryLabel: "Enquire Now",
      badge: "Featured",
    };
    setContent((c) => ({ ...c, hero: { ...c.hero, slides: [...(c.hero.slides ?? []), newSlide] } }));
    setToastMessage("New slide added! Click Save to apply.");
  };

  const removeHeroSlide = (i: number) => {
    if ((content.hero.slides ?? []).length <= 1) {
      setToastMessage("You must keep at least 1 hero banner slide.");
      return;
    }
    setContent((c) => ({ ...c, hero: { ...c.hero, slides: c.hero.slides.filter((_, idx) => idx !== i) } }));
  };

  /* ── Category handlers ── */
  const updateCategory = (i: number, field: keyof SiteContent["categories"][number], value: string) => {
    setContent((c) => {
      const categories = [...c.categories];
      const next = { ...categories[i], [field]: field === "slug" ? value.toLowerCase().trim() : value };
      categories[i] = next;
      if (Object.values(next).some((v) => String(v).trim())) setNewCategoryIds((p) => p.filter((id) => id !== next.id));
      setCategoryErrors((prev) => { const n = [...prev]; n[i] = validateCategory(next); return n; });
      return { ...c, categories };
    });
  };

  const addCategory = () => {
    const id = `cat-${Date.now()}`;
    const blank = { id, name: "", description: "", image: "", slug: "" };
    setContent((c) => ({ ...c, categories: [blank, ...c.categories] }));
    setCategoryErrors((p) => [validateCategory(blank), ...p]);
    setNewCategoryIds((p) => [id, ...p]);
    setToastMessage("New category card added — upload an image or enter URL, then save.");
  };

  const removeCategory = (i: number) => {
    const name = content.categories[i]?.name || "this category";
    setConfirmAction({
      title: "Delete category card?",
      message: `Delete "${name}"? This will remove the card from the homepage.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setContent((c) => {
          const nextContent = { ...c, categories: c.categories.filter((_, idx) => idx !== i) };
          saveSiteContent(nextContent);
          return nextContent;
        });
        setToastMessage("Category card deleted.");
      },
    });
  };

  const saveCategory = (cat: SiteContent["categories"][number]) => {
    const errors = validateCategory(cat);
    if (Object.values(errors).some(Boolean)) {
      const i = content.categories.findIndex((c) => c.id === cat.id);
      setCategoryErrors((p) => { const n = [...p]; n[i] = errors; return n; });
      setToastMessage("Please fill in required fields before saving.");
      return;
    }
    saveSiteContent(content);
    setNewCategoryIds((p) => p.filter((id) => id !== cat.id));
    setToastMessage("Category card saved!");
  };

  /* ── Benefits Handlers ── */
  const addBenefitCard = () => {
    const newCard: BenefitItem = {
      id: `benefit-${Date.now()}`,
      title: "New Benefit",
      description: "Description of this guarantee or service feature.",
      icon: "ShieldCheck",
    };
    setContent((c) => ({ ...c, benefits: [...(c.benefits ?? []), newCard] }));
    setToastMessage("New Benefit card added. Edit details and click Save.");
  };

  const updateBenefitCard = (index: number, field: keyof BenefitItem, value: string) => {
    setContent((c) => {
      const benefits = [...(c.benefits ?? [])];
      benefits[index] = { ...benefits[index], [field]: value };
      return { ...c, benefits };
    });
  };

  const removeBenefitCard = (index: number) => {
    setContent((c) => ({
      ...c,
      benefits: (c.benefits ?? []).filter((_, i) => i !== index),
    }));
    setToastMessage("Benefit card removed.");
  };

  /* ── Testimonials Handlers ── */
  const addTestimonialCard = () => {
    const newReview: TestimonialItem = {
      id: `review-${Date.now()}`,
      name: "New Customer",
      role: "Location or Profession",
      rating: 5,
      text: "Outstanding frame craftsmanship and clear optical fitting. Very satisfied with my purchase!",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    };
    setContent((c) => ({ ...c, testimonials: [...(c.testimonials ?? []), newReview] }));
    setToastMessage("New Review card added. Edit and click Save.");
  };

  const updateTestimonialCard = (index: number, field: keyof TestimonialItem, value: any) => {
    setContent((c) => {
      const testimonials = [...(c.testimonials ?? [])];
      testimonials[index] = { ...testimonials[index], [field]: value };
      return { ...c, testimonials };
    });
  };

  const removeTestimonialCard = (index: number) => {
    setContent((c) => ({
      ...c,
      testimonials: (c.testimonials ?? []).filter((_, i) => i !== index),
    }));
    setToastMessage("Review card removed.");
  };

  /* ── Key Metrics Handlers ── */
  const addMetricCard = () => {
    const newMetric: HomeMetric = {
      id: `metric-${Date.now()}`,
      value: "99%",
      label: "Satisfaction rate",
    };
    setContent((c) => ({ ...c, metrics: [...(c.metrics ?? []), newMetric] }));
  };

  const updateMetricCard = (index: number, field: keyof HomeMetric, value: string) => {
    setContent((c) => {
      const metrics = [...(c.metrics ?? [])];
      metrics[index] = { ...metrics[index], [field]: value };
      return { ...c, metrics };
    });
  };

  const removeMetricCard = (index: number) => {
    setContent((c) => ({
      ...c,
      metrics: (c.metrics ?? []).filter((_, i) => i !== index),
    }));
  };

  /* ── Store Boutique Handler ── */
  const updateStoreCard = (field: keyof SiteContent["store"], value: string) => {
    setContent((c) => ({
      ...c,
      store: {
        ...c.store,
        [field]: value,
      },
    }));
  };

  const saveChanges = () => {
    saveSiteContent(content);
    setToastMessage("All changes and cards saved successfully!");
  };

  /* ── Product Handlers ── */
  const handleAddProduct = () => {
    const name = newProduct.name.trim();
    const slug = newProduct.slug.trim();
    const price = Number(newProduct.price);
    const imageUrls = newProduct.image
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!name || !slug || imageUrls.length === 0 || !Number.isFinite(price) || price <= 0) {
      setToastMessage("Please fill in all required fields (Name, Slug, Image, Price). Use a direct image URL or two URLs separated by commas.");
      return;
    }

    const uniqueImageUrls = [...new Set(imageUrls)].slice(0, 2);
    const galleryImages = uniqueImageUrls.length === 1
      ? [uniqueImageUrls[0], uniqueImageUrls[0]]
      : uniqueImageUrls;

    const product: Product = {
      id: `frame-${Date.now()}`,
      name,
      slug: slug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      category: newProduct.category,
      shape: newProduct.shape,
      price,
      rating: 4.8,
      reviewsCount: 0,
      colors: [{ name: "Default", hex: "#111111" }],
      images: galleryImages,
      gender: newProduct.gender,
      material: newProduct.material,
      size: newProduct.size,
      prescription: newProduct.prescription,
      description: newProduct.description.trim() || "Quality product from Drishyam Optical.",
      details: ["Added from admin dashboard", "Ready for sale"],
      dimensions: "50-20-145",
      isBestSeller: false,
      isNew: true,
    };
    const updated = [...productList, product];
    saveProducts(updated);
    setProductList(updated);
    setToastMessage(`"${name}" added to catalogue! Now pin it to a section below.`);
    setNewProduct({ ...defaultNewProduct, category: categoryOptions[0] as Product["category"] });
    setAddProductOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setConfirmAction({
      title: "Delete Product?",
      message: `Permanently delete "${name}" from the store catalogue?`,
      confirmLabel: "Delete Product",
      onConfirm: () => {
        const next = deleteProductFromCatalog(id);
        setProductList(next);
        setContent((c) => {
          const nextContent = {
            ...c,
            featuredProductIds: (c.featuredProductIds ?? []).filter((pid) => pid !== id),
            newArrivalProductIds: (c.newArrivalProductIds ?? []).filter((pid) => pid !== id),
            shopByStyleProductIds: (c.shopByStyleProductIds ?? []).filter((pid) => pid !== id),
          };
          saveSiteContent(nextContent);
          return nextContent;
        });
        setToastMessage(`"${name}" deleted from catalogue.`);
      },
    });
  };

  const handleClearAllProducts = () => {
    setConfirmAction({
      title: "Clear All Sample Products?",
      message: "This will remove all products from the catalogue so you can start with a 100% clean catalog. This cannot be undone.",
      confirmLabel: "Clear All",
      onConfirm: () => {
        clearAllCatalogProducts();
        setProductList([]);
        setContent((c) => {
          const nextContent = {
            ...c,
            featuredProductIds: [],
            newArrivalProductIds: [],
            shopByStyleProductIds: [],
          };
          saveSiteContent(nextContent);
          return nextContent;
        });
        setToastMessage("All products cleared. You can now add your own products from admin.");
      },
    });
  };

  const handleRestoreDefaultProducts = () => {
    const restored = restoreDefaultCatalogProducts();
    setProductList(restored);
    setToastMessage("Sample products restored.");
  };

  /* ── Sales Handlers ── */
  const handleAddSale = () => {
    if (!newSale.customerName.trim() || !newSale.product.trim() || !newSale.amount) return;
    addOfflineSale({
      ...newSale,
      amount: Number(newSale.amount),
      customerName: newSale.customerName.trim(),
      product: newSale.product.trim(),
      phone: newSale.phone.trim(),
      notes: newSale.notes.trim(),
    });
    setContent(getSiteContent());
    setNewSale(defaultSale);
    setToastMessage("Sale recorded!");
  };

  const clearLeads = () =>
    setConfirmAction({
      title: "Delete all leads?",
      message: "This will permanently remove all customer onboarding data.",
      confirmLabel: "Delete All",
      onConfirm: () => {
        window.localStorage.removeItem("drishyam_onboarding_leads");
        window.dispatchEvent(new CustomEvent("drishyam:lead-update"));
        setLeads([]);
        setToastMessage("All customer leads cleared.");
      },
    });

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    router.replace("/admin/login");
  };

  const goToTab = (id: DashboardTab) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-[#eadcc6] bg-[#fffdf9] px-3.5 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#f59e0b] focus:ring-2 focus:ring-[#f59e0b]/20";

  if (!authed || !isHydrated) {
    return (
      <div className="min-h-screen bg-[#fffaf5] flex items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#eadcc6] border-t-[#f59e0b]" />
      </div>
    );
  }

  const filteredCatalogProducts = productList.filter((p) => {
    const q = productSearch.trim().toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.shape.toLowerCase().includes(q);
  });

  return (
    <main className="min-h-screen bg-[#f8f4ee] text-[#111111]">
      {/* ── Confirm Modal ── */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-[#eadcc6] bg-white p-6 shadow-[0_30px_80px_rgba(17,17,17,0.18)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">{confirmAction.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#111111]/65">{confirmAction.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-[#eadcc6] bg-[#fffaf5] px-5 py-2.5 text-xs font-bold uppercase -[0.2em] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmAction.onConfirm();
                  setConfirmAction(null);
                }}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase -[0.2em] text-white hover:bg-red-700"
              >
                {confirmAction.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toastMessage && (
        <div className="fixed right-4 top-4 z-[80] max-w-sm rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-950 shadow-[0_16px_35px_rgba(245,158,11,0.22)] flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* ══ SIDEBAR ══ */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-68 flex-col bg-[#0f172a] p-5 text-white transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <button
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Logo Brand Header */}
          <div className="mb-8 pr-6 pt-1">
            <BrandLogo variant="full" size="sm" theme="light" href="/" />
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase -[0.24em] text-[#f59e0b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
              Admin Portal
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => goToTab(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-xs font-bold uppercase -[0.16em] transition ${activeTab === id
                    ? "bg-[#f59e0b] text-[#0f172a] shadow-[0_4px_16px_rgba(245,158,11,0.3)]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-6 space-y-2 pt-4 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase -[0.18em] text-white/80 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              View Storefront
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-2.5 text-xs font-bold uppercase -[0.18em] text-red-400 hover:bg-red-900/40 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ══ MAIN WORKSPACE ══ */}
        <div className="flex-1 min-w-0">
          {/* Top Sticky Bar */}
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#eadcc6] bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eadcc6] bg-[#fffaf5] lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-[10px] font-bold uppercase -[0.24em] text-[#a55d00]">Drishyam Control Center</p>
                <h2 className=" text-xl text-[#111111] sm:text-2xl capitalize">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={saveChanges}
              className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-2.5 text-xs font-bold uppercase -[0.2em] text-white shadow-sm hover:bg-[#f59e0b] hover:text-[#0f172a] transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Save All Changes</span>
            </button>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* ══ 1. OVERVIEW TAB ══ */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Cards */}
                {/* <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, tone: "bg-amber-100 text-amber-800" },
                    { label: "Customer Leads", value: String(totalCustomers), icon: Users, tone: "bg-emerald-100 text-emerald-800" },
                    { label: "Active Products", value: String(productList.length), icon: Package, tone: "bg-blue-100 text-blue-800" },
                    { label: "Category Cards", value: String(content.categories.length), icon: Tag, tone: "bg-purple-100 text-purple-800" },
                  ].map(({ label, value, icon: Icon, tone }) => (
                    <div key={label} className="rounded-[24px] border border-[#eadcc6] bg-white p-5 shadow-[0_12px_32px_rgba(17,17,17,0.03)]">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 text-[11px] font-bold uppercase -[0.2em] text-[#111111]/55">{label}</p>
                      <p className="mt-1 text-2xl sm:text-3xl font-semibold text-[#111111]">{value}</p>
                    </div>
                  ))}
                </div> */}

                {/* Quick Manage Hub */}
                {/* <div className="grid gap-5 sm:grid-cols-3">
                  {[
                    { title: "Manage Cards & Content", desc: "Edit Benefits, Testimonials reviews, Boutique card & Metrics.", tab: "cards" as DashboardTab, icon: Layers, color: "bg-purple-50 text-purple-700" },
                    { title: "Manage Categories & Products", desc: "Add products, category cards, and pin items to sections.", tab: "categories" as DashboardTab, icon: Tag, color: "bg-amber-50 text-amber-700" },
                    { title: "Banner & Hero", desc: "Update homepage headline, promo code, slides, and badges.", tab: "banner" as DashboardTab, icon: ImageIcon, color: "bg-blue-50 text-blue-700" },
                  ].map(({ title, desc, tab, icon: Icon, color }) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => goToTab(tab)}
                      className="group rounded-[24px] border border-[#eadcc6] bg-white p-6 text-left shadow-[0_8px_24px_rgba(17,17,17,0.03)] transition hover:border-[#f59e0b] hover:shadow-[0_16px_40px_rgba(245,158,11,0.12)]"
                    >
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color} transition group-hover:scale-110`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-semibold text-[#111111] text-base">{title}</h3>
                      <p className="mt-1.5 text-xs text-[#111111]/55 leading-relaxed">{desc}</p>
                    </button>
                  ))}
                </div> */}

                {/* Recent Activity */}
                <div className="">
                  {/* <section className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Recent Sales</h3>
                      <button type="button" onClick={() => goToTab("sales")} className="text-[10px] font-bold uppercase -[0.2em] text-[#a55d00]">
                        View all &rarr;
                      </button>
                    </div>
                    {(content.sales ?? []).length === 0 ? (
                      <p className="text-sm text-[#111111]/45">No sales recorded yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {(content.sales ?? []).slice(0, 4).map((sale) => (
                          <div key={sale.id} className="flex items-center justify-between gap-4 rounded-2xl border border-[#f1e8db] bg-[#fffaf5] p-3.5">
                            <div>
                              <p className="font-semibold text-sm">{sale.customerName}</p>
                              <p className="text-xs text-[#111111]/50">{sale.product} &middot; {sale.date}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-semibold text-sm">₹{sale.amount.toLocaleString()}</p>
                              <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase -[0.16em] ${sale.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                {sale.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section> */}

                  <section className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Latest Customer Inquiries</h3>
                      <button type="button" onClick={() => goToTab("customers")} className="text-[10px] font-bold uppercase -[0.2em] text-[#a55d00]">
                        Open list &rarr;
                      </button>
                    </div>
                    {leads.length === 0 ? (
                      <p className="text-sm text-[#111111]/45">No customer leads saved yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {leads.slice(0, 4).map((lead) => (
                          <div key={lead.id} className="rounded-2xl border border-[#f1e8db] bg-[#fffaf5] p-3.5 flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-sm">{lead.name}</p>
                              <p className="text-xs text-[#111111]/50">{lead.email} &middot; {lead.number}</p>
                            </div>
                            <span className="text-[10px] text-[#a55d00] font-bold uppercase -[0.14em]">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            )}

            {/* ══ 2. BANNER & HERO TAB ══ */}
            {activeTab === "banner" && (
              <section className="space-y-6">
                <div className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase -[0.24em] text-[#a55d00]">Hero Showcase</p>
                      <h3 className="mt-1 text-2xl font-semibold">Homepage Banner & Slides</h3>
                    </div>
                    <button
                      type="button"
                      onClick={addHeroSlide}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 text-[10px] font-bold uppercase -[0.2em] text-white hover:bg-[#333] transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Slide
                    </button>
                  </div>

                  <div className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Headline Title</span>
                        <input
                          value={content.hero.headline}
                          onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, headline: e.target.value } }))}
                          className={fieldClass}
                        />
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Highlight / Promo Code</span>
                        <input
                          value={content.hero.highlight}
                          onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, highlight: e.target.value } }))}
                          className={fieldClass}
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Hero Description Subtext</span>
                      <textarea
                        value={content.hero.description}
                        onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, description: e.target.value } }))}
                        rows={2}
                        className={`${fieldClass} resize-none`}
                      />
                    </label>

                    {/* Slides Editor */}
                    <div className="mt-6 space-y-5">
                      <h4 className="text-sm font-bold uppercase -[0.18em] text-[#111111]/70">Banner Carousel Slides</h4>
                      {content.hero.slides.map((slide, i) => (
                        <div key={slide.id || i} className="rounded-[24px] border border-[#f1e8db] bg-[#fffaf5] p-5 relative">
                          <div className="mb-4 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase -[0.2em] text-[#111111]/70">
                              Slide #{i + 1} &middot; {slide.badge || "Highlight"}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeHeroSlide(i)}
                              className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase -[0.16em] text-red-600 hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove Slide
                            </button>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <ImageUploader
                              label="Slide Image *"
                              value={slide.image}
                              onChange={(val) => updateHeroSlide(i, "image", val)}
                              aspectRatio="banner"
                              className="sm:col-span-2"
                            />
                            <label className="block">
                              <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Eyebrow Tag</span>
                              <input
                                value={slide.eyebrow}
                                onChange={(e) => updateHeroSlide(i, "eyebrow", e.target.value)}
                                className={fieldClass}
                              />
                            </label>
                            <label className="block">
                              <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Badge Label</span>
                              <input
                                value={slide.badge}
                                onChange={(e) => updateHeroSlide(i, "badge", e.target.value)}
                                className={fieldClass}
                              />
                            </label>
                            <label className="sm:col-span-2 block">
                              <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Slide Subtitle</span>
                              <input
                                value={slide.subtitle}
                                onChange={(e) => updateHeroSlide(i, "subtitle", e.target.value)}
                                className={fieldClass}
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={saveChanges}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-6 py-3 text-xs font-bold uppercase -[0.2em] text-white hover:bg-[#333]"
                      >
                        <Save className="h-4 w-4" />
                        Save Banner Changes
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ══ 3. CATEGORIES & PRODUCTS TAB ══ */}
            {activeTab === "categories" && (
              <section className="space-y-10">
                {/* ── Step 1: Homepage Category Cards ── */}
                <div className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase -[0.22em] text-[#a55d00]">Step 1</p>
                      <h3 className="mt-1 text-2xl font-semibold">Homepage Category Cards</h3>
                      <p className="mt-1 text-sm text-[#111111]/50 max-w-lg">
                        All category cards are managed from here. Upload local images or enter URLs to create cards.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addCategory}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#111111] px-4 py-3 text-[10px] font-bold uppercase -[0.2em] text-white hover:bg-[#222] transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Category Card
                    </button>
                  </div>

                  {content.categories.length === 0 ? (
                    <div className="rounded-[22px] border border-dashed border-[#eadcc6] bg-[#fffaf5] p-10 text-center">
                      <Tag className="mx-auto mb-3 h-8 w-8 text-[#ddd]" />
                      <p className="font-semibold text-[#111111]/60">No category cards created yet.</p>
                      <p className="mt-1 text-sm text-[#111111]/40">Click "Add Category Card" above to create your first card.</p>
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {content.categories.map((cat, i) => {
                        const errors = categoryErrors[i] ?? validateCategory(cat);
                        const hasValue = [cat.name, cat.slug, cat.image, cat.description].some((v) => v.trim());
                        const isNew = newCategoryIds.includes(cat.id) && !hasValue;
                        return (
                          <div
                            key={cat.id}
                            className={`rounded-[24px] border bg-white p-5 transition-all ${isNew ? "border-[#f59e0b] ring-2 ring-[#f59e0b]/20" : "border-[#f1e8db]"
                              }`}
                          >
                            <div className="mb-4 flex items-center justify-between">
                              <p className="text-[10px] font-bold uppercase -[0.2em] text-[#111111]/45">
                                {isNew ? "🆕 New Card" : `Category #${i + 1}`}
                              </p>
                              <button
                                type="button"
                                onClick={() => removeCategory(i)}
                                className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[10px] font-bold uppercase -[0.16em] text-red-500 hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </div>
                            <div className="space-y-3">
                              <label className="block">
                                <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/55">Name *</span>
                                <input
                                  placeholder="e.g. Eyeglasses"
                                  value={cat.name}
                                  onChange={(e) => updateCategory(i, "name", e.target.value)}
                                  className={`${fieldClass} ${errors.name ? "border-red-300" : ""}`}
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                              </label>
                              <label className="block">
                                <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/55">Slug *</span>
                                <input
                                  placeholder="e.g. eyeglasses"
                                  value={cat.slug}
                                  onChange={(e) => updateCategory(i, "slug", e.target.value)}
                                  className={`${fieldClass} ${errors.slug ? "border-red-300" : ""}`}
                                />
                                {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
                              </label>

                              {/* Image Uploader */}
                              <ImageUploader
                                label="Category Image *"
                                value={cat.image}
                                onChange={(val) => updateCategory(i, "image", val)}
                                aspectRatio="portrait"
                              />
                              {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}

                              <label className="block">
                                <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/55">Description *</span>
                                <textarea
                                  placeholder="Short description…"
                                  value={cat.description}
                                  onChange={(e) => updateCategory(i, "description", e.target.value)}
                                  rows={2}
                                  className={`${fieldClass} resize-none ${errors.description ? "border-red-300" : ""}`}
                                />
                                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                              </label>
                              <button
                                type="button"
                                onClick={() => saveCategory(cat)}
                                className="w-full rounded-xl bg-[#111111] py-2.5 text-[10px] font-bold uppercase -[0.2em] text-white hover:bg-[#222] transition-colors"
                              >
                                Save Category Card
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── Step 2: Add New Product to Catalogue ── */}
                <div className="rounded-[28px] border border-[#eadcc6] bg-white shadow-[0_20px_55px_rgba(17,17,17,0.04)] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setAddProductOpen((v) => !v)}
                    className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left hover:bg-[#fffaf5] transition-colors"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase -[0.22em] text-[#a55d00]">Step 2</p>
                      <h3 className="mt-1 text-2xl font-semibold">Add New Product to Catalogue</h3>
                      <p className="mt-1 text-sm text-[#111111]/50">Upload frame images from your computer or URL to add to inventory.</p>
                    </div>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#111111] text-white transition-transform ${addProductOpen ? "rotate-45" : ""}`}>
                      <Plus className="h-5 w-5" />
                    </div>
                  </button>

                  {addProductOpen && (
                    <div className="border-t border-[#eadcc6] p-5 sm:p-6">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Product Name *</span>
                          <input
                            placeholder="e.g. Avery Classic"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                            className={fieldClass}
                          />
                        </label>
                        <label className="block">
                          <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">URL Slug *</span>
                          <input
                            placeholder="e.g. avery-classic"
                            value={newProduct.slug}
                            onChange={(e) => setNewProduct((p) => ({ ...p, slug: e.target.value }))}
                            className={fieldClass}
                          />
                        </label>
                        <label className="block">
                          <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Category</span>
                          <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value as Product["category"] }))}
                            className={fieldClass}
                          >
                            {categoryOptions.map((o) => <option key={o}>{o}</option>)}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Price (₹) *</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="e.g. 2490"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))}
                            className={fieldClass}
                          />
                        </label>

                        {/* Image Uploader */}
                        <ImageUploader
                          label="Product Image *"
                          value={newProduct.image}
                          onChange={(val) => setNewProduct((p) => ({ ...p, image: val }))}
                          aspectRatio="video"
                          className="sm:col-span-2"
                        />

                        <label className="block">
                          <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Face Shape</span>
                          <select
                            value={newProduct.shape}
                            onChange={(e) => setNewProduct((p) => ({ ...p, shape: e.target.value as Product["shape"] }))}
                            className={fieldClass}
                          >
                            {["Oval", "Round", "Square", "Heart", "Diamond", "Rectangle", "Aviator", "Geometric", "Cat-Eye"].map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Gender</span>
                          <select
                            value={newProduct.gender}
                            onChange={(e) => setNewProduct((p) => ({ ...p, gender: e.target.value as Product["gender"] }))}
                            className={fieldClass}
                          >
                            {["Men", "Women", "Kids", "Unisex"].map((g) => <option key={g}>{g}</option>)}
                          </select>
                        </label>
                        <label className="sm:col-span-2 block">
                          <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Description</span>
                          <textarea
                            placeholder="Describe the product — comfort, style, material…"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                            rows={3}
                            className={`${fieldClass} resize-none`}
                          />
                        </label>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddProduct}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#f59e0b] cursor-pointer px-6 py-3 text-xs font-bold uppercase -[0.2em] text-[#111111] hover:bg-[#e08d00] transition-colors shadow-sm"
                        >
                          <Plus className="h-4 w-4" />
                          Save Product to Catalogue
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Step 3: Product Inventory Catalogue (Delete / Manage Cards) ── */}
                <div className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase -[0.22em] text-[#a55d00]">Step 3</p>
                      <h3 className="mt-1 text-2xl font-semibold">Catalogue Inventory ({productList.length} Products)</h3>
                      <p className="mt-1 text-sm text-[#111111]/50">
                        View, delete, or clear sample products to manage your active stock.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {productList.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllProducts}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-[10px] font-bold uppercase -[0.18em] text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Clear All Products
                        </button>
                      )}
                      {productList.length === 0 && (
                        <button
                          type="button"
                          onClick={handleRestoreDefaultProducts}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#eadcc6] bg-[#fffaf5] px-4 py-2 text-[10px] font-bold uppercase -[0.18em] text-[#111111]/70 hover:bg-[#111111] hover:text-white transition-colors"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Restore Sample Products
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search bar */}
                  <div className="relative mb-5">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa]" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search inventory by frame name, category, or shape…"
                      className="w-full rounded-2xl border border-[#eadcc6] bg-[#fffdf9] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#f59e0b]"
                    />
                  </div>

                  {filteredCatalogProducts.length === 0 ? (
                    <div className="rounded-[22px] border border-dashed border-[#eadcc6] bg-[#fffaf5] p-10 text-center">
                      <Package className="mx-auto mb-3 h-8 w-8 text-[#ccc]" />
                      <p className="font-semibold text-[#111111]/60">
                        {productList.length === 0 ? "Catalogue is empty." : "No matching products found."}
                      </p>
                      <p className="mt-1 text-sm text-[#111111]/40">
                        {productList.length === 0
                          ? "Add new frames in Step 2 above or restore sample products."
                          : "Try searching for a different keyword."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredCatalogProducts.map((p) => {
                        const img = typeof p.images[0] === "string" ? p.images[0] : (p.images[0] as any)?.src;
                        return (
                          <div
                            key={p.id}
                            className="flex items-center gap-3.5 rounded-2xl border border-[#f1e8db] bg-[#fffaf5] p-3 transition hover:border-[#f59e0b]"
                          >
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white border border-[#eadcc6]">
                              <img src={img} alt={p.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#111111]">{p.name}</p>
                              <p className="text-[11px] font-bold text-[#a55d00]">₹{p.price}</p>
                              <p className="truncate text-[10px] uppercase -[0.14em] text-[#111111]/45">
                                {p.category} &middot; {p.shape}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              aria-label={`Delete ${p.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── Step 4: Pin Products to Homepage Section Cards ── */}
                <div>
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase -[0.22em] text-[#a55d00]">Step 4</p>
                    <h3 className="mt-1 text-2xl font-semibold text-[#111111]">Pin Products to Homepage Section Cards</h3>
                    <p className="mt-1.5 text-sm text-[#111111]/50">
                      Click <strong>Add</strong> on any section to search and pick products from your inventory. Click <strong>✕</strong> to remove a pinned product.
                    </p>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-3">
                    <ProductSectionPanel
                      title="Best Sellers"
                      icon={Star}
                      iconColor="bg-amber-100 text-amber-600"
                      selectedIds={content.featuredProductIds ?? []}
                      onToggle={(id) => toggleSection("featuredProductIds", id)}
                      allProductsList={productList}
                    />
                    <ProductSectionPanel
                      title="New Arrivals"
                      icon={Sparkles}
                      iconColor="bg-blue-100 text-blue-600"
                      selectedIds={content.newArrivalProductIds ?? []}
                      onToggle={(id) => toggleSection("newArrivalProductIds", id)}
                      allProductsList={productList}
                    />
                    <ProductSectionPanel
                      title="Shop by Style"
                      icon={ShoppingBag}
                      iconColor="bg-purple-100 text-purple-600"
                      selectedIds={content.shopByStyleProductIds ?? []}
                      onToggle={(id) => toggleSection("shopByStyleProductIds", id)}
                      allProductsList={productList}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ══ 4. CARDS & CONTENT TAB (ALL DYNAMIC CARDS) ══ */}
            {activeTab === "cards" && (
              <section className="space-y-10">
                {/* ── Section A: Why Drishyam / Benefits Cards ── */}
                <div className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-[#f59e0b]" />
                        <h3 className="text-2xl font-semibold">Why Drishyam / Benefits Cards</h3>
                      </div>
                      <p className="mt-1 text-sm text-[#111111]/50">
                        Manage the guarantee and service feature cards displayed on the homepage.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addBenefitCard}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 text-[10px] font-bold uppercase -[0.2em] text-white hover:bg-[#333] transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Benefit Card
                    </button>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {(content.benefits ?? []).map((card, i) => (
                      <div key={card.id || i} className="rounded-[22px] border border-[#f1e8db] bg-[#fffaf5] p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase -[0.2em] text-[#a55d00]">
                              Benefit #{i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeBenefitCard(i)}
                              className="text-red-500 hover:text-red-700 p-1"
                              aria-label="Delete card"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <label className="block">
                              <span className="text-[10px] font-bold uppercase -[0.16em] text-[#111111]/60">Icon</span>
                              <select
                                value={card.icon}
                                onChange={(e) => updateBenefitCard(i, "icon", e.target.value)}
                                className={fieldClass}
                              >
                                {AVAILABLE_ICONS.map((opt) => (
                                  <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <label className="block">
                              <span className="text-[10px] font-bold uppercase -[0.16em] text-[#111111]/60">Title</span>
                              <input
                                value={card.title}
                                onChange={(e) => updateBenefitCard(i, "title", e.target.value)}
                                placeholder="e.g. Premium Quality"
                                className={fieldClass}
                              />
                            </label>

                            <label className="block">
                              <span className="text-[10px] font-bold uppercase -[0.16em] text-[#111111]/60">Description</span>
                              <textarea
                                value={card.description}
                                onChange={(e) => updateBenefitCard(i, "description", e.target.value)}
                                placeholder="Description of benefit…"
                                rows={3}
                                className={`${fieldClass} resize-none`}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Section B: Customer Testimonials & Reviews Cards ── */}
                <div className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-[#f59e0b]" />
                        <h3 className="text-2xl font-semibold">Customer Testimonial Cards</h3>
                      </div>
                      <p className="mt-1 text-sm text-[#111111]/50">
                        Manage reviews, star ratings, and client pictures featured in the homepage review carousel.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addTestimonialCard}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 text-[10px] font-bold uppercase -[0.2em] text-white hover:bg-[#333] transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Review Card
                    </button>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    {(content.testimonials ?? []).map((review, i) => (
                      <div key={review.id || i} className="rounded-[24px] border border-[#f1e8db] bg-[#fffaf5] p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-bold uppercase -[0.2em] text-[#a55d00]">
                              Review #{i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTestimonialCard(i)}
                              className="text-red-500 hover:text-red-700 p-1"
                              aria-label="Delete review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <label className="block">
                              <span className="text-[10px] font-bold uppercase -[0.16em] text-[#111111]/60">Customer Name</span>
                              <input
                                value={review.name}
                                onChange={(e) => updateTestimonialCard(i, "name", e.target.value)}
                                className={fieldClass}
                              />
                            </label>

                            <label className="block">
                              <span className="text-[10px] font-bold uppercase -[0.16em] text-[#111111]/60">Role / Location</span>
                              <input
                                value={review.role}
                                onChange={(e) => updateTestimonialCard(i, "role", e.target.value)}
                                className={fieldClass}
                              />
                            </label>

                            <label className="block">
                              <span className="text-[10px] font-bold uppercase -[0.16em] text-[#111111]/60">Star Rating (1-5)</span>
                              <select
                                value={review.rating}
                                onChange={(e) => updateTestimonialCard(i, "rating", Number(e.target.value))}
                                className={fieldClass}
                              >
                                <option value={5}>5 Stars (★★★★★)</option>
                                <option value={4}>4 Stars (★★★★☆)</option>
                                <option value={3}>3 Stars (★★★☆☆)</option>
                                <option value={2}>2 Stars (★★☆☆☆)</option>
                                <option value={1}>1 Star (★☆☆☆☆)</option>
                              </select>
                            </label>

                            <ImageUploader
                              label="Customer Photo"
                              value={review.image}
                              onChange={(val) => updateTestimonialCard(i, "image", val)}
                              aspectRatio="square"
                            />

                            <label className="block">
                              <span className="text-[10px] font-bold uppercase -[0.16em] text-[#111111]/60">Review Quote</span>
                              <textarea
                                value={review.text}
                                onChange={(e) => updateTestimonialCard(i, "text", e.target.value)}
                                rows={3}
                                className={`${fieldClass} resize-none`}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Section C: Store Boutique Showcase Card ── */}
                <div className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                  <div className="mb-6">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-[#f59e0b]" />
                      <h3 className="text-2xl font-semibold">Store Boutique Card</h3>
                    </div>
                    <p className="mt-1 text-sm text-[#111111]/50">
                      Manage the boutique visit section cards, contact details, and location imagery.
                    </p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Card Title</span>
                        <input
                          value={content.store.title}
                          onChange={(e) => updateStoreCard("title", e.target.value)}
                          className={fieldClass}
                        />
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Subtitle / Invitation</span>
                        <input
                          value={content.store.subtitle}
                          onChange={(e) => updateStoreCard("subtitle", e.target.value)}
                          className={fieldClass}
                        />
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Store Location Address</span>
                        <input
                          value={content.store.location}
                          onChange={(e) => updateStoreCard("location", e.target.value)}
                          className={fieldClass}
                        />
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Phone Contact Number</span>
                        <input
                          value={content.store.phone}
                          onChange={(e) => updateStoreCard("phone", e.target.value)}
                          className={fieldClass}
                        />
                      </label>
                    </div>

                    <div className="space-y-4">
                      <ImageUploader
                        label="Boutique Display Image 1"
                        value={content.store.image1}
                        onChange={(val) => updateStoreCard("image1", val)}
                        aspectRatio="video"
                      />
                      <ImageUploader
                        label="Boutique Display Image 2"
                        value={content.store.image2}
                        onChange={(val) => updateStoreCard("image2", val)}
                        aspectRatio="video"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Section D: Why Drishyam Stats & Metrics Cards ── */}
                <div className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-[#f59e0b]" />
                        <h3 className="text-2xl font-semibold">Key Metrics & Highlight Cards</h3>
                      </div>
                      <p className="mt-1 text-sm text-[#111111]/50">
                        Manage stat badges shown in the dark "Why Drishyam" section on the homepage.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addMetricCard}
                      className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 text-[10px] font-bold uppercase -[0.2em] text-white hover:bg-[#333] transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Stat Card
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {(content.metrics ?? []).map((metric, i) => (
                      <div key={metric.id || i} className="rounded-2xl border border-[#f1e8db] bg-[#fffaf5] p-4 flex items-center justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <label className="block">
                            <span className="text-[9px] font-bold uppercase -[0.16em] text-[#111111]/55">Stat Value</span>
                            <input
                              value={metric.value}
                              onChange={(e) => updateMetricCard(i, "value", e.target.value)}
                              placeholder="e.g. 10k+"
                              className={fieldClass}
                            />
                          </label>
                          <label className="block">
                            <span className="text-[9px] font-bold uppercase -[0.16em] text-[#111111]/55">Label</span>
                            <input
                              value={metric.label}
                              onChange={(e) => updateMetricCard(i, "label", e.target.value)}
                              placeholder="e.g. Frames sold"
                              className={fieldClass}
                            />
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMetricCard(i)}
                          className="text-red-500 hover:text-red-700 p-2 self-center"
                          aria-label="Remove metric"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={saveChanges}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-8 py-3.5 text-xs font-bold uppercase -[0.2em] text-white hover:bg-[#f59e0b] hover:text-[#0f172a] transition-all shadow-md"
                  >
                    <Save className="h-4 w-4" />
                    Save All Cards & Content
                  </button>
                </div>
              </section>
            )}

            {/* ══ 5. CUSTOMERS TAB ══ */}
            {activeTab === "customers" && (
              <section className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase -[0.22em] text-[#a55d00]">Customer Relationship</p>
                    <h3 className="mt-1 text-2xl font-semibold">Onboarding Leads</h3>
                  </div>
                  {leads.length > 0 && (
                    <button
                      type="button"
                      onClick={clearLeads}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-[10px] font-bold uppercase -[0.2em] text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Clear All Leads
                    </button>
                  )}
                </div>

                {leads.length === 0 ? (
                  <div className="rounded-[22px] border border-dashed border-[#eadcc6] bg-[#fffaf5] p-12 text-center text-[#111111]/45">
                    No customer leads saved yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-[22px] border border-[#f1e8db]">
                      <table className="min-w-full text-left text-sm">
                        <thead className="bg-[#fffaf5] text-[#111111]/55">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Email</th>
                            <th className="px-4 py-3 font-semibold">Phone</th>
                            <th className="px-4 py-3 font-semibold">Submitted Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedLeads.map((lead) => (
                            <tr key={lead.id} className="border-t border-[#f1e8db]">
                              <td className="px-4 py-3 font-medium">{lead.name}</td>
                              <td className="px-4 py-3 text-[#111111]/60">{lead.email}</td>
                              <td className="px-4 py-3 text-[#111111]/60">{lead.number}</td>
                              <td className="px-4 py-3 text-[10px] font-bold uppercase -[0.18em] text-[#a55d00]">
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {customerTotalPages > 1 && (
                      <div className="flex items-center justify-between gap-3 pt-2">
                        <button
                          onClick={() => setCustomerPage((p) => Math.max(p - 1, 1))}
                          disabled={customerPage === 1}
                          className="rounded-xl border border-[#eadcc6] bg-[#fffaf5] px-4 py-2 text-[10px] font-bold uppercase -[0.2em] disabled:opacity-40"
                        >
                          Prev
                        </button>
                        <span className="text-[10px] font-bold uppercase -[0.2em] text-[#111111]/50">
                          Page {customerPage} of {customerTotalPages}
                        </span>
                        <button
                          onClick={() => setCustomerPage((p) => Math.min(p + 1, customerTotalPages))}
                          disabled={customerPage === customerTotalPages}
                          className="rounded-xl bg-[#111111] px-4 py-2 text-[10px] font-bold uppercase -[0.2em] text-white disabled:opacity-40"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* ══ 6. SALES TAB ══ */}
            {/* {activeTab === "sales" && (
              <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                  <p className="text-[10px] font-bold uppercase -[0.22em] text-[#a55d00]">Record Transaction</p>
                  <h3 className="mt-1 mb-5 text-2xl font-semibold">Record In-Store Sale</h3>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Customer Name</span>
                      <input
                        value={newSale.customerName}
                        onChange={(e) => setNewSale((s) => ({ ...s, customerName: e.target.value }))}
                        className={fieldClass}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Product / Frame</span>
                      <input
                        value={newSale.product}
                        onChange={(e) => setNewSale((s) => ({ ...s, product: e.target.value }))}
                        className={fieldClass}
                      />
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Amount (₹)</span>
                        <input
                          type="number"
                          value={newSale.amount}
                          onChange={(e) => setNewSale((s) => ({ ...s, amount: e.target.value }))}
                          className={fieldClass}
                        />
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Status</span>
                        <select
                          value={newSale.status}
                          onChange={(e) => setNewSale((s) => ({ ...s, status: e.target.value as OfflineSaleRecord["status"] }))}
                          className={fieldClass}
                        >
                          <option>Paid</option>
                          <option>Pending</option>
                          <option>Partial</option>
                        </select>
                      </label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Phone</span>
                        <input
                          value={newSale.phone}
                          onChange={(e) => setNewSale((s) => ({ ...s, phone: e.target.value }))}
                          className={fieldClass}
                        />
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Date</span>
                        <input
                          type="date"
                          value={newSale.date}
                          onChange={(e) => setNewSale((s) => ({ ...s, date: e.target.value }))}
                          className={fieldClass}
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-[11px] font-bold uppercase -[0.2em] text-[#111111]/60">Notes</span>
                      <textarea
                        value={newSale.notes}
                        onChange={(e) => setNewSale((s) => ({ ...s, notes: e.target.value }))}
                        rows={3}
                        className={`${fieldClass} resize-none`}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSale}
                      className="w-full rounded-xl bg-[#111111] px-5 py-3 text-xs font-bold uppercase -[0.2em] text-white hover:bg-[#333] transition-colors"
                    >
                      Record Sale
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#eadcc6] bg-white p-5 sm:p-6 shadow-[0_20px_55px_rgba(17,17,17,0.04)]">
                  <p className="text-[10px] font-bold uppercase -[0.22em] text-[#a55d00]">Ledger</p>
                  <h3 className="mt-1 mb-5 text-2xl font-semibold">All Recorded Sales</h3>
                  <div className="overflow-x-auto rounded-[22px] border border-[#f1e8db]">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-[#fffaf5] text-[#111111]/55">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Customer</th>
                          <th className="px-4 py-3 font-semibold">Product</th>
                          <th className="px-4 py-3 font-semibold">Amount</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedSales.map((sale) => (
                          <tr key={sale.id} className="border-t border-[#f1e8db]">
                            <td className="px-4 py-3">
                              <p className="font-medium">{sale.customerName}</p>
                              <p className="text-xs text-[#111111]/50">{sale.phone}</p>
                            </td>
                            <td className="px-4 py-3 text-[#111111]/65">{sale.product}</td>
                            <td className="px-4 py-3 font-semibold">₹{sale.amount.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase -[0.16em] ${sale.status === "Paid"
                                    ? "bg-[#e8f7ee] text-[#146c43]"
                                    : sale.status === "Pending"
                                      ? "bg-[#fff3d5] text-[#a55d00]"
                                      : "bg-[#eaf6ff] text-[#0f4c81]"
                                  }`}
                              >
                                {sale.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {salesTotalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSalesPage((p) => Math.max(p - 1, 1))}
                        disabled={salesPage === 1}
                        className="rounded-xl border border-[#eadcc6] bg-[#fffaf5] px-4 py-2 text-[10px] font-bold uppercase -[0.2em] disabled:opacity-40"
                      >
                        Prev
                      </button>
                      <span className="text-[10px] font-bold uppercase -[0.2em] text-[#111111]/50">
                        Page {salesPage} of {salesTotalPages}
                      </span>
                      <button
                        onClick={() => setSalesPage((p) => Math.min(p + 1, salesTotalPages))}
                        disabled={salesPage === salesTotalPages}
                        className="rounded-xl bg-[#111111] px-4 py-2 text-[10px] font-bold uppercase -[0.2em] text-white disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )} */}
          </div>
        </div>
      </div>
    </main>
  );
}
