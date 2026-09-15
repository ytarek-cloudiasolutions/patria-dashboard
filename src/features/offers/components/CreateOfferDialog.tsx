import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, CornerDownRight, FileUp, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DatePicker from "@/shared/components/DatePicker";
import DropdownSelect from "@/shared/components/DropdownSelect";
import TabItem from "@/shared/components/TabItem";
import { cn } from "@/lib/utils";
import { DISCOUNT_TYPE_OPTIONS } from "../data";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { getProducts } from "@/features/products/api/productsApi";
import type { DiscountType, Offer, OfferDialogTab, OfferFormData } from "../types";

interface SimpleProduct {
  id: string;
  name: string;
  category: string;
  price?: number;
}

const FORM_ID = "create-offer-form";

const INITIAL_FORM: OfferFormData = {
  productName: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  startDate: "",
  endDate: "",
  bannerImage: undefined,
  productIds: [],
  code: "",
  usageLimit: "",
  minOrderAmount: "",
  isBanner: false,
  releaseDate: "",
  productId: "",
};

const formatDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "";
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatPeriod = (start: string, end: string) => {
  const startLabel = formatDate(start);
  const endLabel = formatDate(end);
  const year = (end || start).split("-")[0];
  if (startLabel && endLabel) return `${startLabel} - ${endLabel}, ${year}`;
  return startLabel || endLabel || "—";
};

interface CreateOfferDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveOffer: (offer: Offer, imageFile?: File) => void;
  editingOffer?: Offer;
}

const EXCLUDED_CATEGORIES = ["raw ingredients", "ingredients"];

