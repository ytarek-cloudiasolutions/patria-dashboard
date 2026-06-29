import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { IngredientFormData, Ingredient } from "../types";
import UploadDropzone from "./UploadDropzone";

const FORM_ID = "add-ingredient-form";

const INITIAL_FORM: IngredientFormData = {
  name: "",
  description: "",
  barcode: "",
  price: "",
  quantity: "",
  imageUrl: undefined,
  imageFile: undefined,
  isExtra: false,
  extraCategories: [],
};

interface AddIngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaving?: boolean;
  editingIngredient?: Ingredient | null;
  onSave: (data: IngredientFormData) => void;
}

const AddIngredientDialog = ({
  open,
  onOpenChange,
  isSaving = false,
  editingIngredient,
  onSave,
}: AddIngredientDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<IngredientFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof IngredientFormData, string>>
  >({});

  useEffect(() => {
    if (!open) return;
    setForm(
      editingIngredient
        ? {
            name: editingIngredient.name,
            description: editingIngredient.description || "",
            barcode: "",
            price: String(editingIngredient.price),
            quantity: String(editingIngredient.quantity),
            imageUrl: editingIngredient.imageUrl,
            imageFile: undefined,
            isExtra: editingIngredient.isExtra ?? false,
            extraCategories: editingIngredient.extraCategories ?? [],
          }
        : INITIAL_FORM,
    );
    setErrors({});
  }, [open, editingIngredient]);

  const set = <K extends keyof IngredientFormData>(
    key: K,
    value: IngredientFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof IngredientFormData, string>> = {};
    if (!form.name.trim()) next.name = t("Product name is required");
    if (!form.price.trim() || Number(form.price) <= 0)
      next.price = t("Enter a valid price");
    if (!form.quantity.trim() || Number(form.quantity) < 0)
      next.quantity = t("Enter a valid quantity");
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-150"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {editingIngredient ? t("Edit Ingredient") : t("Add New Ingredient")}
            </DialogTitle>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <UploadDropzone
              value={form.imageUrl}
              onSelect={(file, url) => {
                set("imageUrl", url);
                set("imageFile", file);
              }}
              title="Click to upload image"
              hint="PNG, JPG up to 5MB"
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <InputField
                  data={{
                    id: "ingredient-name",
                    label: {
                      htmlFor: "ingredient-name",
                      labelText: t("Product Name"),
                    },
                    placeholder: t("e.g. Artisanal Sourdough"),
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
                <Label className="mb-2.5 text-[16px] font-medium text-black">
                  {t("Category")}
                </Label>
                <Input
                  value={t("Raw Ingredient")}
                  disabled
                  readOnly
                  className="h-12.5 rounded-xl border-[#E5E5E5] bg-[#F4F4F4] px-4.5 py-3 text-[14px] text-[#595959] disabled:opacity-100"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <Label
                htmlFor="ingredient-description"
                className="mb-2.5 text-[16px] font-medium text-black"
              >
                {t("Description")}{" "}
                <span className="text-[13px] font-normal text-[#8B8B8B]">
                  {t("(Optional)")}
                </span>
              </Label>
              <Textarea
                id="ingredient-description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder={t("Describe this product...")}
                className="min-h-20 rounded-xl border-[#E5E5E5] px-4.5 py-3 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0"
              />
            </div>

            <InputField
              data={{
                id: "ingredient-barcode",
                label: {
                  htmlFor: "ingredient-barcode",
                  labelText: `${t("Barcode")} ${t("(Optional)")}`,
                },
                placeholder: t("Manually enter barcode"),
                inputProps: {
                  value: form.barcode,
                  onChange: (e) => set("barcode", e.target.value),
                },
              }}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <InputField
                  data={{
                    id: "ingredient-price",
                    label: {
                      htmlFor: "ingredient-price",
                      labelText: t("Price"),
                    },
                    placeholder: "0",
                    required: true,
                    inputProps: {
                      type: "number",
                      min: "0",
                      step: "0.01",
                      value: form.price,
                      onChange: (e) => set("price", e.target.value),
                    },
                  }}
                />
                {errors.price && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.price}
                  </p>
                )}
              </div>
              <div>
                <InputField
                  data={{
                    id: "ingredient-quantity",
                    label: {
                      htmlFor: "ingredient-quantity",
                      labelText: t("Initial Quantity"),
                    },
                    placeholder: "0",
                    required: true,
                    inputProps: {
                      type: "number",
                      min: "0",
                      value: form.quantity,
                      onChange: (e) => set("quantity", e.target.value),
                    },
                  }}
                />
                {errors.quantity && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.quantity}
                  </p>
                )}
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
                disabled={isSaving}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {isSaving
                  ? t("Saving...")
                  : editingIngredient
                    ? t("Update Ingredient")
                    : t("Add Ingredient")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddIngredientDialog;
