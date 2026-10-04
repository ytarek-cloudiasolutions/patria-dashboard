import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  RefreshCw,
  ArrowLeft,
  Smartphone,
  Monitor,
  CheckCircle2,
  EyeOff,
  ArrowRight,
  Package,
} from "lucide-react";
import SearchInputField from "@/shared/components/SearchInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { getProducts, updateProduct } from "@/features/products/api/productsApi";
import { mapProducts } from "@/features/products/utils/productMappers";
import type { Product } from "@/features/products/types";

export type ProductTarget =
  | "app_only"
  | "pos_only"
  | "everywhere"
  | "deactivate";

export interface CategoryModalItem {
  id: string;
  name: string;
  itemCount: number;
  imageUrl?: string;
  status: string;
}

export interface ProductModalItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  imageUrl?: string;
  status: "Active (All)" | "Disabled (All)" | "App Only" | "POS Only";
}

const FALLBACK_CATEGORIES: CategoryModalItem[] = [
  {
    id: "bread-1",
    name: "Bread",
    itemCount: 51,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&auto=format&fit=crop&q=60",
    status: "All Active",
  },
  {
    id: "raw-ingredient",
    name: "Raw Ingredient",
    itemCount: 20,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=60",
    status: "3 Hidden",
  },
  {
    id: "sandwiches",
    name: "Sandwiches",
    itemCount: 34,
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=120&auto=format&fit=crop&q=60",
    status: "1 POS Only",
  },
  {
    id: "app-bread",
    name: "Pastries",
    itemCount: 18,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&auto=format&fit=crop&q=60",
    status: "4 App Only",
  },
  {
    id: "hot-beverages",
    name: "Hot Beverages",
    itemCount: 26,
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&auto=format&fit=crop&q=60",
    status: "All Active",
  },
  {
    id: "cold-beverages",
    name: "Cold Beverages",
    itemCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=120&auto=format&fit=crop&q=60",
    status: "All Active",
  },
  {
    id: "desserts",
    name: "Desserts",
    itemCount: 12,
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=120&auto=format&fit=crop&q=60",
    status: "All Active",
  },
];

const INITIAL_FALLBACK_PRODUCTS: Record<string, ProductModalItem[]> = {
  "raw-ingredient": [
    {
      id: "p1",
      name: "Smoked Turkey",
      stock: 0,
      price: 85.2,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=100&auto=format&fit=crop&q=60",
      status: "Active (All)",
    },
    {
      id: "p2",
      name: "Smoked Beef",
      stock: 22,
      price: 85.2,
      imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=100&auto=format&fit=crop&q=60",
      status: "Disabled (All)",
    },
    {
      id: "p3",
      name: "Fried Eggs",
      stock: 100,
      price: 85.2,
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=100&auto=format&fit=crop&q=60",
      status: "App Only",
    },
    {
      id: "p4",
      name: "Cheddar Cheese",
      stock: 0,
      price: 85.2,
      imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&auto=format&fit=crop&q=60",
      status: "POS Only",
    },
    {
      id: "p5",
      name: "Tomatoes",
      stock: 0,
      price: 85.2,
      imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&auto=format&fit=crop&q=60",
      status: "Active (All)",
    },
    {
      id: "p6",
      name: "Spinach",
      stock: 0,
      price: 85.2,
      imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&auto=format&fit=crop&q=60",
      status: "Active (All)",
    },
    {
      id: "p7",
      name: "Mushrooms",
      stock: 0,
      price: 85.2,
      imageUrl: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=100&auto=format&fit=crop&q=60",
      status: "Active (All)",
    },
  ],
  bread: [
    {
      id: "b1",
      name: "Baguette",
      stock: 45,
      price: 35.0,
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=60",
      status: "Active (All)",
    },
    {
      id: "b2",
      name: "Croissant",
      stock: 12,
      price: 42.5,
      imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&auto=format&fit=crop&q=60",
      status: "Active (All)",
    },
    {
      id: "b3",
      name: "Sourdough Bread",
      stock: 8,
      price: 65.0,
      imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=100&auto=format&fit=crop&q=60",
      status: "POS Only",
    },
    {
      id: "b4",
      name: "Brioche Bun",
      stock: 0,
      price: 28.0,
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=60",
      status: "Disabled (All)",
    },
  ],
};

