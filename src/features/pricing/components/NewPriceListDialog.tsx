import { useEffect, useMemo, useState } from "react";
import { Check, Plus, Search, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { CUSTOMER_CATEGORY_OPTIONS, PRICE_LIST_PRODUCTS } from "../data";
import type { PriceListFormData, PriceListProduct } from "../types";

const FORM_ID = "new-price-list-form";

interface NewPriceListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: PriceListFormData) => void;
}

const NewPriceListDialog = ({
  open,
  onOpenChange,
  onSave,
}: NewPriceListDialogProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Wholesale");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<PriceListProduct[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setCategory("Wholesale");
      setIsCategoryOpen(false);
      setSearch("");
      setAdded([]);
      setError("");
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PRICE_LIST_PRODUCTS;
    return PRICE_LIST_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q),
    );
  }, [search]);

  const isAdded = (id: string) => added.some((p) => p.id === id);

  const toggleProduct = (product: PriceListProduct) =>
    setAdded((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, { ...product, price: 0 }],
    );

  const setPrice = (id: string, price: number) =>
    setAdded((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price } : p)),
    );

  const removeProduct = (id: string) =>
    setAdded((prev) => prev.filter((p) => p.id !== id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("Listing name is required"));
      return;
    }
    onSave({ name: name.trim(), customerSegment: category, products: added });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-190"
      >
        {isCategoryOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] min-w-0 flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-bold text-[#28293D] sm:text-[22px]">
              {t("New price list")}
            </DialogTitle>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Listing name */}
              <div className="flex flex-col">
                <Label className="mb-2 text-[15px] font-semibold text-[#28293D]">
                  {t("Listing Name")}<span className="text-[#C90000]">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder={t("e.g. Cafes")}
                  className="h-12 rounded-[8px] border-[#E5E5E5] px-4 text-[14px] focus-visible:border-primary focus-visible:ring-0"
                />
                {error && (
                  <p className="mt-1 text-[13px] text-[#C90000]">{error}</p>
                )}
              </div>

              {/* Customer category */}
              <div className="flex flex-col">
                <Label className="mb-2 text-[15px] font-semibold text-[#28293D]">
                  {t("Customer Category")}<span className="text-[#C90000]">*</span>
                </Label>
                <DropdownSelect
                  options={CUSTOMER_CATEGORY_OPTIONS.map((o) => ({
                    ...o,
                    label: t(o.label),
                  }))}
                  selected={category}
                  onSelect={setCategory}
                  onOpenChange={setIsCategoryOpen}
                  align="start"
                  className="md:w-full"
                  contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                />
              </div>

              {/* Product picker */}
              <div className="flex flex-col">
                <div className="relative mb-3">
                  <Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-[#8B8B8B]" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("Search for a product...")}
                    className="h-11 w-full rounded-[8px] border border-[#E5E5E5] bg-white ps-9 pe-3 text-[13px] text-[#28293D] outline-none placeholder:text-[#8B8B8B] focus:border-primary/50"
                  />
                </div>
                <div className="max-h-56 space-y-1.5 overflow-y-auto rounded-[10px] border border-[#E5E5E5] p-2">
                  {filtered.map((product) => {
                    const selected = isAdded(product.id);
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => toggleProduct(product)}
                        className={cn(
                          "flex w-full cursor-pointer items-center justify-between rounded-[8px] border px-3 py-2.5 text-[13px] transition-colors",
                          selected
                            ? "border-[#059B5A] bg-[#E9F8F1] text-[#059B5A]"
                            : "border-transparent text-[#28293D] hover:bg-[#FAFAF7]",
                        )}
                      >
                        {product.name}
                        {selected ? (
                          <Check className="size-4" />
                        ) : (
                          <Plus className="size-4 text-[#8B8B8B]" />
                        )}
                      </button>
                    );
                  })}
                  {filtered.length === 0 && (
                    <p className="py-4 text-center text-[13px] text-[#8B8B8B]">
                      {t("No products found.")}
                    </p>
                  )}
                </div>
              </div>

              {/* Added products */}
              <div className="rounded-[12px] border border-[#E5E5E5] bg-[#FAFAF7] p-3">
                <p className="mb-2 text-[13px] font-semibold text-[#28293D]">
                  {t("Added Products")} ({added.length})
                </p>
                <div className="max-h-56 space-y-2 overflow-y-auto">
                  {added.length === 0 ? (
                    <p className="py-6 text-center text-[13px] text-[#8B8B8B]">
                      {t("No products added yet.")}
                    </p>
                  ) : (
                    added.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-2 rounded-[8px] border border-[#EDEBE7] bg-white px-3 py-2"
                      >
                        <span className="flex-1 truncate text-[13px] font-medium text-[#28293D]">
                          {product.name}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={product.price || ""}
                          onChange={(e) =>
                            setPrice(product.id, Number(e.target.value) || 0)
                          }
                          placeholder="0.00"
                          className="h-9 w-24 rounded-[8px] border-[#E5E5E5] px-2 text-center text-[13px] focus-visible:border-primary focus-visible:ring-0"
                        />
                        <span className="text-[12px] font-medium text-[#8B8B8B]">
                          EGP
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          aria-label={`Remove ${product.name}`}
                          className="cursor-pointer text-[#C90000]"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))
                  )}
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
                {t("Create List")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewPriceListDialog;
