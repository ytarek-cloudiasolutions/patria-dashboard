import { useEffect, useState } from "react";
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
import { SECTION_OPTIONS } from "../data";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { AddTableFormData } from "../types";
import type { TableSection } from "../store/tableTypes";

const FORM_ID = "add-table-form";

interface AddTableDialogProps {
  open: boolean;
  defaultSection: TableSection;
  onOpenChange: (open: boolean) => void;
  onSave: (data: AddTableFormData) => void;
}

const AddTableDialog = ({
  open,
  defaultSection,
  onOpenChange,
  onSave,
}: AddTableDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<AddTableFormData>({
    number: "",
    capacity: "",
    section: defaultSection,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AddTableFormData, string>>
  >({});
  const [isSectionOpen, setIsSectionOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ number: "", capacity: "", section: defaultSection });
      setErrors({});
      setIsSectionOpen(false);
    }
  }, [open, defaultSection]);

  const set = <K extends keyof AddTableFormData>(
    key: K,
    value: AddTableFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof AddTableFormData, string>> = {};
    if (!form.number.trim()) next.number = "Table number is required";
    if (!form.capacity.trim() || Number(form.capacity) <= 0) {
      next.capacity = "Enter a valid capacity";
    }
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
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-140"
      >
        {isSectionOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Add New Table")}
            </DialogTitle>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-5">
              <div>
                <InputField
                  data={{
                    id: "table-number",
                    label: { htmlFor: "table-number", labelText: t("Table Number") },
                    placeholder: t("e.g. 1"),
                    required: true,
                    inputProps: {
                      value: form.number,
                      onChange: (e) => set("number", e.target.value),
                    },
                  }}
                />
                {errors.number && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.number}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-end">
                <div>
                  <InputField
                    data={{
                      id: "table-capacity",
                      label: { htmlFor: "table-capacity", labelText: t("Capacity") },
                      placeholder: "0",
                      required: true,
                      inputProps: {
                        type: "number",
                        min: "1",
                        value: form.capacity,
                        onChange: (e) => set("capacity", e.target.value),
                      },
                    }}
                  />
                  {errors.capacity && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.capacity}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="table-section"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    {t("Section")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={SECTION_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
                    selected={form.section}
                    onSelect={(value) => set("section", value as TableSection)}
                    onOpenChange={setIsSectionOpen}
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
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
                {t("Add Table")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTableDialog;
