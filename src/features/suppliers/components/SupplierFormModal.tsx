import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import InputField from "@/shared/components/InputField";
import DefaultButton from "@/shared/components/DefaultButton";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/lib/utils";
import type { Supplier, SupplierFormData } from "../types";

interface SupplierFormModalProps {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onSave: (data: SupplierFormData, id?: number) => void;
}

const INITIAL_FORM: SupplierFormData = {
  supplierName: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
  categories: "",
};

const SupplierFormModal = ({
  open,
  supplier,
  onClose,
  onSave,
}: SupplierFormModalProps) => {
  const [form, setForm] = useState<SupplierFormData>(INITIAL_FORM);

  useEffect(() => {
    if (supplier) {
      setForm({
        supplierName: supplier.name,
        contactName: supplier.contactPerson,
        phone: supplier.phone,
        email: supplier.email,
        address: supplier.address,
        categories: supplier.categories.join(", "),
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [supplier, open]);

  const set = (key: keyof SupplierFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.supplierName.trim() || !form.contactName.trim()) return;
    onSave(form, supplier?.id);
    onClose();
  };

  const isEditing = !!supplier;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="sm:max-w-174 rounded-[16px] p-8"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#28293D]">
            {isEditing ? "Edit Supplier" : "Add New Supplier"}
          </DialogTitle>
        </DialogHeader>

        {/* Row 1: Supplier Name + Contact Name */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            data={{
              id: "supplier-name",
              label: { htmlFor: "supplier-name", labelText: "Supplier Name" },
              placeholder: "e.g. Bean's supplier",
              required: true,
              inputProps: {
                value: form.supplierName,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("supplierName", e.target.value),
              },
            }}
          />
          <InputField
            data={{
              id: "contact-name",
              label: { htmlFor: "contact-name", labelText: "Name" },
              placeholder: "Full Name",
              required: true,
              inputProps: {
                value: form.contactName,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("contactName", e.target.value),
              },
            }}
          />
        </div>

        {/* Row 2: Phone + Email */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            data={{
              id: "phone",
              label: { htmlFor: "phone", labelText: "Phone Number" },
              type: "tel",
              placeholder: "+20...",
              required: true,
              inputProps: {
                value: form.phone,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("phone", e.target.value),
              },
            }}
          />
          <InputField
            data={{
              id: "email",
              label: { htmlFor: "email", labelText: "Email Address" },
              type: "email",
              placeholder: "vendor@global.com",
              required: true,
              inputProps: {
                value: form.email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  set("email", e.target.value),
              },
            }}
          />
        </div>

        {/* Address — full width textarea */}
        <div className="flex flex-col gap-2">
          <Label className="text-[16px] font-medium text-[#000000]">
            Address <span className="text-[#C90000]">*</span>
          </Label>
          <textarea
            placeholder="Street, Sector, Territory..."
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            rows={3}
            className={cn(
              "w-full resize-none rounded-[12px] border border-[#E5E5E5] bg-white p-3",
              "text-[16px] text-[#23252A] placeholder:text-[#8B8B8B]",
              "outline-none focus:border-primary transition-colors"
            )}
          />
        </div>

        {/* Categories — full width */}
        <InputField
          data={{
            id: "categories",
            label: {
              htmlFor: "categories",
              labelText: "Categories (Comma Separated)",
            },
            placeholder: "E.G. ARABICA, COFFEE",
            inputProps: {
              value: form.categories,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                set("categories", e.target.value),
            },
          }}
        />

        <hr className="border-[#E5E5E5]" />

        <div className="flex justify-end gap-3">
          <DefaultButton
            data={{
              buttonText: "Cancel",
              variant: "outline",
              className:
                "border-primary text-primary hover:bg-white hover:text-primary",
              onClick: onClose,
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

export default SupplierFormModal;
