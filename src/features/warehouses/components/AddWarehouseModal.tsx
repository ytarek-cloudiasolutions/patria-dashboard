import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import { cn } from "@/lib/utils";
import { WAREHOUSE_TYPE_OPTIONS } from "../data";
import type { WarehouseFormData, WarehouseKind } from "../types";

const FORM_ID = "warehouse-form";

const INITIAL_FORM: WarehouseFormData = {
  name: "",
  kind: "Sub Warehouse",
  address: "",
};

interface AddWarehouseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: WarehouseFormData) => void;
}

const AddWarehouseModal = ({
  open,
  onOpenChange,
  onSave,
}: AddWarehouseModalProps) => {
  const [form, setForm] = useState<WarehouseFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof WarehouseFormData, string>>
  >({});
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setErrors({});
      setIsTypeOpen(false);
    }
  }, [open]);

  const set = <K extends keyof WarehouseFormData>(
    key: K,
    value: WarehouseFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof WarehouseFormData, string>> = {};
    if (!form.name.trim()) next.name = "Warehouse name is required";
    if (!form.address.trim()) next.address = "Address is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-[560px]"
      >
        {isTypeOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              Add Warehouse
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <InputField
                    data={{
                      id: "warehouse-name",
                      label: {
                        htmlFor: "warehouse-name",
                        labelText: "Warehouse Name",
                      },
                      placeholder: "e.g. Central Rpastery Hub",
                      required: true,
                      inputProps: {
                        value: form.name,
                        onChange: (e) => set("name", e.target.value),
                      },
                    }}
                  />
                  {errors.name && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="warehouse-type"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    Type<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={WAREHOUSE_TYPE_OPTIONS}
                    selected={form.kind}
                    onSelect={(value) =>
                      set("kind", value as WarehouseKind)
                    }
                    onOpenChange={setIsTypeOpen}
                    placeholder="Select type"
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="warehouse-address"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  Address<span className="text-[#C90000]">*</span>
                </Label>
                <Textarea
                  id="warehouse-address"
                  rows={3}
                  placeholder="Enter full physical location details..."
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
            </div>
          </form>

          {/* Sticky footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: "Cancel",
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
                Create Warehouse
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWarehouseModal;
