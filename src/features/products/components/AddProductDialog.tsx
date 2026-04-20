import { ChevronDown, CircleMinus, ImagePlus, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { useFileUpload } from "@/shared/hooks/use-file-upload";
import { INITIAL_PRODUCT_FORM, PRODUCT_STATUS_OPTIONS } from "../data";
import type {
  Ingredient,
  Product,
  ProductFormData,
  ProductStatus,
  RecipeSelection,
} from "../types";

interface AddProductDialogProps {
  open: boolean;
  product: Product | null;
  ingredientOptions: Ingredient[];
  onOpenChange: (open: boolean) => void;
  onSave: (
    payload: ProductFormData,
    selectedRecipes: RecipeSelection[],
  ) => void;
}

const AddProductDialog = ({
  open,
  product,
  ingredientOptions,
  onOpenChange,
  onSave,
}: AddProductDialogProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<ProductFormData>(INITIAL_PRODUCT_FORM);
  const [selectedRecipes, setSelectedRecipes] = useState<RecipeSelection[]>([]);
  const [showStepOneErrors, setShowStepOneErrors] = useState(false);

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

    setStep(1);
    setShowStepOneErrors(false);
    uploadActions.clearFiles();

    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price.toString(),
        status: product.status,
        discountType: "",
        discountValue: "",
        imageUrl: product.imageUrl,
        isActive: product.isActive,
      });
      setSelectedRecipes([]);
      return;
    }

    setForm(INITIAL_PRODUCT_FORM);
    setSelectedRecipes([]);
  }, [open, product]);

  const requiredFields = {
    name: form.name.trim().length > 0,
    category: form.category.trim().length > 0,
    description: form.description.trim().length > 0,
    price: form.price.trim().length > 0,
    status: form.status.trim().length > 0,
  };

  const hasStepOneErrors = Object.values(requiredFields).some(
    (value) => !value,
  );

  const setStatus = (status: ProductStatus) => {
    setForm((previous) => ({ ...previous, status }));
  };

  const goToStepTwo = () => {
    if (hasStepOneErrors) {
      setShowStepOneErrors(true);
      return;
    }

    setShowStepOneErrors(false);
    setStep(2);
  };

  const addRecipe = (ingredient: Ingredient) => {
    setSelectedRecipes((previous) => {
      if (previous.some((entry) => entry.id === ingredient.id)) {
        return previous;
      }

      return [
        ...previous,
        {
          id: ingredient.id,
          name: ingredient.name,
          quantityLabel: "1 Gram(s)",
        },
      ];
    });
  };

  const updateRecipeQuantity = (recipeId: number, quantityLabel: string) => {
    setSelectedRecipes((previous) =>
      previous.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, quantityLabel } : recipe,
      ),
    );
  };

  const removeRecipe = (recipeId: number) => {
    setSelectedRecipes((previous) =>
      previous.filter((recipe) => recipe.id !== recipeId),
    );
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSave = () => {
    onSave(form, selectedRecipes);
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
        <div className="relative p-6">
          <DialogTitle className="text-[24px] font-bold text-[#333333]">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>

          <div className="mt-4">
            <div className="relative pb-6">
              <div className="absolute top-3 left-4 right-4 h-px bg-[#CACBD4]" />
              <div
                className="absolute top-3 left-4 h-px bg-primary transition-all duration-300"
                style={{ width: step === 2 ? "calc(100% - 2rem)" : "0%" }}
              />

              <div className="relative flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center"
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-full border text-[12px] font-semibold ${
                      step === 1 || step === 2
                        ? "border-primary bg-white text-primary"
                        : "border-[#A5A7B0] bg-[#E5E7ED] text-[#8B8B8B]"
                    }`}
                  >
                    1
                  </span>
                </button>

                <button
                  type="button"
                  onClick={goToStepTwo}
                  className="flex items-center"
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-full border text-[12px] font-semibold ${
                      step === 2
                        ? "border-primary bg-white text-primary"
                        : "border-[#A5A7B0] bg-[#E5E7ED] text-[#8B8B8B]"
                    }`}
                  >
                    2
                  </span>
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between text-[9px] font-medium">
                <span
                  className={step === 1 ? "text-[#333333]" : "text-[#8B8B8B]"}
                >
                  Product Description
                </span>
                <span
                  className={step === 2 ? "text-[#333333]" : "text-[#8B8B8B]"}
                >
                  Recipes included
                </span>
              </div>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-[14px] font-semibold text-[#333333]">
                  Product Image
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
                        alt="Product"
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
                          setForm((previous) => ({
                            ...previous,
                            imageUrl: "",
                          }));
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
                    className={`h-10 rounded-[8px] ${showStepOneErrors && !requiredFields.name ? "border-[#C90000]" : "border-[#E9EAEE]"}`}
                  />
                </div>

                <div>
                  <p className="mb-1.5 text-[14px] font-semibold text-[#333333]">
                    Category <span className="text-[#C90000]">*</span>
                  </p>
                  <Input
                    value={form.category}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        category: event.target.value,
                      }))
                    }
                    placeholder="e.g. Breads, Pastries, Coffee"
                    className={`h-10 rounded-[8px] ${showStepOneErrors && !requiredFields.category ? "border-[#C90000]" : "border-[#E9EAEE]"}`}
                  />
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[14px] font-semibold text-[#333333]">
                  Description <span className="text-[#C90000]">*</span>
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
                  className={`h-10 rounded-[8px] ${showStepOneErrors && !requiredFields.description ? "border-[#C90000]" : "border-[#E9EAEE]"}`}
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
                    placeholder="Price"
                    className={`h-10 rounded-[8px] ${showStepOneErrors && !requiredFields.price ? "border-[#C90000]" : "border-[#E9EAEE]"}`}
                  />
                </div>

                <div>
                  <p className="mb-1.5 text-[14px] font-semibold text-[#333333]">
                    Status <span className="text-[#C90000]">*</span>
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-10 w-full justify-between rounded-[8px] px-4 text-[14px] text-[#333333] hover:bg-white ${showStepOneErrors && !requiredFields.status ? "border-[#C90000]" : "border-[#E9EAEE]"}`}
                      >
                        {form.status}
                        <ChevronDown className="size-4 text-[#333333]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-55 rounded-[12px] p-1.5">
                      {PRODUCT_STATUS_OPTIONS.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onSelect={() => setStatus(status)}
                          className={`rounded-[8px] px-3 py-2 text-[14px] ${
                            status === form.status
                              ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                              : "text-[#333333]"
                          }`}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <p className="mb-1.5 text-[14px] font-semibold text-[#333333]">
                    Discount Type{" "}
                    <span className="text-[#8B8B8B]">(Optional)</span>
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 w-full justify-between rounded-[8px] border-[#E9EAEE] px-4 text-[14px] text-[#8B8B8B] hover:bg-white"
                      >
                        {form.discountType || "Select type"}
                        <ChevronDown className="size-4 text-[#333333]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-55 rounded-[12px] p-1.5">
                      {["Percentage", "Fixed", "None"].map((discountType) => (
                        <DropdownMenuItem
                          key={discountType}
                          onSelect={() =>
                            setForm((previous) => ({
                              ...previous,
                              discountType,
                            }))
                          }
                          className={`rounded-[8px] px-3 py-2 text-[14px] ${
                            form.discountType === discountType
                              ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                              : "text-[#333333]"
                          }`}
                        >
                          {discountType}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <p className="mb-1.5 text-[14px] font-semibold text-[#333333]">
                    Discount %{" "}
                    <span className="text-[#8B8B8B]">(Optional)</span>
                  </p>
                  <Input
                    value={form.discountValue}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        discountValue: event.target.value,
                      }))
                    }
                    placeholder="e.g. 20"
                    className="h-10 rounded-[8px] border-[#E9EAEE]"
                  />
                </div>
              </div>

              {showStepOneErrors && hasStepOneErrors ? (
                <p className="text-[12px] font-medium text-[#C90000]">
                  Please fill all required fields to continue.
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="mb-1.5 text-[14px] font-semibold text-[#333333]">
                  Select Recipes
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 w-full justify-between rounded-[8px] border-[#E9EAEE] px-4 text-[14px] font-normal text-[#8B8B8B] hover:bg-white"
                    >
                      Search recipes..
                      <ChevronDown className="size-4 text-[#8B8B8B]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-109 rounded-[12px] p-1.5"
                  >
                    {ingredientOptions.map((ingredient) => (
                      <DropdownMenuItem
                        key={ingredient.id}
                        className="rounded-[8px] px-3 py-2 text-[14px] text-[#333333]"
                        onSelect={() => addRecipe(ingredient)}
                      >
                        {ingredient.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                {selectedRecipes.length === 0 ? (
                  <Card className="rounded-[10px] border border-dashed border-[#E9EAEE] bg-[#FCFCFD] p-4 text-center text-[13px] text-[#8B8B8B] shadow-none">
                    No ingredients selected.
                  </Card>
                ) : (
                  selectedRecipes.map((recipe) => (
                    <Card
                      key={recipe.id}
                      className="rounded-[10px] border border-[#E9EAEE] bg-[#FCFCFD] px-3 py-2 shadow-none"
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          value={recipe.name}
                          readOnly
                          className="h-9 border-none bg-transparent px-0 text-[14px] font-medium text-[#333333] shadow-none focus-visible:ring-0"
                        />

                        <Input
                          value={recipe.quantityLabel}
                          onChange={(event) =>
                            updateRecipeQuantity(recipe.id, event.target.value)
                          }
                          className="h-9 w-35 rounded-[8px] border-[#E9EAEE] text-[13px]"
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-auto size-8 text-[#FF3B30] hover:bg-transparent hover:text-[#FF3B30]"
                          onClick={() => removeRecipe(recipe.id)}
                        >
                          <CircleMinus className="size-4" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

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

            {step === 1 ? (
              <Button
                type="button"
                className="h-10 rounded-[8px] px-7 text-[14px]"
                onClick={goToStepTwo}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                className="h-10 rounded-[8px] px-7 text-[14px]"
                onClick={handleSave}
              >
                <Upload className="mr-2 size-4" />
                Save Product
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