const DEFAULT_PRODUCTS: ProductModalItem[] = [
  {
    id: "dp1",
    name: "Classic Item 1",
    stock: 15,
    price: 75.0,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=60",
    status: "Active (All)",
  },
  {
    id: "dp2",
    name: "Special Combo 2",
    stock: 30,
    price: 110.0,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&auto=format&fit=crop&q=60",
    status: "App Only",
  },
  {
    id: "dp3",
    name: "Signature Dish",
    stock: 0,
    price: 95.5,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop&q=60",
    status: "POS Only",
  },
];

interface AvailabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const { categories, getCategories } = useCategories();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryModalItem | null>(null);
  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const [localFallbackProducts, setLocalFallbackProducts] = useState<Record<string, ProductModalItem[]>>(
    INITIAL_FALLBACK_PRODUCTS
  );

  const [productTargetModal, setProductTargetModal] = useState<{
    open: boolean;
    product: ProductModalItem | null;
    selectedTarget: ProductTarget;
  }>({
    open: false,
    product: null,
    selectedTarget: "everywhere",
  });

  // Load real products & categories from backend
  const loadData = useCallback(async () => {
    setIsFetching(true);
    try {
      getCategories();
      const res = await getProducts({ includeInactive: true, limit: 500 });
      const rawList =
        (res as any)?.products ||
        (res as any)?.data?.products ||
        (res as any)?.data ||
        [];
      const mapped = mapProducts(Array.isArray(rawList) ? rawList : []);
      setAllProducts(mapped);
    } catch (err) {
      console.error("Failed to load products/categories in AvailabilityModal", err);
    } finally {
      setIsFetching(false);
    }
  }, [getCategories]);

  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, loadData]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  // Build category items from real categories + calculate live counts/statuses from allProducts
  const displayedCategories: CategoryModalItem[] =
    categories.length > 0
      ? categories.map((c, idx) => {
          // Find real products belonging to this category
          const prods = allProducts.filter(
            (p) =>
              p.category === c.id ||
              p.category?.toLowerCase() === c.name.toLowerCase()
          );

          const realCount = prods.length > 0 ? prods.length : (c.itemCount || 0);

          let realStatus: CategoryModalItem["status"] = "All Active";
          if (prods.length > 0) {
            const hiddenCount = prods.filter(
              (p) => !p.available || p.isActive === false
            ).length;
            const posCount = prods.filter(
              (p) => p.showInPos && !p.showInApp && p.isActive !== false
            ).length;
            const appCount = prods.filter(
              (p) => p.showInApp && !p.showInPos && p.isActive !== false
            ).length;

            if (hiddenCount > 0) realStatus = `${hiddenCount} Hidden`;
            else if (posCount > 0) realStatus = `${posCount} POS Only`;
            else if (appCount > 0) realStatus = `${appCount} App Only`;
            else realStatus = "All Active";
          } else {
            const fallbackStatuses: Array<CategoryModalItem["status"]> = [
              "All Active",
              "3 Hidden",
              "1 POS Only",
              "4 App Only",
            ];
            realStatus = c.active ? "All Active" : fallbackStatuses[idx % fallbackStatuses.length];
          }

          return {
            id: c.id,
            name: c.name,
            itemCount: realCount,
            imageUrl: c.imageUrl || FALLBACK_CATEGORIES[idx % FALLBACK_CATEGORIES.length].imageUrl,
            status: realStatus,
          };
        })
      : FALLBACK_CATEGORIES;

  const filteredCategories = displayedCategories.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Get real products for the selected category
  const getCategoryProducts = (cat: CategoryModalItem): ProductModalItem[] => {
    const matched = allProducts.filter(
      (p) =>
        p.category === cat.id ||
        p.category?.toLowerCase() === cat.name.toLowerCase()
    );

    if (matched.length > 0) {
      return matched.map((p) => {
        let status: ProductModalItem["status"] = "Active (All)";
        if (!p.available || p.isActive === false) {
          status = "Disabled (All)";
        } else if (p.showInApp && !p.showInPos) {
          status = "App Only";
        } else if (!p.showInApp && p.showInPos) {
          status = "POS Only";
        }

        return {
          id: p.id,
          name: p.name,
          stock: p.quantity ?? 0,
          price: p.price ?? 0,
          imageUrl: p.imageUrl,
          status,
        };
      });
    }

    // Fallback if this category has no products in DB yet
    const fallbackKey = cat.id.toLowerCase();
    const fallbackNameKey = cat.name.toLowerCase().replace(/\s+/g, "-");
    return (
      localFallbackProducts[fallbackKey] ??
      localFallbackProducts[fallbackNameKey] ??
      localFallbackProducts["bread"] ??
      DEFAULT_PRODUCTS
    );
  };

  const currentCategoryProducts = selectedCategory
    ? getCategoryProducts(selectedCategory)
    : [];

  const filteredProducts = currentCategoryProducts.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const getStatusDotColor = (status: string) => {
    if (status.includes("Hidden")) return "bg-[#E53935]";
    if (status.includes("POS Only")) return "bg-[#C7861E]";
    if (status.includes("App Only")) return "bg-[#004EF9]";
    return "bg-[#059B5A]";
  };

  const getStatusTextColor = (status: string) => {
    if (status.includes("Hidden")) return "text-[#E53935]";
    if (status.includes("POS Only")) return "text-[#C7861E]";
    if (status.includes("App Only")) return "text-[#004EF9]";
    return "text-[#059B5A]";
  };

  const getStockPillStyle = (stock: number) => {
    if (stock === 0) {
      return "bg-[#FFEBEE] outline-[#E53935] text-[#E53935]";
    }
    if (stock < 30) {
      return "bg-[#FFF4DA] outline-[#C7861E] text-[#C7861E]";
    }
    return "bg-[#E2F4ED] outline-[#059B5A] text-[#059B5A]";
  };

  const getStatusPillStyle = (status: ProductModalItem["status"]) => {
    switch (status) {
      case "Active (All)":
        return "bg-[#E2F4ED] outline-[#059B5A] text-[#059B5A]";
      case "Disabled (All)":
        return "bg-[#FFEBEE] outline-[#E53935] text-[#E53935]";
      case "App Only":
        return "bg-[#EDF4FB] outline-[#004EF9] text-[#004EF9]";
      case "POS Only":
        return "bg-[#FFF4DA] outline-[#C7861E] text-[#C7861E]";
    }
  };

  const handleOpenStatusDialog = (product: ProductModalItem) => {
    let initialTarget: ProductTarget = "everywhere";
    if (product.status === "App Only") initialTarget = "app_only";
    else if (product.status === "POS Only") initialTarget = "pos_only";
    else if (product.status === "Disabled (All)") initialTarget = "deactivate";

    setProductTargetModal({
      open: true,
      product,
      selectedTarget: initialTarget,
    });
  };

  const handleConfirmTargetChange = async () => {
    if (!productTargetModal.product) return;
    const productId = productTargetModal.product.id;
    const target = productTargetModal.selectedTarget;

    let newStatus: ProductModalItem["status"] = "Active (All)";
    const formData = new FormData();

    if (target === "app_only") {
      newStatus = "App Only";
      formData.append("showInApp", "true");
      formData.append("showInPos", "false");
      formData.append("isActive", "true");
    } else if (target === "pos_only") {
      newStatus = "POS Only";
      formData.append("showInApp", "false");
      formData.append("showInPos", "true");
      formData.append("isActive", "true");
    } else if (target === "everywhere") {
      newStatus = "Active (All)";
      formData.append("showInApp", "true");
      formData.append("showInPos", "true");
      formData.append("isActive", "true");
    } else if (target === "deactivate") {
      newStatus = "Disabled (All)";
      formData.append("showInApp", "false");
      formData.append("showInPos", "false");
      formData.append("isActive", "false");
    }

    // Update locally in allProducts immediately
    setAllProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            showInApp: target === "app_only" || target === "everywhere",
            showInPos: target === "pos_only" || target === "everywhere",
            available: target !== "deactivate",
            isActive: target !== "deactivate",
          };
        }
        return p;
      })
    );

    // Update in local fallback map
    if (selectedCategory) {
      setLocalFallbackProducts((prev) => {
        const catKey = selectedCategory.id.toLowerCase();
        const catList = prev[catKey] ?? DEFAULT_PRODUCTS;
        return {
          ...prev,
          [catKey]: catList.map((p) =>
            p.id === productId ? { ...p, status: newStatus } : p
          ),
        };
      });
    }

    setProductTargetModal({ open: false, product: null, selectedTarget: "everywhere" });

    // Persist change to backend
    try {
      await updateProduct(productId, formData);
    } catch (err) {
      console.warn("Could not save product availability directly to backend", err);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 w-screen h-screen">
      {!selectedCategory ? (
        /* ═══════════════════════════════════════════════
           VIEW 1: Categories Overview (Exact Figma Spec)
           ═══════════════════════════════════════════════ */
        <div className="w-[1160px] max-w-[95vw] p-6 bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-1 outline-offset-[-1px] outline-[#E5E5E5] flex flex-col justify-start items-start gap-6 overflow-hidden max-h-[90vh]">
          {/* Header */}
          <div className="self-stretch flex justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-0.5">
              <div className="self-stretch flex justify-start items-start gap-2">
                <div className="text-[#000000] text-2xl font-semibold font-['Montserrat'] tracking-wide">
                  {t("Product & Menu Availability")}
                </div>
              </div>
              <div className="self-stretch flex justify-start items-start">
                <p className="text-[#8B8B8B] font-['Inter',sans-serif] text-[12px] font-normal leading-[16px] whitespace-nowrap">
                  {t("Select category to manage product visibility")}
                </p>
              </div>
            </div>
            <div className="flex justify-start items-center gap-3">
              <button
                type="button"
                onClick={loadData}
                className="p-2.5 bg-[#F5F0EA] rounded-lg flex justify-center items-center gap-3 hover:bg-[#EDE6DC] transition-colors cursor-pointer"
                title={t("Refresh")}
              >
                <RefreshCw
                  className={`size-3.5 text-[#8F6900] ${isFetching ? "animate-spin" : ""}`}
                />
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="size-6 flex justify-center items-center text-[#000000] hover:text-[#595959] cursor-pointer"
                title={t("Close")}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="self-stretch shrink-0">
            <SearchInputField
              value={categorySearch}
              onChange={setCategorySearch}
              placeholder={t("Search categories...")}
            />
          </div>

          {/* Categories Grid (w-[1112px] flex-wrap) */}
          <div className="self-stretch overflow-y-auto max-h-[62vh] pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setProductSearch("");
                  }}
                  className="p-3 bg-[#FAFAF7] rounded-xl outline outline-2 outline-offset-[-2px] outline-[#E5E5E5] hover:outline-[#8F6900] flex flex-col justify-center items-start gap-2 cursor-pointer transition-all"
                >
                  <div className="inline-flex justify-start items-center gap-4">
                    {cat.imageUrl ? (
                      <img
                        className="size-14 rounded-xl border-[0.47px] border-[#E5E5E5] object-cover"
                        src={cat.imageUrl}
                        alt={cat.name}
                      />
                    ) : (
                      <div className="size-14 rounded-xl border-[0.47px] border-[#E5E5E5] bg-[#F5F0EA] flex items-center justify-center text-[#8F6900]">
                        <Package className="size-7" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center items-start gap-2">
                      <div className="text-[#000000] text-xs font-semibold font-['Montserrat'] tracking-tight">
                        {t(cat.name)}
                      </div>
                      <div className="px-2 py-0.5 bg-[#F5F0EA] rounded-[30px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] inline-flex justify-center items-center gap-1">
                        <span className="text-[#8F6900] text-xs font-semibold font-['Montserrat'] tracking-tight">
                          {cat.itemCount} {t("Products")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal separator */}
                  <div className="self-stretch h-px bg-[#E5E5E5] my-1" />

                  {/* Bottom status row */}
                  <div className="self-stretch flex justify-between items-center">
                    <div className="py-1 flex justify-center items-center gap-2">
                      <div className={`size-1.5 rounded-full ${getStatusDotColor(cat.status)}`} />
                      <div
                        className={`text-xs font-semibold font-['Montserrat'] tracking-tight ${getStatusTextColor(
                          cat.status
                        )}`}
                      >
                        {t(cat.status)}
                      </div>
                    </div>
                    <ArrowRight className="size-3.5 text-[#8F6900]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════
           VIEW 2: Category Products View (Exact Figma Spec)
           Shows REAL Products for the Selected Category
           ═══════════════════════════════════════════════ */
        <div className="w-[800px] max-w-[95vw] p-6 bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-1 outline-offset-[-1px] outline-[#E5E5E5] flex flex-col justify-start items-start gap-6 overflow-hidden max-h-[90vh]">
          {/* Header */}
          <div className="self-stretch flex justify-between items-center">
            <div className="flex justify-start items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="p-2 rounded-lg border border-[#E5E5E5] text-[#595959] hover:bg-[#F5F0EA] hover:text-[#333333] transition-colors cursor-pointer"
                title={t("Back to categories")}
              >
                <ArrowLeft className="size-4" />
              </button>
              {selectedCategory.imageUrl ? (
                <img
                  className="size-10 rounded-lg object-cover"
                  src={selectedCategory.imageUrl}
                  alt={selectedCategory.name}
                />
              ) : (
                <div className="size-10 rounded-lg bg-[#F5F0EA] flex items-center justify-center text-[#8F6900]">
                  <Package className="size-5" />
                </div>
              )}
              <div className="flex flex-col justify-start items-start gap-0.5">
                <div className="text-[#000000] text-2xl font-semibold font-['Montserrat'] tracking-wide">
                  {t(selectedCategory.name)}
                </div>
                <div className="text-[#8B8B8B] text-xs font-normal font-['Inter',sans-serif] leading-4">
                  {currentCategoryProducts.length} {t("Products")}
                </div>
              </div>
            </div>
            <div className="flex justify-start items-center gap-3">
              <button
                type="button"
                onClick={loadData}
                className="p-2.5 bg-[#F5F0EA] rounded-lg flex justify-center items-center gap-3 hover:bg-[#EDE6DC] transition-colors cursor-pointer"
                title={t("Refresh")}
              >
                <RefreshCw
                  className={`size-3.5 text-[#8F6900] ${isFetching ? "animate-spin" : ""}`}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  onOpenChange(false);
                }}
                className="size-6 flex justify-center items-center text-[#000000] hover:text-[#595959] cursor-pointer"
                title={t("Close")}
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="self-stretch shrink-0">
            <SearchInputField
              value={productSearch}
              onChange={setProductSearch}
              placeholder={t("Search products...")}
            />
          </div>

          {/* Products Table (Figma Spec) */}
          <div className="self-stretch rounded-2xl outline outline-1 outline-[#E5E5E5] overflow-hidden">
            {/* Table Header: px-6 py-3 bg-[#F5F0EA] */}
            <div className="self-stretch px-6 py-3 bg-[#F5F0EA] grid grid-cols-[2fr_1fr_1.2fr_1.5fr] items-center">
              <div className="text-[#595959] text-xs font-semibold font-['Montserrat'] uppercase tracking-tight">
                {t("Product")}
              </div>
              <div className="text-center text-[#595959] text-xs font-semibold font-['Montserrat'] uppercase tracking-tight">
                {t("Stock")}
              </div>
              <div className="text-center text-[#595959] text-xs font-semibold font-['Montserrat'] uppercase tracking-tight">
                {t("Price")}
              </div>
              <div className="text-center text-[#595959] text-xs font-semibold font-['Montserrat'] uppercase tracking-tight">
                {t("Status")}
              </div>
            </div>

            {/* Table Rows */}
            <div className="self-stretch px-4 py-2 bg-white divide-y divide-[#E5E5E5] max-h-[50vh] overflow-y-auto">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleOpenStatusDialog(p)}
                  className="py-3 grid grid-cols-[2fr_1fr_1.2fr_1.5fr] items-center gap-2 hover:bg-[#FAFAF7] transition-colors rounded-lg px-2 cursor-pointer"
                >
                  {/* Product info: img + name */}
                  <div className="flex items-center gap-3 min-w-0">
                    {p.imageUrl ? (
                      <img
                        className="size-10 rounded-lg object-cover shrink-0"
                        src={p.imageUrl}
                        alt={p.name}
                      />
                    ) : (
                      <div className="size-10 rounded-lg bg-[#FAFAF7] border border-[#E5E5E5] flex items-center justify-center text-[#8F6900] shrink-0">
                        <Package className="size-5" />
                      </div>
                    )}
                    <span className="text-[#333333] text-sm font-semibold font-['Montserrat'] leading-4 tracking-tight truncate">
                      {t(p.name)}
                    </span>
                  </div>

                  {/* Stock pill */}
                  <div className="flex justify-center items-center">
                    <div
                      className={`px-3 py-1 rounded-[30px] outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center ${getStockPillStyle(
                        p.stock
                      )}`}
                    >
                      <span className="text-xs font-semibold font-['Montserrat'] tracking-tight">
                        {p.stock}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div
                    className="flex justify-center items-center text-xs font-['Montserrat'] tracking-tight text-[#000000]"
                    dir="ltr"
                  >
                    <span className="font-normal text-[#000000]">EGP</span>
                    <span className="font-bold text-[#000000] ml-1.5">
                      {p.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {/* Status button */}
                  <div className="flex justify-center items-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenStatusDialog(p);
                      }}
                      className={`px-3 py-1 rounded-[30px] outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center cursor-pointer transition-transform hover:scale-105 ${getStatusPillStyle(
                        p.status
                      )}`}
                    >
                      <span className="text-xs font-semibold font-['Montserrat'] tracking-tight">
                        {t(p.status)}
                      </span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="py-8 text-center text-[#8B8B8B] text-sm font-['Montserrat']">
                  {t("No products found")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
         VIEW 3: Hide Product from Dialog (w-[658px])
         ═══════════════════════════════════════════════ */}
      {productTargetModal.open && productTargetModal.product && (
        <div
          onClick={() =>
            setProductTargetModal({
              open: false,
              product: null,
              selectedTarget: "everywhere",
            })
          }
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[658px] max-w-[95vw] p-6 bg-white rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-1 outline-offset-[-1px] outline-[#E5E5E5] flex flex-col justify-center items-end gap-6 overflow-hidden"
          >
            {/* Header */}
            <div className="self-stretch flex justify-start items-center gap-3">
              {productTargetModal.product.imageUrl ? (
                <img
                  className="size-10 rounded-lg object-cover"
                  src={productTargetModal.product.imageUrl}
                  alt=""
                />
              ) : (
                <div className="size-10 rounded-lg bg-[#F5F0EA] flex items-center justify-center text-[#8F6900]">
                  <Package className="size-5" />
                </div>
              )}
              <div className="flex flex-col justify-start items-start gap-0.5">
                <div className="self-stretch flex justify-start items-start gap-2">
                  <div className="text-[#000000] text-lg font-semibold font-['Montserrat'] tracking-tight">
                    {t("Hide Product from")}
                  </div>
                </div>
                <div className="self-stretch flex justify-start items-start gap-1">
                  <span className="text-[#8B8B8B] text-xs font-normal font-['Inter',sans-serif] leading-4">
                    {t("Choose where to hide:")}{" "}
                  </span>
                  <span className="text-[#000000] text-xs font-semibold font-['Inter',sans-serif] leading-4">
                    '{t(productTargetModal.product.name)}'
                  </span>
                </div>
              </div>
            </div>

            {/* Target Options List */}
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              {[
                {
                  id: "app_only" as ProductTarget,
                  title: "Mobile App Only",
                  desc: "Stays visible to mobile app customers only",
                  icon: Smartphone,
                  isError: false,
                },
                {
                  id: "pos_only" as ProductTarget,
                  title: "POS Only",
                  desc: "Stays visible and sellable on POS only",
                  icon: Monitor,
                  isError: false,
                },
                {
                  id: "everywhere" as ProductTarget,
                  title: "Activate Everywhere",
                  desc: "Available on both app and POS",
                  icon: CheckCircle2,
                  isError: false,
                },
                {
                  id: "deactivate" as ProductTarget,
                  title: "Deactivate both",
                  desc: "Disappears from both app and POS",
                  icon: EyeOff,
                  isError: true,
                },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = productTargetModal.selectedTarget === opt.id;

                let cardClasses =
                  "self-stretch px-4 py-4 bg-[#FAFAF7] rounded-xl outline outline-2 outline-offset-[-2px] outline-[#E5E5E5] flex flex-col justify-center items-start gap-2 cursor-pointer transition-all hover:bg-[#F5F0EA]/50";
                let titleClasses =
                  "text-[#333333] text-base font-bold font-['Montserrat'] leading-4 tracking-tight";
                let descClasses =
                  "text-[#595959] text-xs font-normal font-['Montserrat'] leading-4 tracking-tight";
                let iconColor = "text-[#333333]";

                if (isSelected) {
                  if (opt.isError) {
                    cardClasses =
                      "self-stretch px-4 py-4 bg-stone-50 rounded-xl outline outline-2 outline-offset-[-2px] outline-[#E53935] flex flex-col justify-center items-start gap-2 cursor-pointer transition-all";
                    titleClasses =
                      "text-[#E53935] text-base font-bold font-['Montserrat'] leading-4 tracking-tight";
                    descClasses =
                      "text-[#E53935] text-xs font-normal font-['Montserrat'] leading-4 tracking-tight";
                    iconColor = "text-[#E53935]";
                  } else {
                    cardClasses =
                      "self-stretch px-4 py-4 bg-[#F5F0EA] rounded-xl outline outline-2 outline-offset-[-2px] outline-[#8F6900] flex flex-col justify-center items-start gap-2 cursor-pointer transition-all";
                    titleClasses =
                      "text-[#000000] text-base font-bold font-['Montserrat'] leading-4 tracking-tight";
                    descClasses =
                      "text-[#000000] text-xs font-normal font-['Montserrat'] leading-4 tracking-tight";
                    iconColor = "text-[#8F6900]";
                  }
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() =>
                      setProductTargetModal((prev) => ({
                        ...prev,
                        selectedTarget: opt.id,
                      }))
                    }
                    className={cardClasses}
                  >
                    <div className="inline-flex justify-start items-center gap-4">
                      <div className="size-6 flex items-center justify-center">
                        <Icon className={`size-5 ${iconColor}`} />
                      </div>
                      <div className="inline-flex flex-col justify-start items-start gap-1.5">
                        <div className="self-stretch flex justify-start items-start gap-2">
                          <div className={titleClasses}>{t(opt.title)}</div>
                        </div>
                        <div className="self-stretch flex justify-start items-start gap-2">
                          <div className={descClasses}>{t(opt.desc)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Horizontal separator */}
            <div className="self-stretch h-px bg-[#E5E5E5]" />

            {/* Buttons */}
            <div className="inline-flex justify-end items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setProductTargetModal({
                    open: false,
                    product: null,
                    selectedTarget: "everywhere",
                  })
                }
                className="h-14 px-7 py-4 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] flex justify-center items-center gap-3 cursor-pointer hover:bg-[#F5F0EA] transition-colors"
              >
                <span className="text-[#8F6900] text-base font-semibold font-['Montserrat'] leading-6">
                  {t("Cancel")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleConfirmTargetChange}
                className="h-14 px-7 py-4 bg-[#8F6900] rounded-[5px] flex justify-center items-center gap-3 cursor-pointer hover:bg-[#7a5b00] transition-colors"
              >
                <span className="text-white text-base font-semibold font-['Montserrat'] leading-6">
                  {t("Confirm")}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default AvailabilityModal;
