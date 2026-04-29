import { useState } from "react";
import { Plus, Trash2, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DefaultButton from "@/shared/components/DefaultButton";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/lib/utils";
import {
  SUPPLIER_OPTIONS,
  WAREHOUSE_OPTIONS,
  PRODUCT_SKU_OPTIONS,
} from "../data";
import type { POFormData, LineItem } from "../types";

interface CreatePOModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: POFormData) => void;
}

const EMPTY_LINE_ITEM = (): LineItem => ({
  id: String(Date.now()),
  productSku: "",
  quantity: 0,
  unitCost: 0,
});

const INITIAL_FORM: POFormData = {
  supplierId: "",
  warehouse: "",
  expectedDeliveryDate: "",
  lineItems: [EMPTY_LINE_ITEM()],
};

const SelectField = ({
  label,
  required,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col gap-2">
    <Label className="text-[16px] font-medium text-[#000000]">
      {label}
      {required && <span className="ml-1 text-[#C90000]">*</span>}
    </Label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-12 w-full appearance-none rounded-[12px] border border-[#E5E5E5] bg-white px-3 pr-10",
          "text-[16px] outline-none focus:border-primary transition-colors",
          value ? "text-[#23252A]" : "text-[#8B8B8B]"
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]">
        ▾
      </span>
    </div>
  </div>
);

const CreatePOModal = ({ open, onClose, onSave }: CreatePOModalProps) => {
  const [form, setForm] = useState<POFormData>(INITIAL_FORM);

  const setField = <K extends keyof POFormData>(key: K, value: POFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateLineItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addLineItem = () =>
    setForm((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, EMPTY_LINE_ITEM()],
    }));

  const removeLineItem = (id: string) =>
    setForm((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }));

  const total = form.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0
  );

  const handleSave = () => {
    if (!form.supplierId || !form.warehouse) return;
    onSave(form);
    setForm(INITIAL_FORM);
    onClose();
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className="sm:max-w-174 rounded-[16px] p-8"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#28293D]">
            Create Purchase Order
          </DialogTitle>
        </DialogHeader>

        {/* Row 1: Supplier, Warehouse, Date */}
        <div className="grid grid-cols-3 gap-4">
          <SelectField
            label="Select Supplier"
            required
            value={form.supplierId}
            placeholder="Select Supplier"
            options={SUPPLIER_OPTIONS.map((s) => s.name)}
            onChange={(v) => setField("supplierId", v)}
          />
          <SelectField
            label="Receiving Warehouse"
            required
            value={form.warehouse}
            placeholder="Receiving Warehouse"
            options={WAREHOUSE_OPTIONS}
            onChange={(v) => setField("warehouse", v)}
          />
          <div className="flex flex-col gap-2">
            <Label className="text-[16px] font-medium text-[#000000]">
              Expected Delivery Date <span className="text-[#C90000]">*</span>
            </Label>
            <input
              type="date"
              value={form.expectedDeliveryDate}
              onChange={(e) => setField("expectedDeliveryDate", e.target.value)}
              placeholder="DD/MM/YYYY"
              className={cn(
                "h-12 rounded-[12px] border border-[#E5E5E5] bg-white px-3",
                "text-[16px] text-[#23252A] outline-none focus:border-primary transition-colors"
              )}
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Package size={15} className="text-[#6B6B6B]" />
            <span className="text-[14px] font-semibold text-[#28293D]">
              Line Items
            </span>
          </div>

          {form.lineItems.map((item, idx) => {
            const subtotal = item.quantity * item.unitCost;
            return (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_120px_160px_auto_auto] gap-3 items-end"
              >
                {/* Product SKU */}
                <div className="flex flex-col gap-2">
                  {idx === 0 && (
                    <Label className="text-[16px] font-medium text-[#000000]">
                      Product <span className="text-[#C90000]">*</span>
                    </Label>
                  )}
                  <div className="relative">
                    <select
                      value={item.productSku}
                      onChange={(e) =>
                        updateLineItem(item.id, "productSku", e.target.value)
                      }
                      className={cn(
                        "h-12 w-full appearance-none rounded-[12px] border border-[#E5E5E5] bg-white px-3 pr-8",
                        "text-[15px] outline-none focus:border-primary transition-colors",
                        item.productSku ? "text-[#23252A]" : "text-[#8B8B8B]"
                      )}
                    >
                      <option value="" disabled>
                        Select SKU
                      </option>
                      {PRODUCT_SKU_OPTIONS.map((sku) => (
                        <option key={sku} value={sku}>
                          {sku}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#6B6B6B] text-sm">
                      ▾
                    </span>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-2">
                  {idx === 0 && (
                    <Label className="text-[16px] font-medium text-[#000000]">
                      Quantity <span className="text-[#C90000]">*</span>
                    </Label>
                  )}
                  <input
                    type="number"
                    min={0}
                    value={item.quantity || ""}
                    placeholder="0"
                    onChange={(e) =>
                      updateLineItem(
                        item.id,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                    className="h-12 rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[15px] text-[#23252A] outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Unit Cost */}
                <div className="flex flex-col gap-2">
                  {idx === 0 && (
                    <Label className="text-[16px] font-medium text-[#000000]">
                      Unit Cost <span className="text-[#C90000]">*</span>
                    </Label>
                  )}
                  <input
                    type="number"
                    min={0}
                    value={item.unitCost || ""}
                    placeholder="0"
                    onChange={(e) =>
                      updateLineItem(
                        item.id,
                        "unitCost",
                        Number(e.target.value)
                      )
                    }
                    className="h-12 rounded-[12px] border border-[#E5E5E5] bg-white px-3 text-[15px] text-[#23252A] outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Subtotal */}
                <div className="flex flex-col gap-2">
                  {idx === 0 && (
                    <Label className="text-[12px] font-medium text-[#6B6B6B]">
                      Subtotal
                    </Label>
                  )}
                  <div className="flex h-12 items-center text-[14px] font-semibold text-[#28293D]">
                    EGP {subtotal}
                  </div>
                </div>

                {/* Remove */}
                <div className={idx === 0 ? "pt-7" : ""}>
                  {form.lineItems.length > 1 && (
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-[8px] text-[#C90000] hover:bg-[#FFF0F0] transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Items */}
          <button
            onClick={addLineItem}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#5C4A0E] hover:text-[#4A3A08] transition-colors cursor-pointer w-fit mx-auto"
          >
            <Plus size={15} />
            Add Items
          </button>
        </div>

        <hr className="border-[#E5E5E5]" />

        {/* Total */}
        <div className="text-right">
          <p className="text-[12px] text-[#6B6B6B]">Total</p>
          <p className="text-[22px] font-bold text-[#28293D]">EGP {total}</p>
        </div>

        <hr className="border-[#E5E5E5]" />

        <div className="flex justify-end gap-3">
          <DefaultButton
            data={{
              buttonText: "Cancel",
              variant: "outline",
              className:
                "border-primary text-primary hover:bg-white hover:text-primary",
              onClick: handleClose,
            }}
          />
          <DefaultButton
            data={{
              buttonText: "Save Supplier",
              className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
              onClick: handleSave,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePOModal;
