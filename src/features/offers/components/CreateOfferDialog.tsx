import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, CornerDownRight, FileUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DatePicker from "@/shared/components/DatePicker";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { cn } from "@/lib/utils";
import { DISCOUNT_TYPE_OPTIONS } from "../data";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { getProducts } from "@/features/products/api/productsApi";
import type { DiscountType, Offer, OfferFormData } from "../types";

interface SimpleProduct {
  id: string;
  name: string;
  category: string;
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

const CreateOfferDialog = ({
  isOpen,
  onOpenChange,
  onSaveOffer,
  editingOffer,
}: CreateOfferDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<OfferFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof OfferFormData, string>>
  >({});
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [catalog, setCatalog] = useState<SimpleProduct[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (isOpen) {
      setForm(
        editingOffer
          ? {
              productName: editingOffer.offerTitle,
              description: editingOffer.offerDescription,
              discountType: editingOffer.discountType,
              discountValue: String(editingOffer.offerPercentage),
              startDate: editingOffer.startDate
                ? editingOffer.startDate.split("T")[0]
                : "",
              endDate: editingOffer.endDate
                ? editingOffer.endDate.split("T")[0]
                : "",
              bannerImage: editingOffer.offerImage,
              productIds: (editingOffer.productIds ?? []).map((p: any) =>
                typeof p === "string" ? p : (p._id ?? p.id ?? ""),
              ).filter(Boolean),
              code: editingOffer.code || "",
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
            }
          : INITIAL_FORM,
      );
      setErrors({});
      setIsDiscountOpen(false);
      setImageFile(undefined);
      getProducts({ limit: 200 })
        .then((res) => {
          const EXCLUDED_CATEGORIES = ["raw ingredients", "ingredients"];
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
            }));
          setCatalog(items);
          // Collapse all categories by default
          const cats = new Set(items.map((p) => p.category));
          setCollapsedCategories(cats);
        })
        .catch(() => setCatalog([]));
    }
  }, [isOpen, editingOffer]);

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
      code: form.code?.trim() || undefined,
      usageLimit: form.usageLimit?.trim() ? Number(form.usageLimit) : 0,
      minOrderAmount: form.minOrderAmount?.trim() ? Number(form.minOrderAmount) : 0,
      productIds: form.productIds,
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
          <div className="flex flex-col gap-8 p-6">
            {/* ── Header ── */}
            <DialogTitle className="text-[24px] font-semibold tracking-[0.02em] text-[#333333] [font-style:normal]">
              {editingOffer ? t("Edit Offer") : t("Create New Offer")}
            </DialogTitle>

            {/* ── Body: Banner + Included Products (gap 32px) ── */}
            <div className="flex flex-col gap-8">
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
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
                                    "flex size-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors",
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

                                {/* Name + chevron — clicking anywhere here toggles collapse */}
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
                                            className="flex flex-1 cursor-pointer items-center gap-[6px]"
                                          >
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
            </div>

            {/* ── Form Fields ── */}
            <form
              id={FORM_ID}
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
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

              {/* Promo Code + Usage Limit row */}
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Promo Code */}
                <div className="flex flex-1 flex-col gap-[10px]">
                  <label
                    htmlFor="promo-code"
                    className="text-[16px] font-medium text-[#000000]"
                  >
                    {t("Promo Code")}{" "}
                    <span className="text-[13px] font-medium tracking-[0.02em] text-[#595959]">
                      ({t("Optional")})
                    </span>
                  </label>
                  <input
                    id="promo-code"
                    type="text"
                    value={form.code}
                    onChange={(e) => set("code", e.target.value)}
                    placeholder="e.g. SUMMER20"
                    className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[16px] text-[#000000] outline-none placeholder:text-[#8B8B8B] focus:border-primary"
                  />
                </div>

                {/* Usage Limit */}
                <div className="flex flex-1 flex-col gap-[10px]">
                  <label
                    htmlFor="usage-limit"
                    className="text-[16px] font-medium text-[#000000]"
                  >
                    {t("Usage Limit")}{" "}
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
              </div>

              {/* Start Date + End Date row */}
              <div className="flex flex-col gap-4 sm:flex-row">
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
                    {t("Min. Order Amount")}{" "}
                    <span className="text-[13px] font-medium tracking-[0.02em] text-[#595959]">
                      (EGP)
                    </span>
                  </label>
                  <input
                    id="min-order-amount"
                    type="number"
                    min="0"
                    value={form.minOrderAmount}
                    onChange={(e) => set("minOrderAmount", e.target.value)}
                    placeholder="0"
                    className="h-[50px] rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[16px] text-[#000000] outline-none placeholder:text-[#8B8B8B] focus:border-primary"
                  />
                </div>
              </div>

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
