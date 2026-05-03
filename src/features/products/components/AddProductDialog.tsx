import {
  Box,
  Check,
  ChevronDown,
  FileUp,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
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
import {
  INITIAL_PRODUCT_FORM,
  PRODUCT_CATEGORY_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
} from "../data";
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

interface VariantOption {
  id: number;
  name: string;
  priceDelta: string;
}

interface VariantGroup {
  id: number;
  name: string;
  required: boolean;
  options: VariantOption[];
}

const createVariantGroup = (id: number): VariantGroup => ({
  id,
  name: "",
  required: false,
  options: [
    {
      id: 1,
      name: "",
      priceDelta: "0",
    },
  ],
});

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
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!open) {
      return;
    }

    setStep(1);
    setShowStepOneErrors(false);
    setVariantGroups([]);
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
  /* eslint-enable react-hooks/exhaustive-deps */

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

  const productCategories = PRODUCT_CATEGORY_OPTIONS.filter(
    (category) => category !== "All Categories",
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
          quantityLabel:
            ingredient.name === "Tomatoes"
              ? "2 Gram(s)"
              : ingredient.name === "Lettuce"
                ? "1 Gram(s)"
                : "1 Gram(s)",
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

  const addVariantGroup = () => {
    setVariantGroups((previous) => [
      ...previous,
      createVariantGroup((previous.at(-1)?.id ?? 0) + 1),
    ]);
  };

  const updateVariantGroup = (
    groupId: number,
    updates: Partial<Pick<VariantGroup, "name" | "required">>,
  ) => {
    setVariantGroups((previous) =>
      previous.map((group) =>
        group.id === groupId ? { ...group, ...updates } : group,
      ),
    );
  };

  const removeVariantGroup = (groupId: number) => {
    setVariantGroups((previous) =>
      previous.filter((group) => group.id !== groupId),
    );
  };

  const addVariantOption = (groupId: number) => {
    setVariantGroups((previous) =>
      previous.map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: [
                ...group.options,
                {
                  id: (group.options.at(-1)?.id ?? 0) + 1,
                  name: "",
                  priceDelta: "0",
                },
              ],
            }
          : group,
      ),
    );
  };

  const updateVariantOption = (
    groupId: number,
    optionId: number,
    updates: Partial<VariantOption>,
  ) => {
    setVariantGroups((previous) =>
      previous.map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: group.options.map((option) =>
                option.id === optionId ? { ...option, ...updates } : option,
              ),
            }
          : group,
      ),
    );
  };

  const removeVariantOption = (groupId: number, optionId: number) => {
    setVariantGroups((previous) =>
      previous.map((group) =>
        group.id === groupId
          ? {
              ...group,
              options: group.options.filter((option) => option.id !== optionId),
            }
          : group,
      ),
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
    : "border-[#7A5900] bg-white";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[820px] rounded-[12px] bg-white p-0 ring-0 sm:max-w-174"
      >
        <div className="relative max-h-[92vh] overflow-y-auto p-8">
          <DialogTitle className="mb-10 text-[28px] font-semibold text-[#28293D]">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>

          <div className="mx-6 mb-9">
            <div className="relative mb-4">
              <div
                className={`absolute top-4 right-4 left-4 h-0.5 ${
                  step === 2 ? "bg-primary" : "bg-[#CACBD4]"
                }`}
              />

              <div className="relative flex items-start justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex flex-col items-start gap-1 text-left"
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-full border-[3px] text-[14px] font-semibold ${
                      step === 2
                        ? "border-[#F5F0EA] bg-primary text-white"
                        : "border-primary bg-white text-[#28293D]"
                    }`}
                  >
                    {step === 2 ? <Check className="size-4" /> : "1"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={goToStepTwo}
                  className="flex flex-col items-end gap-1 text-right"
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-full border-[3px] text-[14px] font-semibold ${
                      step === 2
                        ? "border-primary bg-white text-[#28293D]"
                        : "border-[#8B8B8B] bg-[#CACBD4] text-[#8B8B8B]"
                    }`}
                  >
                    2
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between text-[12px] leading-tight font-semibold">
              <div className="flex flex-col items-center">
                <span className="text-[#28293D]">Product Description</span>
                {step === 2 ? (
                  <span className="text-[10px] text-[#059B5A]">Complete</span>
                ) : null}
              </div>
              <span
                className={step === 2 ? "text-[#28293D]" : "text-[#8B8B8B]"}
              >
                Recipes included
              </span>
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-8">
              <div
                className={`flex h-40 cursor-pointer items-center justify-center rounded-[16px] border border-dashed transition-colors [border-width:2px] [border-dasharray:6,4] ${uploadZoneClass}`}
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
                      className="h-22 w-auto max-w-70 rounded-[8px] object-contain"
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
                  <div className="flex flex-col items-center text-center">
                    <FileUp className="mb-6 size-6 text-[#000000]" />
                    <p className="mb-1 text-[16px] font-semibold text-[#333333]">
                      Click to upload image
                    </p>
                    <p className="text-[14px] text-[#8B8B8B]">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}

                <input
                  {...uploadActions.getInputProps({ className: "hidden" })}
                />
              </div>

              <div className="grid grid-cols-2 gap-7">
                <div>
                  <p className="mb-3 text-[18px] font-medium text-[#000000]">
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
                    className={`h-14 rounded-[12px] px-4 text-[16px] placeholder:text-[#8B8B8B] ${
                      showStepOneErrors && !requiredFields.name
                        ? "border-[#C90000]"
                        : "border-[#E5E5E5]"
                    }`}
                  />
                </div>

                <div>
                  <p className="mb-3 text-[18px] font-medium text-[#000000]">
                    Category <span className="text-[#C90000]">*</span>
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-14 w-full justify-between rounded-[12px] px-4 text-left text-[16px] font-normal hover:bg-white ${
                          form.category ? "text-[#333333]" : "text-[#8B8B8B]"
                        } ${
                          showStepOneErrors && !requiredFields.category
                            ? "border-[#C90000]"
                            : "border-[#E5E5E5]"
                        }`}
                      >
                        {form.category || "e.g. Breads, Pastries, Coffee"}
                        <ChevronDown className="size-5 text-[#8B8B8B]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="z-70 w-[var(--radix-dropdown-menu-trigger-width)] rounded-[16px] p-2 ring-0"
                    >
                      {productCategories.map((category) => (
                        <DropdownMenuItem
                          key={category}
                          className={`rounded-[17px] px-3 py-2 text-[16px] font-medium ${
                            category === form.category
                              ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                              : "text-[#28293D]"
                          }`}
                          onSelect={() =>
                            setForm((previous) => ({
                              ...previous,
                              category,
                            }))
                          }
                        >
                          {category}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div>
                <p className="mb-3 text-[18px] font-medium text-[#000000]">
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
                  className={`h-14 rounded-[12px] px-4 text-[16px] placeholder:text-[#8B8B8B] ${
                    showStepOneErrors && !requiredFields.description
                      ? "border-[#C90000]"
                      : "border-[#E5E5E5]"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-7">
                <div>
                  <p className="mb-3 text-[18px] font-medium text-[#000000]">
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
                    className={`h-14 rounded-[12px] px-4 text-[16px] placeholder:text-[#8B8B8B] ${
                      showStepOneErrors && !requiredFields.price
                        ? "border-[#C90000]"
                        : "border-[#E5E5E5]"
                    }`}
                  />
                </div>

                <div>
                  <p className="mb-3 text-[18px] font-medium text-[#000000]">
                    Status <span className="text-[#C90000]">*</span>
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-14 w-full justify-between rounded-[12px] px-4 text-[16px] font-normal text-[#333333] hover:bg-white ${
                          showStepOneErrors && !requiredFields.status
                            ? "border-[#C90000]"
                            : "border-[#E5E5E5]"
                        }`}
                      >
                        {form.status}
                        <ChevronDown className="size-5 text-[#000000]" />
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

              <div className="grid grid-cols-2 gap-7">
                <div>
                  <p className="mb-3 text-[18px] font-medium text-[#000000]">
                    Discount Type{" "}
                    <span className="text-[15px] text-[#595959]">
                      (Optional)
                    </span>
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-14 w-full justify-between rounded-[12px] border-[#E9EAEE] px-4 text-[16px] font-normal text-[#8B8B8B] hover:bg-white"
                      >
                        {form.discountType || "Select type"}
                        <ChevronDown className="size-5 text-[#000000]" />
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
                  <p className="mb-3 text-[18px] font-medium text-[#000000]">
                    Discount %{" "}
                    <span className="text-[15px] text-[#595959]">
                      (Optional)
                    </span>
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
                    className="h-14 rounded-[12px] border-[#E9EAEE] px-4 text-[16px] placeholder:text-[#8B8B8B]"
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
            <div className="space-y-9">
              <div className="rounded-[16px] border border-[#CACBD4] p-7">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[#333333]">
                    <Box className="size-5 text-[#000000]" />
                    Variants
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-[5px] border-primary px-5 text-[14px] font-semibold text-primary hover:bg-white hover:text-primary"
                    onClick={addVariantGroup}
                  >
                    <Plus className="mr-3 size-4" />
                    Add Group
                  </Button>
                </div>

                {variantGroups.length === 0 ? (
                  <div className="rounded-[12px] border border-dashed border-primary py-4 text-center text-[14px] font-semibold text-primary [border-width:2px] [border-dasharray:7,6]">
                    There are no option sets currently available.
                  </div>
                ) : (
                  <div className="space-y-5">
                    {variantGroups.map((group, groupIndex) => (
                      <div
                        key={group.id}
                        className="rounded-[12px] border border-dashed border-primary p-3 [border-width:2px] [border-dasharray:7,6]"
                      >
                        <div className="mb-3 grid grid-cols-[1fr_auto_auto] items-center gap-3">
                          <Input
                            value={group.name}
                            onChange={(event) =>
                              updateVariantGroup(group.id, {
                                name: event.target.value,
                              })
                            }
                            placeholder={
                              groupIndex === 0
                                ? "Group Name(e.g. Bread Type)"
                                : "Group Name (e.g. Toppings)"
                            }
                            className="h-14 rounded-[12px] border-[#E5E5E5] px-4 text-[16px] placeholder:text-[#8B8B8B]"
                          />

                          <label className="flex items-center gap-2 text-[14px] font-medium text-[#333333]">
                            <input
                              type="checkbox"
                              checked={group.required}
                              onChange={(event) =>
                                updateVariantGroup(group.id, {
                                  required: event.target.checked,
                                })
                              }
                              className="size-6 rounded-[6px] accent-primary"
                            />
                            Required
                          </label>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-[#C90000] hover:bg-transparent hover:text-[#C90000]"
                            onClick={() => removeVariantGroup(group.id)}
                          >
                            <Trash2 className="size-4.5" />
                          </Button>
                        </div>

                        <div className="border-l-4 border-primary pl-2">
                          <div className="space-y-3">
                            {group.options.map((option, optionIndex) => (
                              <div
                                key={option.id}
                                className="grid grid-cols-[1fr_88px_auto] items-center gap-3"
                              >
                                <Input
                                  value={option.name}
                                  onChange={(event) =>
                                    updateVariantOption(
                                      group.id,
                                      option.id,
                                      {
                                        name: event.target.value,
                                      },
                                    )
                                  }
                                  placeholder={`Option ${String(
                                    optionIndex + 1,
                                  ).padStart(2, "0")} ${
                                    groupIndex === 0
                                      ? optionIndex === 0
                                        ? "(White Toast)"
                                        : "(Brown Toast)"
                                      : "(Avocado)"
                                  }`}
                                  className="h-14 rounded-[12px] border-[#E5E5E5] px-4 text-[16px] placeholder:text-[#8B8B8B]"
                                />

                                <Input
                                  type="number"
                                  value={option.priceDelta}
                                  onChange={(event) =>
                                    updateVariantOption(
                                      group.id,
                                      option.id,
                                      {
                                        priceDelta: event.target.value,
                                      },
                                    )
                                  }
                                  className="h-14 rounded-[12px] border-[#E5E5E5] px-4 text-center text-[16px]"
                                />

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-[#C90000] hover:bg-transparent hover:text-[#C90000]"
                                  onClick={() =>
                                    removeVariantOption(group.id, option.id)
                                  }
                                >
                                  <Trash2 className="size-4.5" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            className="mt-4 h-9 w-full gap-3 rounded-[8px] text-[14px] font-semibold text-primary hover:bg-transparent hover:text-primary"
                            onClick={() => addVariantOption(group.id)}
                          >
                            <Plus className="size-4" />
                            New Option
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="mb-3 text-[18px] font-medium text-[#000000]">
                  Recipe/Ingredients <span className="text-[#C90000]">*</span>
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-14 w-full justify-between rounded-[12px] border-[#E9EAEE] px-4 text-[16px] font-normal text-[#8B8B8B] hover:bg-white"
                    >
                      Select a reciepe
                      <ChevronDown className="size-6 text-[#000000]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="z-70 max-h-82 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto rounded-[16px] p-2 ring-0"
                  >
                    {ingredientOptions.map((ingredient) => {
                      const isSelected = selectedRecipes.some(
                        (recipe) => recipe.id === ingredient.id,
                      );

                      return (
                        <DropdownMenuItem
                          key={ingredient.id}
                          className={`rounded-[17px] px-4 py-3 text-[15px] font-medium ${
                            isSelected
                              ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                              : "text-[#28293D]"
                          }`}
                          onSelect={() => addRecipe(ingredient)}
                        >
                          {ingredient.name}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {selectedRecipes.length > 0 ? (
                <div className="rounded-[16px] border border-[#CACBD4] p-4">
                  <div className="space-y-3">
                    {selectedRecipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="grid grid-cols-[1fr_132px_64px] items-center gap-3"
                      >
                        <Input
                          value={recipe.name}
                          readOnly
                          className="h-14 rounded-[12px] border-[#E5E5E5] px-4 text-[16px] text-[#333333]"
                        />

                        <Input
                          value={recipe.quantityLabel}
                          onChange={(event) =>
                            updateRecipeQuantity(recipe.id, event.target.value)
                          }
                          className="h-14 rounded-[12px] border-[#E5E5E5] px-4 text-center text-[16px] text-[#000000]"
                        />

                        <Button
                          type="button"
                          size="icon"
                          className="size-14 rounded-[8px] bg-[#C90000] text-white hover:bg-[#C90000]"
                          onClick={() => removeRecipe(recipe.id)}
                        >
                          <Trash2 className="size-6" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          <div className="my-9 border-t border-[#CACBD4]" />

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-14 rounded-[5px] border-primary px-7.5 py-4 text-[16px] text-primary hover:bg-white hover:text-primary"
              onClick={handleClose}
            >
              Cancel
            </Button>

            {step === 1 ? (
              <Button
                type="button"
                className="h-14 rounded-[5px] px-7.5 py-4 text-[16px]"
                onClick={goToStepTwo}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                className="h-14 rounded-[5px] px-7.5 py-4 text-[16px]"
                onClick={handleSave}
              >
                Add Product
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
