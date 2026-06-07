import { useEffect, useRef, useState } from "react";
import { FileUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import DatePicker from "@/shared/components/DatePicker";
import { DISCOUNT_TYPE_OPTIONS, OFFER_PRODUCTS } from "../data";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { DiscountType, Offer, OfferFormData } from "../types";

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
  onSaveOffer: (offer: Offer) => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(
        editingOffer
          ? {
              productName: editingOffer.offerTitle,
              description: editingOffer.offerDescription,
              discountType: editingOffer.discountType,
              discountValue: String(editingOffer.offerPercentage),
              startDate: "",
              endDate: "",
              bannerImage: editingOffer.offerImage,
              productIds: [],
            }
          : INITIAL_FORM,
      );
      setErrors({});
      setIsDiscountOpen(false);
    }
  }, [isOpen, editingOffer]);

  const set = <K extends keyof OfferFormData>(
    key: K,
    value: OfferFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleProduct = (id: number) =>
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((p) => p !== id)
        : [...prev.productIds, id],
    }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) set("bannerImage", URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof OfferFormData, string>> = {};
    if (!form.productName.trim()) next.productName = "Product name is required";
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
    };
    onSaveOffer(offer);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-200"
      >
        {isDiscountOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {editingOffer ? t("Edit Offer") : t("Create New Offer")}
            </DialogTitle>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              {/* Left column */}
              <div className="flex flex-col gap-5">
                <div>
                  <InputField
                    data={{
                      id: "offer-name",
                      label: {
                        htmlFor: "offer-name",
                        labelText: t("Product Name"),
                      },
                      placeholder: t("e.g. Artisanal Sourdough"),
                      required: true,
                      inputProps: {
                        value: form.productName,
                        onChange: (e) => set("productName", e.target.value),
                      },
                    }}
                  />
                  {errors.productName && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.productName}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="offer-description"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    {t("Description")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <Textarea
                    id="offer-description"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder={t("Describe this offer...")}
                    className="min-h-20 rounded-xl border-[#E5E5E5] px-4.5 py-3 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0"
                  />
                  {errors.description && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-start">
                  <div className="flex flex-col">
                    <Label
                      htmlFor="discount-type"
                      className="mb-2.5 text-[16px] font-medium text-black"
                    >
                      {t("Discount Type")}<span className="text-[#C90000]">*</span>
                    </Label>
                    <DropdownSelect
                      options={DISCOUNT_TYPE_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
                      selected={form.discountType}
                      onSelect={(value) =>
                        set("discountType", value as DiscountType)
                      }
                      onOpenChange={setIsDiscountOpen}
                      align="start"
                      className="md:w-full"
                      contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                    />
                  </div>

                  <div>
                    <InputField
                      data={{
                        id: "discount-value",
                        label: {
                          htmlFor: "discount-value",
                          labelText:
                            form.discountType === "fixed"
                              ? t("Discount EGP")
                              : t("Discount %"),
                        },
                        placeholder: t("e.g. 20"),
                        required: true,
                        inputProps: {
                          type: "number",
                          min: "0",
                          value: form.discountValue,
                          onChange: (e) => set("discountValue", e.target.value),
                        },
                      }}
                    />
                    {errors.discountValue && (
                      <p className="mt-1 text-[13px] text-[#C90000]">
                        {errors.discountValue}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-start">
                  <div className="flex flex-col">
                    <Label className="mb-2.5 text-[16px] font-medium text-black">
                      {t("Start Date")}<span className="text-[#C90000]">*</span>
                    </Label>
                    <DatePicker
                      value={form.startDate}
                      onChange={(date) => set("startDate", date)}
                      placeholder="25/3/2026"
                      popoverPlacement="bottom-right"
                      withBackdrop
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-[13px] text-[#C90000]">
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <Label className="mb-2.5 text-[16px] font-medium text-black">
                      {t("End Date")}<span className="text-[#C90000]">*</span>
                    </Label>
                    <DatePicker
                      value={form.endDate}
                      onChange={(date) => set("endDate", date)}
                      placeholder="25/3/2026"
                      popoverPlacement="bottom-right"
                      minDate={form.startDate || undefined}
                      withBackdrop
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-[13px] text-[#C90000]">
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <Label className="mb-2.5 text-[16px] font-medium text-black">
                    {t("Banner image")}{" "}
                    <span className="text-[13px] font-normal text-[#8B8B8B]">
                      {t("(Optional)")}
                    </span>
                  </Label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-[12px] border-2 border-dashed border-[#624F1C] bg-[#F5F0EA4D] text-center"
                  >
                    {form.bannerImage ? (
                      <img
                        src={form.bannerImage}
                        alt="Banner preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      <>
                        <FileUp className="size-7 text-[#000000]" />
                        <span className="text-[14px] font-medium text-[#28293D]">
                          {t("Click to upload image")}
                        </span>
                        <span className="text-[12px] text-[#8B8B8B]">
                          {t("PNG, JPG up to 5MB")}
                        </span>
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

                <div className="flex flex-col">
                  <Label className="mb-2.5 text-[16px] font-medium text-black">
                    {t("Included Products")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <div className="overflow-hidden rounded-[12px] border border-[#CACBD4] bg-[#FAFAF7] pt-2.5">
                    <p className="relative px-4 pb-2.5 text-[12px] font-medium text-[#28293D] after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-[#E5E5E5]">
                      {t("Select products for this offer")}
                    </p>
                    <div className="max-h-44 overflow-y-auto space-y-2">
                      {OFFER_PRODUCTS.map((product) => {
                        const checked = form.productIds.includes(product.id);
                        const id = `offer-product-${product.id}`;
                        return (
                          <label
                            key={product.id}
                            htmlFor={id}
                            className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2"
                          >
                            <span className="flex items-center gap-1.5">
                              <div
                                className={`rounded-[10px] ${checked ? "bg-[#624F1C1A]" : ""}`}
                              >
                                <Checkbox
                                  id={id}
                                  checked={checked}
                                  onCheckedChange={() =>
                                    toggleProduct(product.id)
                                  }
                                  className="h-[19.98px] w-[19.98px] cursor-pointer rounded-[5.99px] border-[#8F6900]"
                                />
                              </div>
                              <span className="text-[14px] font-medium text-[#28293D]">
                                {product.name}
                              </span>
                            </span>
                            <span className="text-[13px] text-[#595959]">
                              EGP{" "}
                              <span className="font-semibold text-[#28293D]">
                                {product.price.toFixed(2)}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {t("Save offer")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOfferDialog;
