import { useEffect, useState } from "react";
import { Package, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { getWarehouses } from "@/features/warehouses/api/warehousesApi";
import { getProducts } from "@/features/products/api/productsApi";
import type { InventoryAdjustmentSubmitData } from "./InventoryAdjustmentDialog";

const FORM_ID = "quantity-adjustment-form";

interface QuantityAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (data: InventoryAdjustmentSubmitData) => void;
}

interface CategoryRowItem {
  id: string;
  product: string;
  quantity: string;
  reason: string;
}

interface SimpleOption {
  value: string;
  label: string;
}

// Same shape as InventoryAdjustmentDialog, but the quantity here is signed
// (a recount correction can go either way) instead of always a deduction.
const QuantityAdjustmentDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: QuantityAdjustmentDialogProps) => {
  const { t } = useTranslation();
  const [warehouse, setWarehouse] = useState("");
  const [comments, setComments] = useState("");
  const [categories, setCategories] = useState<CategoryRowItem[]>([
    { id: "1", product: "", quantity: "", reason: "" },
  ]);
  const [isWarehouseOpen, setIsWarehouseOpen] = useState(false);
  const [activeOpenDropdown, setActiveOpenDropdown] = useState<string | null>(null);
  const [warehouseOptions, setWarehouseOptions] = useState<SimpleOption[]>([]);
  const [productOptions, setProductOptions] = useState<SimpleOption[]>([]);

  useEffect(() => {
    if (open) {
      setWarehouse("");
      setComments("");
      setCategories([{ id: "1", product: "", quantity: "", reason: "" }]);

      getWarehouses()
        .then((res) =>
          setWarehouseOptions(
            (res.warehouses || []).map((w) => ({ value: w._id, label: w.name })),
          ),
        )
        .catch(() => setWarehouseOptions([]));

      getProducts({ limit: 500 })
        .then((res) =>
          setProductOptions(
            (res.products || []).map((p: any) => ({ value: p._id, label: p.name })),
          ),
        )
        .catch(() => setProductOptions([]));
    }
  }, [open]);

  const handleAddCategoryRow = () => {
    setCategories((prev) => [
      ...prev,
      { id: String(Date.now()), product: "", quantity: "", reason: "" },
    ]);
  };

  const handleRemoveCategoryRow = (id: string) => {
    if (categories.length === 1) return;
    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateRow = (
    id: string,
    field: keyof CategoryRowItem,
    val: string
  ) => {
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouse) return;
    const items = categories
      .filter((c) => c.product && c.quantity)
      .map((c) => ({
        productId: c.product,
        quantity: Number(c.quantity) || 0,
        reason: c.reason,
      }));
    if (!items.length) return;

    onConfirm?.({ warehouseId: warehouse, items, comments });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-175"
      >
        {(isWarehouseOpen || activeOpenDropdown !== null) && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Quantity adjustment")}
            </DialogTitle>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col">
                  <Label className="mb-2.5 text-[16px] font-medium text-black">
                    {t("Type")}
                  </Label>
                  <Input
                    readOnly
                    value={t("Quantity Adjustment")}
                    className="h-12 rounded-[12px] border-[#E5E5E5] bg-white px-4 text-[16px] font-normal text-black focus-visible:ring-0"
                  />
                </div>

                <div className="flex flex-col">
                  <Label className="mb-2.5 text-[16px] font-medium text-black">
                    {t("Warehouse")}
                  </Label>
                  <DropdownSelect
                    options={warehouseOptions}
                    selected={warehouse}
                    onSelect={setWarehouse}
                    onOpenChange={setIsWarehouseOpen}
                    placeholder={t("--- Select a Warehouse ---")}
                    align="start"
                    className="w-full md:!w-full"
                    contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:!w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6 rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#333333]">
                    <Package className="size-4 text-black" />
                    <span className="text-[12px] font-semibold leading-6">
                      {t("Categories")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddCategoryRow}
                    className="inline-flex items-center gap-2 rounded-[5px] border border-[#8F6900] px-3 py-1.5 text-[12px] font-semibold text-[#8F6900] hover:bg-[#FDFBF7] transition-colors cursor-pointer"
                  >
                    <Plus className="size-4 text-[#8F6900]" />
                    <span>{t("Add Category")}</span>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {categories.map((row, idx) => (
                    <div
                      key={row.id}
                      className="relative grid grid-cols-1 gap-3 sm:grid-cols-3 pr-8 sm:pr-0"
                    >
                      <div className="flex flex-col">
                        {idx === 0 && (
                          <Label className="mb-2.5 text-[16px] font-medium text-black">
                            {t("Product")}
                          </Label>
                        )}
                        <DropdownSelect
                          options={productOptions}
                          selected={row.product}
                          onSelect={(val) => handleUpdateRow(row.id, "product", val)}
                          onOpenChange={(isOpen) =>
                            setActiveOpenDropdown(isOpen ? row.id : null)
                          }
                          placeholder={t("-Select Product-")}
                          align="start"
                          className="w-full md:!w-full"
                          contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:!w-[var(--radix-dropdown-menu-trigger-width)]"
                        />
                      </div>

                      <div className="flex flex-col">
                        {idx === 0 && (
                          <Label className="mb-2.5 text-[16px] font-medium text-black">
                            {t("Quantity")}
                          </Label>
                        )}
                        <Input
                          type="number"
                          value={row.quantity}
                          onChange={(e) =>
                            handleUpdateRow(row.id, "quantity", e.target.value)
                          }
                          placeholder={t("Quantity (+/-)")}
                          className="h-12 rounded-[12px] border-[#E5E5E5] bg-white px-4 text-[16px] font-normal placeholder:text-[#8B8B8B] focus-visible:ring-0"
                        />
                      </div>

                      <div className="flex flex-col">
                        {idx === 0 && (
                          <Label className="mb-2.5 text-[16px] font-medium text-black">
                            {t("Reason")}
                          </Label>
                        )}
                        <div className="flex items-center gap-2">
                          <Input
                            value={row.reason}
                            onChange={(e) =>
                              handleUpdateRow(row.id, "reason", e.target.value)
                            }
                            placeholder={t("Reason")}
                            className="h-12 rounded-[12px] border-[#E5E5E5] bg-white px-4 text-[16px] font-normal placeholder:text-[#8B8B8B] focus-visible:ring-0 flex-1"
                          />
                          {categories.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCategoryRow(row.id)}
                              title={t("Remove")}
                              className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <Label className="mb-2.5 text-[16px] font-medium text-black">
                  {t("Comments")}
                </Label>
                <Input
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={t("Comments")}
                  className="h-12 rounded-[12px] border-[#E5E5E5] bg-white px-4 text-[16px] font-normal placeholder:text-[#8B8B8B] focus-visible:ring-0"
                />
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
                {t("Confirm")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuantityAdjustmentDialog;