const CreateOfferDialog = ({
  isOpen,
  onOpenChange,
  onSaveOffer,
  editingOffer,
}: CreateOfferDialogProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<OfferDialogTab>("offer");
  const [form, setForm] = useState<OfferFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof OfferFormData, string>>
  >({});
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Offer tab: Products list state (API-filtered)
  const [catalog, setCatalog] = useState<SimpleProduct[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [productSearch, setProductSearch] = useState("");
  const [debouncedProductSearch, setDebouncedProductSearch] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Banner tab: Product picker state (API-filtered, not frontend)
  const [bannerProductSearch, setBannerProductSearch] = useState("");
  const [debouncedBannerSearch, setDebouncedBannerSearch] = useState("");
  const [bannerProducts, setBannerProducts] = useState<SimpleProduct[]>([]);
  const [isLoadingBannerProducts, setIsLoadingBannerProducts] = useState(false);
  const [isBannerProductDropdownOpen, setIsBannerProductDropdownOpen] =
    useState(false);
  const bannerProductRef = useRef<HTMLDivElement>(null);

  // Close banner product dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bannerProductRef.current &&
        !bannerProductRef.current.contains(event.target as Node)
      ) {
        setIsBannerProductDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounce product search query in Offer tab (300 ms)
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedProductSearch(productSearch),
      300,
    );
    return () => clearTimeout(timer);
  }, [productSearch]);

  // Debounce product search query in Banner tab (300 ms)
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedBannerSearch(bannerProductSearch),
      300,
    );
    return () => clearTimeout(timer);
  }, [bannerProductSearch]);

  // Reset/populate form when dialog opens
  useEffect(() => {
    if (isOpen) {
      const isBannerOffer = Boolean(editingOffer?.isBanner);
      setActiveTab(isBannerOffer ? "banner" : "offer");
      const initialProductId =
        editingOffer?.productId ||
        (editingOffer?.productIds?.[0] ? String(editingOffer.productIds[0]) : "");

      setForm(
        editingOffer
          ? {
              productName: editingOffer.offerTitle,
              description: editingOffer.offerDescription,
              discountType: editingOffer.discountType || "percentage",
              discountValue:
                editingOffer.offerPercentage !== undefined
                  ? String(editingOffer.offerPercentage)
                  : "",
              startDate: editingOffer.startDate
                ? editingOffer.startDate.split("T")[0]
                : "",
              endDate: editingOffer.endDate
                ? editingOffer.endDate.split("T")[0]
                : "",
              bannerImage: editingOffer.offerImage,
              productIds: (editingOffer.productIds ?? [])
                .map((p: any) =>
                  typeof p === "string" ? p : (p._id ?? p.id ?? ""),
                )
                .filter(Boolean),
              code: "",
              usageLimit:
                editingOffer.usageLimit !== null &&
                editingOffer.usageLimit !== undefined
                  ? String(editingOffer.usageLimit)
                  : "",
              minOrderAmount:
                editingOffer.minOrderAmount !== null &&
                editingOffer.minOrderAmount !== undefined
                  ? String(editingOffer.minOrderAmount)
                  : "",
              isBanner: isBannerOffer,
              releaseDate: editingOffer.releaseDate
                ? editingOffer.releaseDate.split("T")[0]
                : "",
              productId: initialProductId,
            }
          : INITIAL_FORM,
      );
      setBannerProductSearch(
        isBannerOffer ? editingOffer?.offerTitle || "" : "",
      );
      setErrors({});
      setIsDiscountOpen(false);
      setImageFile(undefined);
      setProductSearch("");
      setDebouncedProductSearch("");
      setIsBannerProductDropdownOpen(false);
    }
  }, [isOpen, editingOffer]);

  // Offer tab: fetch products via API using search query
  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingProducts(true);
    const params: { limit: number; search?: string } = { limit: 200 };
    if (debouncedProductSearch.trim()) {
      params.search = debouncedProductSearch.trim();
    }
    getProducts(params)
      .then((res) => {
        const items = (res.products || [])
          .filter(
            (p) =>
              !(p as any).isIngredient &&
              !EXCLUDED_CATEGORIES.includes(
                (p.category ?? "").toLowerCase(),
              ),
          )
          .map((p) => ({
            id: p._id ?? p.id,
            name: p.name ?? "",
            category: p.category ?? "Other",
            price: typeof p.price === "number" ? p.price : undefined,
          }));
        setCatalog(items);
        if (!debouncedProductSearch.trim()) {
          setCollapsedCategories(new Set(items.map((p) => p.category)));
        } else {
          setCollapsedCategories(new Set());
        }
      })
      .catch(() => setCatalog([]))
      .finally(() => setIsLoadingProducts(false));
  }, [isOpen, debouncedProductSearch]);

  // Banner tab: fetch products via API using search filter (server-side, not frontend)
  useEffect(() => {
    if (!isOpen || activeTab !== "banner") return;
    setIsLoadingBannerProducts(true);
    const params: { limit: number; search?: string } = { limit: 50 };
    if (debouncedBannerSearch.trim()) {
      params.search = debouncedBannerSearch.trim();
    }
    getProducts(params)
      .then((res) => {
        const items = (res.products || [])
          .filter(
            (p) =>
              !(p as any).isIngredient &&
              !EXCLUDED_CATEGORIES.includes(
                (p.category ?? "").toLowerCase(),
              ),
          )
          .map((p) => ({
            id: p._id ?? p.id,
            name: p.name ?? "",
            category: p.category ?? "Other",
            price: typeof p.price === "number" ? p.price : undefined,
          }));
        setBannerProducts(items);
      })
      .catch(() => setBannerProducts([]))
      .finally(() => setIsLoadingBannerProducts(false));
  }, [isOpen, activeTab, debouncedBannerSearch]);

  const groupedCatalog = useMemo(() => {
    const groups: Record<string, SimpleProduct[]> = {};
    catalog.forEach((p) => {
      const cat = p.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [catalog]);

  const toggleProduct = (productId: string) => {
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

  const toggleCategoryProducts = (products: SimpleProduct[]) => {
    const productIds = products.map((p) => p.id);
    const allSelected = productIds.every((id) =>
      form.productIds.includes(id),
    );
    setForm((prev) => ({
      ...prev,
      productIds: allSelected
        ? prev.productIds.filter((id) => !productIds.includes(id))
        : [...new Set([...prev.productIds, ...productIds])],
    }));
  };

  const selectAll = () => {
    setForm((prev) => ({ ...prev, productIds: catalog.map((p) => p.id) }));
  };

  const deselectAll = () => {
    setForm((prev) => ({ ...prev, productIds: [] }));
  };

  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const set = <K extends keyof OfferFormData>(
    key: K,
    value: OfferFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      set("bannerImage", URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof OfferFormData, string>> = {};

    if (activeTab === "banner") {
      if (!form.productId && !form.productName.trim() && !form.description.trim()) {
        next.description = "Product or description is required";
      }
      setErrors(next);
      if (Object.keys(next).length > 0) return;

      const title = (form.productName || form.description || "Banner").trim();
      const offer: Offer = {
        id: editingOffer?.id ?? Date.now(),
        offerStatus: editingOffer?.offerStatus ?? true,
        offerTitle: title,
        offerDescription: form.description.trim() || title,
        offerPercentage: 0,
        discountType: "percentage",
        offerValidPeriod: form.releaseDate ? formatDate(form.releaseDate) : "—",
        numberOfProducts: form.productId ? 1 : 0,
        offerImage: form.bannerImage,
        startDate: form.releaseDate || new Date().toISOString().split("T")[0],
        endDate:
          form.releaseDate ||
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        code: undefined,
        usageLimit: 0,
        minOrderAmount: 0,
        productIds: form.productId ? [form.productId] : [],
        isBanner: true,
        releaseDate: form.releaseDate || undefined,
        productId: form.productId || undefined,
      };
      onSaveOffer(offer, imageFile);
      onOpenChange(false);
      return;
    }

    // Offer tab validation
    if (!form.productName.trim()) next.productName = "Offer name is required";
    if (!form.description.trim()) next.description = "Description is required";
    if (!form.discountValue.trim() || Number(form.discountValue) <= 0) {
      next.discountValue = "Enter a valid discount";
    }
    if (!form.startDate) next.startDate = "Start date is required";
    if (!form.endDate) next.endDate = "End date is required";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const offer: Offer = {
      id: editingOffer?.id ?? Date.now(),
      offerStatus: editingOffer?.offerStatus ?? true,
      offerTitle: form.productName.trim(),
      offerDescription: form.description.trim(),
      offerPercentage: Number(form.discountValue) || 0,
      discountType: form.discountType,
      offerValidPeriod: formatPeriod(form.startDate, form.endDate),
      numberOfProducts: form.productIds.length,
      offerImage: form.bannerImage,
      startDate: form.startDate,
      endDate: form.endDate,
      code: undefined,
      usageLimit: form.usageLimit?.trim() ? Number(form.usageLimit) : 0,
      minOrderAmount: form.minOrderAmount?.trim()
        ? Number(form.minOrderAmount)
        : 0,
      productIds: form.productIds,
      isBanner: false,
    };
    onSaveOffer(offer, imageFile);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[986px] sm:max-w-[986px] overflow-hidden rounded-[12px] bg-white p-0 ring-0"
      >
        {isDiscountOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        {/* Scrollable wrapper */}
        <div className="flex max-h-[calc(100vh-2rem)] flex-col overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">
            {/* ── Header ── */}
            <DialogTitle className="text-[24px] font-semibold tracking-[0.02em] text-[#333333] [font-style:normal]">
              {editingOffer
                ? editingOffer.isBanner
                  ? t("Edit Banner")
                  : t("Edit Offer")
                : t("Create a New Banner")}
            </DialogTitle>

            {/* ── Tab Navigation (Styled like Products module tabs) ── */}
            <div className="grid grid-cols-2 gap-1.5 border-b border-[#E5E5E5]">
              <TabItem
                value="offer"
                label={t("Create a new offer")}
                isActive={activeTab === "offer"}
                onClick={(v) => {
                  setActiveTab(v as OfferDialogTab);
                  setErrors({});
                }}
              />
              <TabItem
                value="banner"
                label={t("Banner")}
                isActive={activeTab === "banner"}
                onClick={(v) => {
                  setActiveTab(v as OfferDialogTab);
                  setErrors({});
                }}
              />
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* ── Form Body ── */}
            <form
              id={FORM_ID}
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-8"
            >
              {activeTab === "offer" ? (
                <>
                  {/* Banner Image Section */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[16px] font-semibold tracking-[0.02em] text-[#28293D]">
                      {t("Banner image")}{" "}
                      <span className="text-[13px] font-medium tracking-[0.02em] text-[#595959]">
                        ({t("Optional")})
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full cursor-pointer flex-col items-center justify-center gap-6 overflow-hidden rounded-[16px] border-2 border-dashed border-[#624F1C] bg-[rgba(245,240,234,0.3)] py-6 text-center transition-colors hover:bg-[rgba(245,240,234,0.5)]"
                    >
                      {form.bannerImage ? (
                        <img
                          src={form.bannerImage}
                          alt="Banner preview"
                          className="max-h-48 w-full object-cover"
                        />
                      ) : (
                        <>
                          <FileUp className="size-6 text-[#8B8B8B]" />
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[14px] font-semibold leading-[1.07em] tracking-[0.02em] text-[#333333]">
                              {t("Click to upload image")}
                            </span>
                            <span className="text-[12px] leading-[1.4em] tracking-[0.02em] text-[#8B8B8B]">
                              {t("PNG, JPG up to 5MB")}
                            </span>
                          </div>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Included Products Section */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[16px] font-semibold tracking-[0.02em] text-[#28293D]">
                      {t("Included Products")}{" "}
                      <span className="text-[#C90000]">*</span>
                    </p>

                    {/* Product Selection Card */}
                    <div className="flex flex-col gap-[14px] rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-3">
                      {/* Card Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold tracking-[0.02em] text-[#000000]">
                          {t("Select products for this offer")}
                        </span>
                        <div className="flex items-center gap-[10px]">
                          <button
                            type="button"
                            onClick={selectAll}
                            className="cursor-pointer text-[12px] font-semibold leading-[1.4em] tracking-[0.02em] underline text-[#000000] transition-opacity hover:opacity-70"
                          >
                            {t("Select All")}
                          </button>
                          <div className="h-4 w-px bg-[#CACBD4]" />
                          <button
                            type="button"
                            onClick={deselectAll}
                            className="cursor-pointer text-[12px] font-semibold leading-[1.4em] tracking-[0.02em] underline text-[#C90000] transition-opacity hover:opacity-70"
                          >
                            {t("Deselect All")}
                          </button>
                        </div>
                      </div>

                      {/* Search input (filters via API) */}
                      <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-[14px] size-5 -translate-y-1/2 text-[#8B8B8B]" />
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder={t("Search products...")}
                          className="h-[37px] w-full rounded-[8px] border border-[#CACBD4] bg-white pl-[42px] pr-3 text-[14px] leading-[1.4em] tracking-[0.02em] text-[#000000] outline-none placeholder:text-[#8B8B8B] focus:border-[#8F6900]"
                        />
                        {isLoadingProducts && (
                          <div className="absolute top-1/2 right-3 -translate-y-1/2">
                            <div className="size-4 animate-spin rounded-full border-2 border-[#8F6900] border-t-transparent" />
                          </div>
                        )}
                      </div>

                      {/* Product list */}
                      {catalog.length === 0 ? (
                        <p className="py-4 text-center text-[13px] text-[#8B8B8B]">
                          {t("No products found.")}
                        </p>
                      ) : (
                        <div className="flex flex-col gap-[14px]">
                          {Object.entries(groupedCatalog).map(
                            ([category, products], idx) => {
                              const allSelected = products.every((p) =>
                                form.productIds.includes(p.id),
                              );
                              const someSelected = products.some((p) =>
                                form.productIds.includes(p.id),
                              );
                              const isCollapsed =
                                collapsedCategories.has(category);

                              return (
                                <div
                                  key={category}
                                  className="flex flex-col gap-[10px]"
                                >
                                  {idx > 0 && (
                                    <hr className="border-[#CACBD4]" />
                                  )}

                                  {/* Category Header row */}
                                  <div className="flex items-center gap-[10px]">
                                    {/* Category checkbox */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleCategoryProducts(products)
                                      }
                                      className={cn(
                                        "flex size-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors cursor-pointer",
                                        allSelected
                                          ? "border-[#8F6900] bg-[#8F6900]"
                                          : someSelected
                                            ? "border-[#8F6900] bg-white"
                                            : "border-[#CACBD4] bg-white",
                                      )}
                                    >
                                      {allSelected && (
                                        <Check className="size-3 text-white" />
                                      )}
                                      {someSelected && !allSelected && (
                                        <div className="h-0.5 w-3 rounded-full bg-[#8F6900]" />
                                      )}
                                    </button>

                                    {/* Name + chevron */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleCategoryCollapse(category)
                                      }
                                      className="flex flex-1 cursor-pointer items-center justify-between gap-2"
                                    >
                                      <span className="text-left text-[14px] font-semibold text-[#28293D]">
                                        {category}
                                      </span>
                                      <ChevronDown
                                        className={cn(
                                          "size-4 shrink-0 text-[#28293D] transition-transform duration-200",
                                          isCollapsed && "-rotate-90",
                                        )}
                                      />
                                    </button>
                                  </div>

                                  {/* Category Items (collapsible) */}
                                  {!isCollapsed && (
                                    <div className="flex flex-col gap-[10px] pl-5">
                                      {products.map((product, pi) => {
                                        const selected =
                                          form.productIds.includes(product.id);
                                        return (
                                          <div
                                            key={product.id}
                                            className="flex flex-col gap-[10px]"
                                          >
                                            {pi > 0 && (
                                              <hr className="border-[#CACBD4]" />
                                            )}
                                            <div className="flex items-center gap-[6px]">
                                              <CornerDownRight className="size-3 shrink-0 text-[#CACBD4]" />
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  toggleProduct(product.id)
                                                }
                                                className="flex flex-1 cursor-pointer items-center justify-between gap-[6px]"
                                              >
                                                <div className="flex items-center gap-[6px]">
                                                  <div
                                                    className={cn(
                                                      "flex size-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors",
                                                      selected
                                                        ? "border-[#8F6900] bg-[#8F6900]"
                                                        : "border-[#CACBD4] bg-white",
                                                    )}
                                                  >
                                                    {selected && (
                                                      <Check className="size-3 text-white" />
                                                    )}
                                                  </div>
                                                  <span className="text-left text-[14px] text-[#28293D]">
                                                    {product.name}
                                                  </span>
                                                </div>
                                                {product.price !== undefined && (
                                                  <span className="text-[14px] font-semibold text-[#28293D]">
                                                    EGP {product.price.toFixed(2)}
                                                  </span>
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Form Fields (Offer Tab) ── */}
                  <div className="flex flex-col gap-4">
                    {/* Offer Name */}
                    <div className="flex flex-col gap-[10px]">
                      <label
                        htmlFor="offer-name"
                        className="text-[16px] font-medium text-[#000000]"
                      >
                        {t("Offer Name")}{" "}
                        <span className="text-[#C90000]">*</span>
                      </label>
                      <input
                        id="offer-name"
                        type="text"
                        value={form.productName}
                        onChange={(e) => set("productName", e.target.value)}
                        placeholder={t("e.g. Artisanal Sourdough")}
                        className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[16px] text-[#000000] outline-none placeholder:text-[#8B8B8B] focus:border-primary"
                      />
                      {errors.productName && (
                        <p className="text-[13px] text-[#C90000]">
                          {errors.productName}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-[10px]">
                      <label
                        htmlFor="offer-description"
                        className="text-[16px] font-medium text-[#000000]"
                      >
                        {t("Description")}{" "}
                        <span className="text-[#C90000]">*</span>
                      </label>
                      <input
                        id="offer-description"
                        type="text"
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        placeholder={t("Describe this offer...")}
                        className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[16px] text-[#000000] outline-none placeholder:text-[#8B8B8B] focus:border-primary"
                      />
                      {errors.description && (
                        <p className="text-[13px] text-[#C90000]">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    {/* Discount Type + Discount Value row */}
                    <div className="flex flex-col gap-4 sm:flex-row">
                      {/* Discount Type */}
                      <div className="flex flex-1 flex-col gap-[10px]">
                        <label className="text-[16px] font-medium text-[#000000]">
                          {t("Discount Type")}{" "}
                          <span className="text-[#C90000]">*</span>
                        </label>
                        <DropdownSelect
                          options={DISCOUNT_TYPE_OPTIONS.map((o) => ({
                            ...o,
                            label: t(o.label),
                          }))}
                          selected={form.discountType}
                          onSelect={(value) =>
                            set("discountType", value as DiscountType)
                          }
                          onOpenChange={setIsDiscountOpen}
                          align="start"
                          className="h-[50px] w-full rounded-[12px] md:w-full"
                          contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                        />
                      </div>

                      {/* Discount Value */}
                      <div className="flex flex-1 flex-col gap-[10px]">
                        <label
                          htmlFor="discount-value"
                          className="text-[16px] font-medium text-[#000000]"
                        >
                          {form.discountType === "percentage"
                            ? t("Discount %")
                            : t("Discount Value")}
                        </label>
                        <input
                          id="discount-value"
                          type="number"
                          min="0"
                          value={form.discountValue}
                          onChange={(e) => set("discountValue", e.target.value)}
                          placeholder="e.g. 20"
                          className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[16px] text-[#000000] outline-none placeholder:text-[#8B8B8B] focus:border-primary"
                        />
                        {errors.discountValue && (
                          <p className="text-[13px] text-[#C90000]">
                            {errors.discountValue}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Usage Limits (Total Uses) - Full Width (Promo code removed per spec) */}
                    <div className="flex flex-col gap-[10px]">
                      <label
                        htmlFor="usage-limit"
                        className="text-[16px] font-medium text-[#000000]"
                      >
                        {t("Usage Limits")}{" "}
                        <span className="text-[13px] font-medium tracking-[0.02em] text-[#595959]">
                          ({t("Total Uses")})
                        </span>
                      </label>
                      <input
                        id="usage-limit"
                        type="number"
                        min="0"
                        value={form.usageLimit}
                        onChange={(e) => set("usageLimit", e.target.value)}
                        placeholder={t("Infinite")}
                        className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[16px] text-[#000000] outline-none placeholder:text-[#8B8B8B] focus:border-primary"
                      />
                    </div>

                    {/* Start Date + End Date + Min. Order Amount row (3 columns) */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {/* Start Date */}
                      <div className="flex flex-1 flex-col gap-[10px]">
                        <label className="text-[16px] font-medium text-[#000000]">
                          {t("Start Date")}{" "}
                          <span className="text-[#C90000]">*</span>
                        </label>
                        <DatePicker
                          value={form.startDate}
                          onChange={(date) => set("startDate", date)}
                          placeholder="dd/mm/yyyy"
                          popoverPlacement="bottom-right"
                          withBackdrop
                        />
                        {errors.startDate && (
                          <p className="text-[13px] text-[#C90000]">
                            {errors.startDate}
                          </p>
                        )}
                      </div>

                      {/* End Date */}
                      <div className="flex flex-1 flex-col gap-[10px]">
                        <label className="text-[16px] font-medium text-[#000000]">
                          {t("End Date")}{" "}
                          <span className="text-[#C90000]">*</span>
                        </label>
                        <DatePicker
                          value={form.endDate}
                          onChange={(date) => set("endDate", date)}
                          placeholder="dd/mm/yyyy"
                          popoverPlacement="bottom-right"
                          minDate={form.startDate || undefined}
                          withBackdrop
                        />
                        {errors.endDate && (
                          <p className="text-[13px] text-[#C90000]">
                            {errors.endDate}
                          </p>
                        )}
                      </div>

                      {/* Min. Order Amount */}
                      <div className="flex flex-1 flex-col gap-[10px]">
                        <label
                          htmlFor="min-order-amount"
                          className="text-[16px] font-medium text-[#000000]"
                        >
                          {t("Min. Order Amount (EGP)")}
                        </label>
                        <input
                          id="min-order-amount"
                          type="number"
                          min="0"
                          value={form.minOrderAmount}
                          onChange={(e) =>
                            set("minOrderAmount", e.target.value)
                          }
                          placeholder={t("e.g. 100")}
                          className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[16px] text-[#000000] outline-none placeholder:text-[#8B8B8B] focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* ── Banner Tab ── */
                <div className="flex flex-col gap-6">
                  {/* Banner Image Section */}
                  <div className="flex flex-col gap-3">
                    <p className="text-[16px] font-semibold tracking-[0.02em] text-[#28293D]">
                      {t("Banner image")}{" "}
                      <span className="text-[13px] font-medium tracking-[0.02em] text-[#595959]">
                        ({t("Optional")})
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full cursor-pointer flex-col items-center justify-center gap-6 overflow-hidden rounded-[16px] border-2 border-dashed border-[#624F1C] bg-[rgba(245,240,234,0.3)] py-6 text-center transition-colors hover:bg-[rgba(245,240,234,0.5)]"
                    >
                      {form.bannerImage ? (
                        <img
                          src={form.bannerImage}
                          alt="Banner preview"
                          className="max-h-48 w-full object-cover"
                        />
                      ) : (
                        <>
                          <FileUp className="size-6 text-[#8B8B8B]" />
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[14px] font-semibold leading-[1.07em] tracking-[0.02em] text-[#333333]">
                              {t("Click to upload image")}
                            </span>
                            <span className="text-[12px] leading-[1.4em] tracking-[0.02em] text-[#8B8B8B]">
                              {t("PNG, JPG up to 5MB")}
                            </span>
                          </div>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Product Search Field (API-driven search) */}
                  <div
                    ref={bannerProductRef}
                    className="relative flex flex-col gap-[10px]"
                  >
                    <label
                      htmlFor="banner-product"
                      className="text-[16px] font-medium text-[#000000]"
                    >
                      {t("Product")}
                    </label>
                    <div className="relative">
                      <input
                        id="banner-product"
                        type="text"
                        value={bannerProductSearch}
                        onChange={(e) => {
                          setBannerProductSearch(e.target.value);
                          setIsBannerProductDropdownOpen(true);
                          if (!e.target.value) {
                            set("productId", "");
                            set("productName", "");
                          }
                        }}
                        onFocus={() => setIsBannerProductDropdownOpen(true)}
                        placeholder={t("Search product")}
                        className="h-[50px] w-full rounded-[12px] border border-[#E5E5E5] bg-white px-3 pr-10 text-[16px] text-[#000000] outline-none placeholder:text-[#8B8B8B] focus:border-primary"
                      />
                      {isLoadingBannerProducts && (
                        <div className="absolute top-1/2 right-9 -translate-y-1/2">
                          <div className="size-4 animate-spin rounded-full border-2 border-[#8F6900] border-t-transparent" />
                        </div>
                      )}
                      {bannerProductSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setBannerProductSearch("");
                            set("productId", "");
                            set("productName", "");
                          }}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8B8B8B] hover:text-[#333333] cursor-pointer"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>

                    {/* Autocomplete Dropdown with API results */}
                    {isBannerProductDropdownOpen && (
                      <div className="absolute top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-[12px] border border-[#CACBD4] bg-white shadow-lg">
                        {isLoadingBannerProducts && bannerProducts.length === 0 ? (
                          <div className="flex items-center justify-center p-4 text-[14px] text-[#8B8B8B]">
                            <div className="mr-2 size-4 animate-spin rounded-full border-2 border-[#8F6900] border-t-transparent" />
                            {t("Loading...") || "Loading..."}
                          </div>
                        ) : bannerProducts.length === 0 ? (
                          <div className="p-3 text-center text-[14px] text-[#8B8B8B]">
                            {t("No products found.")}
                          </div>
                        ) : (
                          bannerProducts.map((prod) => (
                            <button
                              type="button"
                              key={prod.id}
                              onClick={() => {
                                set("productId", prod.id);
                                set("productName", prod.name);
                                setBannerProductSearch(prod.name);
                                setIsBannerProductDropdownOpen(false);
                              }}
                              className={cn(
                                "flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[#F5F0EA]",
                                form.productId === prod.id &&
                                  "bg-[#F5F0EA]/80 font-medium text-[#8F6900]",
                              )}
                            >
                              <span className="text-[14px] text-[#28293D]">
                                {prod.name}
                              </span>
                              {prod.price !== undefined && (
                                <span className="text-[13px] font-semibold text-[#8F6900]">
                                  EGP {prod.price.toFixed(2)}
                                </span>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Description Field */}
                  <div className="flex flex-col gap-[10px]">
                    <label
                      htmlFor="banner-description"
                      className="text-[16px] font-medium text-[#000000]"
                    >
                      {t("Description")}
                    </label>
                    <input
                      id="banner-description"
                      type="text"
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder={t("Describe this offer...")}
                      className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[16px] text-[#000000] outline-none placeholder:text-[#8B8B8B] focus:border-primary"
                    />
                    {errors.description && (
                      <p className="text-[13px] text-[#C90000]">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Release date (Optional) Field */}
                  <div className="flex flex-col gap-[10px]">
                    <label className="text-[16px] font-medium text-[#000000]">
                      {t("Release date")}{" "}
                      <span className="text-[13px] font-medium tracking-[0.02em] text-[#595959]">
                        ({t("Optional")})
                      </span>
                    </label>
                    <DatePicker
                      value={form.releaseDate || ""}
                      onChange={(date) => set("releaseDate", date)}
                      placeholder="dd/mm/yyyy"
                      popoverPlacement="bottom-right"
                      withBackdrop
                    />
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* ── Footer ── */}
          <div className="sticky bottom-0 bg-white px-6 pb-6">
            <hr className="mb-6 border-[#CACBD4]" />
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="h-14 cursor-pointer rounded-[5px] border border-[#8F6900] px-[30px] text-[16px] font-semibold leading-6 tracking-[0.02em] text-[#8F6900] transition-colors hover:bg-[#F5F0EA]"
              >
                {t("Cancel")}
              </button>
              <button
                form={FORM_ID}
                type="submit"
                className="h-14 cursor-pointer rounded-[5px] bg-[#8F6900] px-[30px] text-[16px] font-semibold leading-6 tracking-[0.02em] text-white transition-opacity hover:opacity-90"
              >
                {t("Save offer")}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferDialog;
