import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/lib/utils";
import InputField from "@/shared/components/InputField";
import DefaultButton from "@/shared/components/DefaultButton";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Supplier, SupplierFormData } from "../types";

const FORM_ID = "supplier-form";

const INITIAL_FORM: SupplierFormData = {
  supplierName: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
  categories: "",
};

interface SupplierFormModalProps {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onSave: (data: SupplierFormData, id?: number) => void;
}

const SupplierFormModal = ({
  open,
  supplier,
  onClose,
  onSave,
}: SupplierFormModalProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<SupplierFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SupplierFormData, string>>
  >({});

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
    setErrors({});
  }, [supplier, open]);

  const set = <K extends keyof SupplierFormData>(
    key: K,
    value: SupplierFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof SupplierFormData, string>> = {};
    if (!form.supplierName.trim())
      next.supplierName = t("Supplier name is required");
    if (!form.contactName.trim()) next.contactName = t("Name is required");
    if (!form.phone.trim()) next.phone = t("Phone number is required");
    if (!form.email.trim()) {
      next.email = t("Email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = t("Enter a valid email");
    }
    if (!form.address.trim()) next.address = t("Address is required");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, supplier?.id);
    onClose();
  };

  const isEditing = !!supplier;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-160"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {isEditing ? t("Edit Supplier") : t("Add New Supplier")}
            </DialogTitle>
          </div>

          {/* Scrollable body */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-5">
              {/* Row 1: Supplier Name + Contact Name */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <InputField
                    data={{
                      id: "supplier-name",
                      label: {
                        htmlFor: "supplier-name",
                        labelText: t("Supplier Name"),
                      },
                      placeholder: t("e.g. Bean's supplier"),
                      required: true,
                      inputProps: {
                        value: form.supplierName,
                        onChange: (e) => set("supplierName", e.target.value),
                      },
                    }}
                  />
                  {errors.supplierName && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.supplierName}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    data={{
                      id: "contact-name",
                      label: { htmlFor: "contact-name", labelText: t("Name") },
                      placeholder: t("Full Name"),
                      required: true,
                      inputProps: {
                        value: form.contactName,
                        onChange: (e) => set("contactName", e.target.value),
                      },
                    }}
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.contactName}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone + Email */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <InputField
                    data={{
                      id: "phone",
                      label: {
                        htmlFor: "phone",
                        labelText: t("Phone Number"),
                      },
                      type: "tel",
                      placeholder: "+20...",
                      required: true,
                      inputProps: {
                        value: form.phone,
                        onChange: (e) => set("phone", e.target.value),
                      },
                    }}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    data={{
                      id: "email",
                      label: {
                        htmlFor: "email",
                        labelText: t("Email Address"),
                      },
                      type: "email",
                      placeholder: t("vendor@global.com"),
                      required: true,
                      inputProps: {
                        value: form.email,
                        onChange: (e) => set("email", e.target.value),
                      },
                    }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Address (textarea) */}
              <div className="flex flex-col">
                <Label
                  htmlFor="address"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Address")}<span className="text-[#C90000]">*</span>
                </Label>
                <Textarea
                  id="address"
                  rows={3}
                  placeholder={t("Street, Sector, Territory...")}
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  className={cn(
                    "field-sizing-fixed resize-none rounded-xl border border-[#E5E5E5] bg-white px-4.5 py-3 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0",
                    errors.address && "border-[#C90000]",
                  )}
                />
                {errors.address && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Categories */}
              <InputField
                data={{
                  id: "categories",
                  label: {
                    htmlFor: "categories",
                    labelText: t("Categories (Comma Separated)"),
                  },
                  placeholder: t("E.G. ARABICA, COFFEE"),
                  inputProps: {
                    value: form.categories,
                    onChange: (e) => set("categories", e.target.value),
                  },
                }}
                wrapperClassName="relative"
              />
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
                  onClick: onClose,
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {isEditing ? t("Update Supplier") : t("Save Supplier")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierFormModal;
