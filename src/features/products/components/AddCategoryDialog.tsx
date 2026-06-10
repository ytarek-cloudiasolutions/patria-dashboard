import { useEffect, useState } from "react";
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
import type { CategoryFormData } from "../types";
import UploadDropzone from "./UploadDropzone";

const FORM_ID = "add-category-form";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CategoryFormData) => void;
}

const AddCategoryDialog = ({
  open,
  onOpenChange,
  onSave,
}: AddCategoryDialogProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setImageUrl(undefined);
      setError("");
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("Category name is required"));
      return;
    }
    onSave({ name: name.trim(), imageUrl });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-150"
      >
        <div className="flex flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Add New Category")}
            </DialogTitle>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5 px-5 py-5 sm:px-7 sm:py-6"
          >
            <UploadDropzone
              value={imageUrl}
              onSelect={(_, url) => setImageUrl(url)}
              title="Click to upload image"
              hint="PNG, JPG up to 5MB"
            />

            <div>
              <InputField
                data={{
                  id: "category-name",
                  label: {
                    htmlFor: "category-name",
                    labelText: t("Category Name"),
                  },
                  placeholder: t("e.g. Speciality Coffee"),
                  required: true,
                  inputProps: {
                    value: name,
                    onChange: (e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    },
                  },
                }}
              />
              {error && (
                <p className="mt-1 text-[13px] text-[#C90000]">{error}</p>
              )}
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
                {t("Add category")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
