import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CategoryFormData, Category } from "../types";
import UploadDropzone from "./UploadDropzone";

const FORM_ID = "add-category-form";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaving?: boolean;
  editingCategory?: Category | null;
  onSave: (data: CategoryFormData) => void;
}

const AddCategoryDialog = ({
  open,
  onOpenChange,
  isSaving = false,
  editingCategory,
  onSave,
}: AddCategoryDialogProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; nameAr?: string }>({});

  useEffect(() => {
    if (open) {
      if (editingCategory) {
        setName(editingCategory.name || "");
        setNameAr(editingCategory.nameAr || (editingCategory as any).name_ar || "");
        setImageUrl(editingCategory.imageUrl || undefined);
        setImageFile(undefined);
        setRemoveImage(false);
      } else {
        setName("");
        setNameAr("");
        setImageUrl(undefined);
        setImageFile(undefined);
        setRemoveImage(false);
      }
      setErrors({});
    }
  }, [open, editingCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; nameAr?: string } = {};
    if (!name.trim()) {
      nextErrors.name = t("Category Name (EN) is required");
    }
    if (!nameAr.trim()) {
      nextErrors.nameAr = t("Category Name (AR) is required");
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      name: name.trim(),
      nameAr: nameAr.trim(),
      imageUrl: removeImage ? undefined : imageUrl,
      imageFile,
      removeImage,
      kitchenType: editingCategory?.kitchenType,
    });
    onOpenChange(false);
  };

  const handleRemoveImage = () => {
    setImageUrl(undefined);
    setImageFile(undefined);
    setRemoveImage(true);
  };

  const hasImage = Boolean((imageUrl && !removeImage) || imageFile);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-[696px]"
      >
        <div className="flex flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {editingCategory ? t("Edit Category") : t("Add New Category")}
            </DialogTitle>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5 px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-2">
              <UploadDropzone
                value={removeImage ? undefined : imageUrl}
                onSelect={(file, url) => {
                  setImageFile(file);
                  setImageUrl(url);
                  setRemoveImage(false);
                }}
                title="Click to upload image"
                hint="PNG, JPG up to 5MB"
              />
              {editingCategory && hasImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 self-start py-1 text-[16px] font-semibold text-[#C90000] cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Trash2 className="size-4.5 text-[#C90000]" />
                  <span>{t("Remove image")}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <InputField
                  data={{
                    id: "category-name-en",
                    label: {
                      htmlFor: "category-name-en",
                      labelText: t("Category Name (EN)"),
                    },
                    placeholder: "Iced Coffee",
                    required: true,
                    inputProps: {
                      value: name,
                      onChange: (e) => {
                        setName(e.target.value);
                        if (errors.name) {
                          setErrors((prev) => ({ ...prev, name: undefined }));
                        }
                      },
                    },
                  }}
                />
                {errors.name && (
                  <p className="mt-1 text-[13px] text-[#C90000]">{errors.name}</p>
                )}
              </div>

              <div>
                <InputField
                  data={{
                    id: "category-name-ar",
                    label: {
                      htmlFor: "category-name-ar",
                      labelText: t("Category Name (AR)"),
                    },
                    placeholder: "القهوة المثلجة",
                    required: true,
                    inputProps: {
                      value: nameAr,
                      onChange: (e) => {
                        setNameAr(e.target.value);
                        if (errors.nameAr) {
                          setErrors((prev) => ({ ...prev, nameAr: undefined }));
                        }
                      },
                    },
                  }}
                />
                {errors.nameAr && (
                  <p className="mt-1 text-[13px] text-[#C90000]">{errors.nameAr}</p>
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
                  : editingCategory
                    ? t("Save Changes")
                    : t("Add category")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
