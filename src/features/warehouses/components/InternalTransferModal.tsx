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
import { TRANSFER_PRODUCT_OPTIONS } from "../data";
import type { TransferFormState, TransferLineItem, Warehouse } from "../types";

const FORM_ID = "transfer-form";

const newLineItem = (): TransferLineItem => ({
  id: `ti-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  productId: "",
  quantity: 0,
});

const INITIAL_FORM: TransferFormState = {
  fromId: "",
  toId: "",
  items: [newLineItem()],
};

const productOptions = TRANSFER_PRODUCT_OPTIONS.map((p) => ({
  value: p.id,
  label: p.label,
}));

interface InternalTransferModalProps {
  open: boolean;
  warehouses: Warehouse[];
  onOpenChange: (open: boolean) => void;
  onSave: (form: TransferFormState) => void;
}

const InternalTransferModal = ({
  open,
  warehouses,
  onOpenChange,
  onSave,
}: InternalTransferModalProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<TransferFormState>(INITIAL_FORM);
  const [openDropdown, setOpenDropdown] = useState<
    "source" | "destination" | "product" | null
  >(null);

  useEffect(() => {
    if (open) {
      setForm({ ...INITIAL_FORM, items: [newLineItem()] });
      setOpenDropdown(null);
    }
  }, [open]);

  const warehouseOptions = warehouses.map((w) => ({
    value: w.id,
    label: w.name,
  }));

  const setFrom = (fromId: string) => setForm((prev) => ({ ...prev, fromId }));
  const setTo = (toId: string) => setForm((prev) => ({ ...prev, toId }));

  const updateItem = <K extends keyof TransferLineItem>(
    id: string,
    key: K,
    value: TransferLineItem[K],
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-160"
      >
        {openDropdown && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Internal Transfer")}
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col">
                  <Label
                    htmlFor="source"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    {t("Source")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={warehouseOptions}
                    selected={form.fromId}
                    onSelect={setFrom}
                    onOpenChange={(o) => setOpenDropdown(o ? "source" : null)}
                    placeholder={t("Select source location")}
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="destination"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    {t("Destination")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={warehouseOptions}
                    selected={form.toId}
                    onSelect={setTo}
                    onOpenChange={(o) =>
                      setOpenDropdown(o ? "destination" : null)
                    }
                    placeholder={t("Select target location")}
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[15px] font-semibold text-[#28293D]">
                  <Box size={14} className="text-[#000000]" />
                  {t("Items to transfer")}
                </div>

                {form.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                  >
                    <div className="flex flex-col">
                      <Label className="mb-2.5 text-[16px] font-medium text-black">
                        {t("Product")}<span className="text-[#C90000]">*</span>
                      </Label>
                      <DropdownSelect
                        options={productOptions}
                        selected={item.productId}
                        onSelect={(value) =>
                          updateItem(item.id, "productId", value)
                        }
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

                    {form.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove item ${index + 1}`}
                        className="flex size-12 cursor-pointer items-center justify-center self-end rounded-full text-[#C90000] hover:bg-[#FFF0F0]"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addItem}
                  className="mx-auto inline-flex w-fit cursor-pointer items-center gap-2 rounded-[8px] px-3 py-2 text-[14px] font-semibold text-primary hover:bg-[#F5F0EA]"
                >
                  <Plus size={16} />
                  {t("Add Items")}
                </button>
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
                {t("Create Transfer")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternalTransferModal;
