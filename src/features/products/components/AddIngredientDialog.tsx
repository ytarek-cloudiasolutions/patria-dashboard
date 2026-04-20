import { ImagePlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { useFileUpload } from "@/shared/hooks/use-file-upload";
import { INITIAL_INGREDIENT_FORM } from "../data";
import type { Ingredient, IngredientFormData } from "../types";

interface AddIngredientDialogProps {
  open: boolean;
  ingredient: Ingredient | null;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: IngredientFormData) => void;
}

const AddIngredientDialog = ({
  open,
  ingredient,
  onOpenChange,
  onSave,
}: AddIngredientDialogProps) => {
  const [form, setForm] = useState<IngredientFormData>(INITIAL_INGREDIENT_FORM);
  const [showErrors, setShowErrors] = useState(false);

  const [uploadState, uploadActions] = useFileUpload({
    accept: "image/*",
    multiple: false,
    maxFiles: 1,
    onFilesChange: (files) => {
      const first = files[0];
      setForm((previous) => ({ ...previous, imageUrl: first?.preview ?? "" }));
    },
  });

  const uploadedImage = useMemo(
    () => uploadState.files[0]?.preview,
    [uploadState.files],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setShowErrors(false);
    uploadActions.clearFiles();

    if (ingredient) {
      setForm({
        name: ingredient.name,
        description: ingredient.description,
        price: ingredient.price.toString(),
        initialQuantity: ingredient.initialQuantity.toString(),
        category: "Raw Ingredient",
        imageUrl: ingredient.imageUrl,
      });
      return;
    }

    setForm(INITIAL_INGREDIENT_FORM);
  }, [ingredient, open]);

  const requiredFields = {
    name: form.name.trim().length > 0,
    price: form.price.trim().length > 0,
    initialQuantity: form.initialQuantity.trim().length > 0,
  };

  const hasErrors = Object.values(requiredFields).some((value) => !value);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (hasErrors) {
      setShowErrors(true);
      return;
    }

    onSave(form);
    handleClose();
  };

  const uploadZoneClass = uploadState.isDragging
    ? "border-primary bg-primary/5"
    : "border-[#D1B24A] bg-white";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-174 rounded-[12px] p-0 ring-0 sm:max-w-174"
      >
        <div className="relative max-h-[90vh] overflow-y-auto p-6">
          <DialogTitle className="text-[24px] font-bold text-[#333333]">
            {ingredient ? "Edit Ingredient" : "Add New Ingredient"}
          </DialogTitle>

          <div className="my-4 border-t border-[#F2F3F7]" />

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[14px] font-semibold text-[#333333]">
                Ingredient Image
              </p>
              <div
                className={`flex h-19 cursor-pointer items-center justify-center rounded-[10px] border border-dashed transition-colors ${uploadZoneClass}`}
                onDragEnter={uploadActions.handleDragEnter}
                onDragLeave={uploadActions.handleDragLeave}
                onDragOver={uploadActions.handleDragOver}
                onDrop={uploadActions.handleDrop}
                onClick={uploadActions.openFileDialog}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    uploadActions.openFileDialog();
                  }
                }}
              >
                {uploadedImage || form.imageUrl ? (
                  <div className="relative flex size-full items-center justify-center p-2">
                    <img
                      src={uploadedImage ?? form.imageUrl}
                      alt="Ingredient"
                      className="h-12 w-auto max-w-55 rounded-[8px] object-contain"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 size-7 rounded-full"
                      onClick={(event) => {
                        event.stopPropagation();
                        uploadActions.clearFiles();
                        setForm((previous) => ({ ...previous, imageUrl: "" }));
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <ImagePlus className="size-4 text-[#777777]" />
                    <p className="text-[14px] font-semibold text-[#333333]">
                      Click to upload image
                    </p>
                    <p className="text-[10px] text-[#8B8B8B]">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}

                <input
                  {...uploadActions.getInputProps({ className: "hidden" })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <p className="mb-1.5 text-[14px] font-semibold text-[#333333]">
                  Product Name <span className="text-[#C90000]">*</span>
                </p>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Artisanal Sourdough"
                  className={`h-10 rounded-[8px] ${showErrors && !requiredFields.name ? "border-[#C90000]" : "border-[#E9EAEE]"}`}
                />
              </div>

              <div>
                <p className="mb-1.5 text-[14px] font-semibold text-[#333333]">
                  Category
                </p>
                <Input
                  value={form.category}
                  readOnly
                  className="h-10 rounded-[8px] border-[#E9EAEE] bg-[#F8F8F8] text-[#8B8B8B]"
                />
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-[14px] font-semibold text-[#333333]">
                Description <span className="text-[#8B8B8B]">(Optional)</span>
              </p>
              <Input
                value={form.description}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                placeholder="Describe this product..."
                className="h-10 rounded-[8px] border-[#E9EAEE]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <p className="mb-1.5 text-[14px] font-semibold text-[#333333]">
                  Price <span className="text-[#C90000]">*</span>
                </p>
                <Input
                  value={form.price}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      price: event.target.value,
                    }))
                  }
                  placeholder="0"
                  className={`h-10 rounded-[8px] ${showErrors && !requiredFields.price ? "border-[#C90000]" : "border-[#E9EAEE]"}`}
                />
              </div>
              <div>
                <p className="mb-1.5 text-[14px] font-semibold text-[#333333]">
                  Initial Quantity <span className="text-[#C90000]">*</span>
                </p>
                <Input
                  value={form.initialQuantity}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      initialQuantity: event.target.value,
                    }))
                  }
                  placeholder="0"
                  className={`h-10 rounded-[8px] ${showErrors && !requiredFields.initialQuantity ? "border-[#C90000]" : "border-[#E9EAEE]"}`}
                />
              </div>
            </div>

            {showErrors && hasErrors ? (
              <p className="text-[12px] font-medium text-[#C90000]">
                Please fill all required fields to continue.
              </p>
            ) : null}
          </div>

          <div className="my-4 border-t border-[#F2F3F7]" />

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-[8px] border-[#E9EAEE] px-7 text-[14px]"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-10 rounded-[8px] px-7 text-[14px]"
              onClick={handleSubmit}
            >
              Add Ingredient
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddIngredientDialog;
