import { useEffect, useState } from "react";
import { Box, Plus, X } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import DatePicker from "@/shared/components/DatePicker";
import { PRODUCT_OPTIONS, SUPPLIER_OPTIONS, WAREHOUSE_OPTIONS } from "../data";
import type { PoFormState, PoLineItem } from "../types";

const FORM_ID = "create-po-form";

const newLineItem = (): PoLineItem => ({
  id: `li-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  productId: "",
  quantity: 0,
  unitCost: 0,
});

const INITIAL_FORM: PoFormState = {
  supplierId: "",
  warehouseId: "",
  expectedDeliveryDate: "",
  items: [newLineItem()],
};

const supplierOptions = SUPPLIER_OPTIONS.map((s) => ({
  value: s.id,
  label: s.label,
}));

const warehouseOptions = WAREHOUSE_OPTIONS.map((w) => ({
  value: w.id,
  label: w.label,
}));

const productOptions = PRODUCT_OPTIONS.map((p) => ({
  value: p.id,
  label: p.label,
}));

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

interface CreatePoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (form: PoFormState) => void;
}

const CreatePoDialog = ({
  open,
  onOpenChange,
  onSave,
}: CreatePoDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<PoFormState>(INITIAL_FORM);
  const [openDropdown, setOpenDropdown] = useState<
    "supplier" | "warehouse" | "product" | null
  >(null);

  useEffect(() => {
    if (open) {
      setForm({ ...INITIAL_FORM, items: [newLineItem()] });
      setOpenDropdown(null);
    }
  }, [open]);

  const setSupplier = (supplierId: string) =>
    setForm((prev) => ({ ...prev, supplierId }));
  const setWarehouse = (warehouseId: string) =>
    setForm((prev) => ({ ...prev, warehouseId }));
  const setDate = (expectedDeliveryDate: string) =>
    setForm((prev) => ({ ...prev, expectedDeliveryDate }));

  const updateItem = <K extends keyof PoLineItem>(
    id: string,
    key: K,
    value: PoLineItem[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    }));
  };

  const addItem = () =>
    setForm((prev) => ({ ...prev, items: [...prev.items, newLineItem()] }));

  const removeItem = (id: string) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));

  const total = form.items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-180"
      >
        {/* Scrim while any dropdown inside is open */}
        {openDropdown && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Create Purchase Order")}
            </DialogTitle>
          </div>

          {/* Scrollable body */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-6">
              {/* Top row: supplier, warehouse, date */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="flex flex-col">
                  <Label
                    htmlFor="select-supplier"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    {t("Select Supplier")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={supplierOptions}
                    selected={form.supplierId}
                    onSelect={setSupplier}
                    onOpenChange={(o) => setOpenDropdown(o ? "supplier" : null)}
                    placeholder={t("Select Supplier")}
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="select-warehouse"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    {t("Receiving Warehouse")}
                    <span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={warehouseOptions}
                    selected={form.warehouseId}
                    onSelect={setWarehouse}
                    onOpenChange={(o) =>
                      setOpenDropdown(o ? "warehouse" : null)
                    }
                    placeholder={t("Receiving Warehouse")}
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>

                <div className="flex flex-col">
                  <Label className="mb-2.5 text-[16px] font-medium text-black">
                    {t("Expected Delivery Date")}
                    <span className="text-[#C90000]">*</span>
                  </Label>
                  <DatePicker
                    value={form.expectedDeliveryDate}
                    onChange={setDate}
                    placeholder={t("DD/MM/YYYY")}
                    withBackdrop
                    minDate={new Date().toISOString().slice(0, 10)}
                  />
                </div>
              </div>

              {/* Line Items section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-[#28293D]">
                  <Box size={14} className="text-[#000000]" />
                  {t("Line Items")}
                </div>

                {form.items.map((item, index) => {
                  const subtotal = item.quantity * item.unitCost;
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
                    >
                      <div className="flex flex-col">
                        <Label className="mb-2.5 text-[16px] font-medium text-black">
                          {t("Product")}<span className="text-[#C90000]">*</span>
                        </Label>
                        <DropdownSelect
                          options={productOptions}
                          selected={item.productId}
                          onSelect={(value) => {
                            updateItem(item.id, "productId", value);
                            const product = PRODUCT_OPTIONS.find(
                              (p) => p.id === value,
                            );
                            if (product && item.unitCost === 0) {
                              updateItem(
                                item.id,
                                "unitCost",
                                product.defaultCost,
                              );
                            }
                          }}
                          onOpenChange={(o) =>
                            setOpenDropdown(o ? "product" : null)
                          }
                          placeholder={t("Select SKU")}
                          align="start"
                          className="md:w-full"
                          contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                        />
                      </div>

                      <InputField
                        data={{
                          id: `qty-${item.id}`,
                          label: {
                            htmlFor: `qty-${item.id}`,
                            labelText: t("Quantity"),
                          },
                          placeholder: "0",
                          required: true,
                          inputProps: {
                            type: "number",
                            min: "0",
                            value: item.quantity || "",
                            onChange: (e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                Number(e.target.value) || 0,
                              ),
                          },
                        }}
                      />

                      <InputField
                        data={{
                          id: `cost-${item.id}`,
                          label: {
                            htmlFor: `cost-${item.id}`,
                            labelText: t("Unit Cost"),
                          },
                          placeholder: "0",
                          required: true,
                          inputProps: {
                            type: "number",
                            min: "0",
                            step: "0.01",
                            value: item.unitCost || "",
                            onChange: (e) =>
                              updateItem(
                                item.id,
                                "unitCost",
                                Number(e.target.value) || 0,
                              ),
                          },
                        }}
                      />

                      <div className="flex items-end gap-2 md:flex-col md:items-end md:gap-1">
                        <div className="flex-1 text-left md:text-right">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                            {t("Subtotal")}
                          </p>
                          <p className="text-[14px] font-semibold text-[#28293D]">
                            {formatEgp(subtotal)}
                          </p>
                        </div>
                        {form.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove line item ${index + 1}`}
                            className="flex size-9 cursor-pointer items-center justify-center rounded-full text-[#C90000] hover:bg-[#FFF0F0]"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex w-fit cursor-pointer items-center gap-2 self-center rounded-[8px] px-3 py-2 text-[14px] font-semibold text-primary hover:bg-[#F5F0EA]"
                >
                  <Plus size={16} />
                  {t("Add Items")}
                </button>
              </div>

              {/* Total */}
              <div>
                <Separator className="bg-[#CACBD4]" />
                <div className="mt-3 flex items-center justify-end gap-6">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                    {t("Total")}
                  </p>
                  <p className="text-[20px] font-semibold text-[#28293D]">
                    {formatEgp(total)}
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Sticky footer */}
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
                {t("Save PO")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePoDialog;
