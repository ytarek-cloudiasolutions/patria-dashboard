import { ChevronDown, Eye, Loader2, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Checkbox } from "@/shared/components/ui/checkbox";
import type { Category, Product } from "../types";
import { getProducts } from "../api/productsApi";
import { mapProducts } from "../utils/productMappers";

interface BulkAvailabilityDialogProps {
  open: boolean;
  mode?: "products" | "recipes" | "categories";
  products: Product[];
  categories?: Category[];
  selectedIds: string[];
  saving?: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectedIdsChange: (ids: string[]) => void;
  onSave: (visibility: { showInApp: boolean; showInPos: boolean }) => void;
}

const BulkAvailabilityDialog = ({
  open,
  mode = "products",
  products,
  categories = [],
  selectedIds,
  saving = false,
  onOpenChange,
  onSelectedIdsChange,
  onSave,
}: BulkAvailabilityDialogProps) => {
  const isCategories = mode === "categories";
  const [showInApp, setShowInApp] = useState(true);
  const [showInPos, setShowInPos] = useState(true);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSelectedIds, setPickerSelectedIds] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [pickerProducts, setPickerProducts] = useState<Product[]>(products);
  const [isSearching, setIsSearching] = useState(false);
  const knownProducts = isCategories
    ? categories.map((category) => ({
        id: category.id,
        name: category.name,
        nameAr: category.nameAr,
        description: "",
        descriptionAr: "",
        category: category.name,
        imageUrl: category.imageUrl,
        price: 0,
        available: category.active,
        isActive: category.active,
      } as unknown as Product))
    : [...products, ...pickerProducts].filter(
        (product, index, list) => list.findIndex((item) => item.id === product.id) === index,
      );
  const selectedProducts = knownProducts.filter((product) => selectedIds.includes(product.id));

  const removeProduct = (id: string) =>
    onSelectedIdsChange(selectedIds.filter((selectedId) => selectedId !== id));

  const toggleProduct = (id: string, checked: boolean) => {
    setPickerSelectedIds(
      checked
        ? [...new Set([...pickerSelectedIds, id])]
        : pickerSelectedIds.filter((selectedId) => selectedId !== id),
    );
  };

  const openPicker = () => {
    setPickerSelectedIds(selectedIds);
    setProductSearch("");
    if (!isCategories) {
      setPickerProducts(products);
    }
    setIsPickerOpen(true);
  };

  useEffect(() => {
    if (!isPickerOpen || !productSearch.trim()) return;
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await getProducts({ search: productSearch.trim(), limit: 100 });
        setPickerProducts(mapProducts(response.products || []));
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [isPickerOpen, productSearch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="flex max-h-[calc(100vh-2rem)] max-w-[696px] flex-col gap-0 overflow-hidden rounded-xl bg-white p-0 sm:max-w-[696px]">
        <div className="min-h-0 overflow-y-auto px-6 pb-6 pt-6">
        <h2 className="text-2xl font-semibold tracking-wide text-black">
          {selectedProducts.length} Selected {isCategories ? "Categories" : "Products"}
        </h2>

        <section className="mt-6 rounded-2xl border border-[#D4D5DD] bg-[#FEFEFC] px-6 py-4">
          <div className="mb-4 flex items-center gap-1 text-xs font-semibold text-black">
            <Eye className="size-4" /> Visibility for all selected {isCategories ? "categories" : "products"}
          </div>
          <div className="flex items-center gap-5">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#404047]">
              <span className={`rounded-[10px] p-1 ${showInApp ? "bg-[#624F1C1A]" : ""}`}><Checkbox checked={showInApp} onCheckedChange={(checked) => setShowInApp(checked === true)} className="size-5 cursor-pointer rounded-[5.994px] border-[#8F6900] shadow-[0_1.998px_3.996px_0_rgba(27,28,29,0.04)]" /></span>
              Application
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#404047]">
              <span className={`rounded-[10px] p-1 ${showInPos ? "bg-[#624F1C1A]" : ""}`}><Checkbox checked={showInPos} onCheckedChange={(checked) => setShowInPos(checked === true)} className="size-5 cursor-pointer rounded-[5.994px] border-[#8F6900] shadow-[0_1.998px_3.996px_0_rgba(27,28,29,0.04)]" /></span>
              POS
            </label>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[#D4D5DD] bg-[#FEFEFC] px-6 py-4">
          <div className="rounded-2xl border border-dashed border-[#8F6900] bg-[#FAFAF7] px-3">
            {selectedProducts.length === 0 ? (
              <p className="py-5 text-sm text-[#8B8B8B]">No {isCategories ? "categories" : "products"} selected</p>
            ) : selectedProducts.map((product, index) => (
              <div key={product.id} className={`flex items-center justify-between gap-3 py-3 ${index ? "border-t border-[#D4D5DD]" : ""}`}>
                <div className="flex min-w-0 items-center gap-2">
                  <img src={product.imageUrl} alt="" className="size-7 rounded object-cover" />
                  <span className="truncate text-xs font-medium text-black">{product.name}</span>
                </div>
                <button type="button" onClick={() => removeProduct(product.id)} disabled={saving} aria-label={`Remove ${product.name}`} className="cursor-pointer text-[#E02020] disabled:opacity-50">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs font-medium text-black">Add extra {isCategories ? "categories" : "products"}</p>
          <button type="button" onClick={openPicker} className="mt-2 flex h-12 w-full items-center justify-between rounded-xl border border-[#D4D5DD] bg-white px-3 text-left text-base text-[#8B8B8B]">
            -- Select {isCategories ? "Category" : "Product"} --
            <ChevronDown className="size-6 shrink-0 stroke-[1.25] text-black" aria-hidden="true" />
          </button>
        </section>
        </div>

        <div className="sticky bottom-0 shrink-0 bg-white px-6 pb-6">
          <hr className="mb-6 border-[#CACBD4]" />
          <div className="flex justify-end gap-4">
            <button type="button" disabled={saving} onClick={() => onOpenChange(false)} className="h-14 rounded-[5px] border border-primary px-7 text-base font-semibold text-primary disabled:opacity-50">Cancel</button>
            <button type="button" disabled={saving || selectedProducts.length === 0} onClick={() => onSave({ showInApp, showInPos })} className="flex h-14 min-w-44 items-center justify-center rounded-[5px] bg-primary px-7 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? <Loader2 className="size-5 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </div>
      </DialogContent>

      <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <DialogContent showCloseButton={false} className="flex max-h-[calc(100vh-2rem)] max-w-[580px] flex-col gap-0 overflow-hidden rounded-2xl bg-white p-0 sm:max-w-[580px]">
          <div className="min-h-0 overflow-y-auto px-2 pb-3 pt-3">
            <div className="relative mx-3 mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B8B]" />
              <input value={productSearch} onChange={(event) => { const value = event.target.value; setProductSearch(value); if (!value.trim() && !isCategories) setPickerProducts(products); }} placeholder={isCategories ? "Search categories..." : "Search products..."} className="h-11 w-full rounded-xl border border-[#D4D5DD] bg-white pl-10 pr-3 text-sm outline-none focus:border-[#8F6900]" autoFocus />
            </div>
            <div className="flex flex-col gap-0">
              {isSearching && !isCategories ? (
                <div className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-primary" /></div>
              ) : isCategories ? (
                categories
                  .filter((category) => {
                    const q = productSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      category.name.toLowerCase().includes(q) ||
                      (category.nameAr || "").toLowerCase().includes(q)
                    );
                  })
                  .map((category) => {
                    const checked = pickerSelectedIds.includes(category.id);
                    return (
                      <div key={category.id} className="border-b border-[#D4D5DD] px-3 py-1.5">
                        <label className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 ${checked ? "bg-[#F5F0EA]" : ""}`}>
                          <span className={`rounded-[10px] p-1 ${checked ? "bg-[#624F1C1A]" : ""}`}><Checkbox checked={checked} onCheckedChange={(value) => toggleProduct(category.id, value === true)} className="size-5 cursor-pointer rounded-[5.994px] border-[#8F6900] shadow-[0_1.998px_3.996px_0_rgba(27,28,29,0.04)]" /></span>
                          <img src={category.imageUrl} alt="" className="size-7 rounded object-cover" />
                          <span className="text-xs font-medium tracking-tight text-black">{category.name}</span>
                        </label>
                      </div>
                    );
                  })
              ) : (
                pickerProducts.map((product) => {
                  const checked = pickerSelectedIds.includes(product.id);
                  return (
                    <div key={product.id} className="border-b border-[#D4D5DD] px-3 py-1.5">
                      <label className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 ${checked ? "bg-[#F5F0EA]" : ""}`}>
                        <span className={`rounded-[10px] p-1 ${checked ? "bg-[#624F1C1A]" : ""}`}><Checkbox checked={checked} onCheckedChange={(value) => toggleProduct(product.id, value === true)} className="size-5 cursor-pointer rounded-[5.994px] border-[#8F6900] shadow-[0_1.998px_3.996px_0_rgba(27,28,29,0.04)]" /></span>
                        <img src={product.imageUrl} alt="" className="size-7 rounded object-cover" />
                        <span className="text-xs font-medium tracking-tight text-black">{product.name}</span>
                      </label>
                    </div>
                  );
                })
              )}
              {!isSearching && !isCategories && pickerProducts.length === 0 && <p className="px-4 py-8 text-center text-sm text-[#8B8B8B]">No products found</p>}
              {isCategories && productSearch.trim() && categories.filter((category) => {
                const q = productSearch.trim().toLowerCase();
                return category.name.toLowerCase().includes(q) || (category.nameAr || "").toLowerCase().includes(q);
              }).length === 0 && <p className="px-4 py-8 text-center text-sm text-[#8B8B8B]">No categories found</p>}
            </div>
          </div>
          <div className="sticky bottom-0 shrink-0 bg-white px-6 pb-4">
            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => setIsPickerOpen(false)} className="h-14 rounded-[5px] border border-primary px-7 text-base font-semibold text-primary">Cancel</button>
              <button type="button" onClick={() => { onSelectedIdsChange(pickerSelectedIds); setIsPickerOpen(false); }} className="h-14 rounded-[5px] bg-primary px-7 text-base font-semibold text-white">Add {isCategories ? "Categories" : "Products"}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default BulkAvailabilityDialog;
