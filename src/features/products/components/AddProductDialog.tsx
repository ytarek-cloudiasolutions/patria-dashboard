import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, Sparkles, Box } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { PRODUCT_CATEGORIES } from "../data";
import type {
  Ingredient,
  Product,
  ProductFormData,
  VariantGroup,
  VariantOption,
  ProductExtra,
  Category,
} from "../types";
import UploadDropzone from "./UploadDropzone";

const FORM_ID = "add-product-form";

let uid = 0;
const nextId = () => `v${++uid}`;

const emptyOption = (): VariantOption => ({
  id: nextId(),
  name: "",
  price: 0,
});

const emptyGroup = (): VariantGroup => ({
  id: nextId(),
  name: "",
  required: false,
  options: [emptyOption()],
});

const INITIAL_FORM: ProductFormData = {
  name: "",
  category: "",
  description: "",
  barcode: "",
  price: "",
  quantity: "",
  imageUrl: undefined,
  imageFile: undefined,
  variantGroups: [],
  ingredients: [],
  extras: [],
};

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredients: Ingredient[];
  categories: Category[];
  isSaving?: boolean;
  /** When provided, the dialog edits this product instead of creating one. */
  editingProduct?: Product | null;
  onSave: (data: ProductFormData) => void;
}

const AddProductDialog = ({
  open,
  onOpenChange,
  ingredients,
  categories,
  isSaving = false,
  editingProduct,
  onSave,
}: AddProductDialogProps) => {
  const { t, language } = useTranslation();
  const [form, setForm] = useState<ProductFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    let categoryId = "";
    if (editingProduct) {
      const selectedCat = categories.find(
        (c) => c.name === editingProduct.category || c.id === editingProduct.category
      );
      categoryId = selectedCat ? selectedCat.id : editingProduct.category;
    }
    setForm(
      editingProduct
        ? {
            ...INITIAL_FORM,
            name: editingProduct.name,
            category: categoryId,
            description: editingProduct.description,
            price: String(editingProduct.price),
            imageUrl: editingProduct.imageUrl,
            extras: editingProduct.extras ?? [],
            variantGroups: editingProduct.variantGroups ?? [],
          }
        : INITIAL_FORM,
    );
    setErrors({});
    setIsCategoryOpen(false);
    setIsRecipeOpen(false);
  }, [open, editingProduct, categories]);

  const set = <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // --- Variant groups -------------------------------------------------------

  const addGroup = () =>
    set("variantGroups", [...form.variantGroups, emptyGroup()]);

  const removeGroup = (groupId: string) =>
    set(
      "variantGroups",
      form.variantGroups.filter((g) => g.id !== groupId),
    );

  const updateGroup = (groupId: string, patch: Partial<VariantGroup>) =>
    set(
      "variantGroups",
      form.variantGroups.map((g) =>
        g.id === groupId ? { ...g, ...patch } : g,
      ),
    );

  const addOption = (groupId: string) =>
    set(
      "variantGroups",
      form.variantGroups.map((g) =>
        g.id === groupId ? { ...g, options: [...g.options, emptyOption()] } : g,
      ),
    );

  const updateOption = (
    groupId: string,
    optionId: string,
    patch: Partial<VariantOption>,
  ) =>
    set(
      "variantGroups",
      form.variantGroups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              options: g.options.map((o) =>
                o.id === optionId ? { ...o, ...patch } : o,
              ),
            }
          : g,
      ),
    );

  const removeOption = (groupId: string, optionId: string) =>
    set(
      "variantGroups",
      form.variantGroups.map((g) =>
        g.id === groupId
          ? { ...g, options: g.options.filter((o) => o.id !== optionId) }
          : g,
      ),
    );

  // --- Recipe ingredients ---------------------------------------------------

  const addIngredient = (value: string) => {
    const ingredient = ingredients.find((i) => String(i.id) === value);
    if (!ingredient || form.ingredients.some((i) => i.ingredientId === ingredient.id))
      return;
    set("ingredients", [
      ...form.ingredients,
      {
        ingredientId: ingredient.id,
        name: ingredient.name,
        amount: 1,
        unit: ingredient.unit || "Piece(s)",
      },
    ]);
  };

  const updateIngredientAmount = (ingredientId: string, amount: number) =>
    set(
      "ingredients",
      form.ingredients.map((i) =>
        i.ingredientId === ingredientId ? { ...i, amount } : i,
      ),
    );

  const updateIngredientUnit = (ingredientId: string, unit: string) =>
    set(
      "ingredients",
      form.ingredients.map((i) =>
        i.ingredientId === ingredientId ? { ...i, unit } : i,
      ),
    );

  const removeIngredient = (ingredientId: string) =>
    set(
      "ingredients",
      form.ingredients.filter((i) => i.ingredientId !== ingredientId),
    );

  // --- Extras ---------------------------------------------------------------

  const addExtra = () =>
    set("extras", [
      ...form.extras,
      {
        id: nextId(),
        name: "",
        price: 0,
        active: true,
      },
    ]);

  const removeExtra = (id: string) =>
    set(
      "extras",
      form.extras.filter((e) => e.id !== id),
    );

  const updateExtra = (id: string, patch: Partial<ProductExtra>) =>
    set(
      "extras",
      form.extras.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    );

  // --- Submit ---------------------------------------------------------------

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.name.trim()) next.name = t("Product name is required");
    if (!form.category) next.category = t("Category is required");
    if (!form.description.trim()) next.description = t("Description is required");
    if (!form.price.trim() || Number(form.price) <= 0)
      next.price = t("Enter a valid price");
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave(form);
    onOpenChange(false);
  };

  const ingredientOptions = ingredients.map((i) => ({
    label: i.name,
    value: String(i.id),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-160"
      >
        {(isCategoryOpen || isRecipeOpen) && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {editingProduct ? t("Edit Product") : t("Add New Product")}
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
                    id: "product-name",
                    label: {
                      htmlFor: "product-name",
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
                  {t("Category")}<span className="text-[#C90000]">*</span>
                </Label>
                <DropdownSelect
                  options={categories.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                  selected={form.category}
                  onSelect={(value) => set("category", value)}
                  onOpenChange={setIsCategoryOpen}
                  placeholder={t("e.g. Breads, Pastries, Coffee")}
                  align="start"
                  className="md:w-full"
                  contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                />
                {errors.category && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <Label
                htmlFor="product-description"
                className="mb-2.5 text-[16px] font-medium text-black"
              >
                {t("Description")}<span className="text-[#C90000]">*</span>
              </Label>
              <Textarea
                id="product-description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder={t("Describe this product...")}
                className="min-h-20 rounded-xl border-[#E5E5E5] px-4.5 py-3 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0"
              />
              {errors.description && (
                <p className="mt-1 text-[13px] text-[#C90000]">
                  {errors.description}
                </p>
              )}
            </div>

            <InputField
              data={{
                id: "product-barcode",
                label: {
                  htmlFor: "product-barcode",
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
                    id: "product-price",
                    label: {
                      htmlFor: "product-price",
                      labelText: t("Price"),
                    },
                    placeholder: t("Price"),
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
              <InputField
                data={{
                  id: "product-quantity",
                  label: {
                    htmlFor: "product-quantity",
                    labelText: t("Initial quantity"),
                  },
                  placeholder: "0",
                  inputProps: {
                    type: "number",
                    min: "0",
                    value: form.quantity,
                    onChange: (e) => set("quantity", e.target.value),
                  },
                }}
              />
            </div>

            {/* Recipe / Ingredients */}
            <div className="flex flex-col">
              <Label className="mb-2.5 text-[16px] font-semibold text-black">
                {t("Recipe/Ingredients")}{" "}
                <span className="text-[13px] font-normal text-[#8B8B8B]">
                  {t("(Optional)")}
                </span>
              </Label>
              <DropdownSelect
                options={ingredientOptions}
                selected=""
                onSelect={addIngredient}
                onOpenChange={setIsRecipeOpen}
                placeholder={t("Select a recipe")}
                align="start"
                searchable
                className="md:w-full"
                contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
              />

              {form.ingredients.length > 0 && (
                <div className="mt-3 rounded-[12px] border border-[#E5E5E5] p-4 bg-[#FAFAF7]/30 space-y-3">
                  {form.ingredients.map((ingredient) => (
                    <div
                      key={ingredient.ingredientId}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-1 h-12 flex items-center rounded-xl border border-[#E5E5E5] bg-white px-4.5 text-[14px] text-[#28293D] font-medium">
                        {ingredient.name}
                      </div>
                      <div className="h-12 w-36 flex items-center rounded-xl border border-[#E5E5E5] bg-white px-3 gap-1 justify-between">
                        <input
                          type="number"
                          min="0"
                          value={ingredient.amount}
                          onChange={(e) =>
                            updateIngredientAmount(
                              ingredient.ingredientId,
                              Number(e.target.value) || 0,
                            )
                          }
                          className="w-12 h-full bg-transparent text-center text-[14px] text-[#28293D] focus:outline-none focus:ring-0 border-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className="h-full flex items-center gap-1 bg-transparent border-0 text-[12px] text-[#8B8B8B] font-semibold focus:outline-none cursor-pointer select-none"
                            >
                              <span>{t(ingredient.unit)}</span>
                              <ChevronDown className="size-3.5 text-[#8B8B8B]" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="z-70 p-2 ring-0 rounded-[16px] space-y-1 w-28 bg-white border border-[#E5E5E5] shadow-md"
                          >
                            <DropdownMenuItem
                              className={cn(
                                "px-3 py-2 text-[13px] font-semibold rounded-[16px] cursor-pointer focus:bg-[#F5F0EA] focus:text-[#28293D] hover:bg-[#F5F0EA]",
                                ingredient.unit === "Gram(s)"
                                  ? "bg-primary text-primary-foreground pointer-events-none"
                                  : "text-[#28293D]"
                              )}
                              onSelect={() =>
                                updateIngredientUnit(
                                  ingredient.ingredientId,
                                  "Gram(s)",
                                )
                              }
                            >
                              {t("Gram(s)")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={cn(
                                "px-3 py-2 text-[13px] font-semibold rounded-[16px] cursor-pointer focus:bg-[#F5F0EA] focus:text-[#28293D] hover:bg-[#F5F0EA]",
                                ingredient.unit === "Piece(s)"
                                  ? "bg-primary text-primary-foreground pointer-events-none"
                                  : "text-[#28293D]"
                              )}
                              onSelect={() =>
                                updateIngredientUnit(
                                  ingredient.ingredientId,
                                  "Piece(s)",
                                )
                              }
                            >
                              {t("Piece(s)")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeIngredient(ingredient.ingredientId)
                        }
                        aria-label={`${t("Remove")} ${ingredient.name}`}
                        className="h-12 w-12 rounded-xl bg-[#C90000] text-white flex items-center justify-center hover:bg-[#A80000] transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Variants */}
            <div className="rounded-[12px] border border-[#E5E5E5] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[15px] font-semibold text-[#28293D] flex items-center gap-1.5">
                  <Box className="size-4.5 text-[#28293D]" />
                  {t("Variants")}
                </span>
                <button
                  type="button"
                  onClick={addGroup}
                  className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] border border-[#B28A15] px-3 text-[13px] font-semibold text-[#B28A15] hover:bg-[#FDFBF7]"
                >
                  <Plus className="size-4" />
                  {t("Add Group")}
                </button>
              </div>

              {form.variantGroups.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-[#B28A15] bg-[#FDFBF7] py-5 text-center text-[13px] font-semibold text-[#B28A15]">
                  {t("There are no option sets currently available.")}
                </div>
              ) : (
                <div className="space-y-4">
                  {form.variantGroups.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-[10px] border border-dashed border-[#624F1C] bg-[#F5F0EA4D] p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          value={group.name}
                          onChange={(e) =>
                            updateGroup(group.id, { name: e.target.value })
                          }
                          placeholder={t("Group Name(e.g. Bread Type)")}
                          className="h-10 flex-1 rounded-[8px] border-[#E5E5E5] bg-white px-3 text-[13px] focus-visible:border-primary focus-visible:ring-0"
                        />
                        <label className="flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-[#28293D]">
                          <Checkbox
                            checked={group.required}
                            onCheckedChange={(val) =>
                              updateGroup(group.id, { required: Boolean(val) })
                            }
                            className="size-4.5 rounded-[5px] border-[#8F6900]"
                          />
                          {t("Required")}
                        </label>
                        <button
                          type="button"
                          onClick={() => removeGroup(group.id)}
                          aria-label={t("Remove group")}
                          className="cursor-pointer p-1 text-[#C90000]"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="mt-3 space-y-2">
                        {group.options.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center gap-2"
                          >
                            <Input
                              value={option.name}
                              onChange={(e) =>
                                updateOption(group.id, option.id, {
                                  name: e.target.value,
                                })
                              }
                              placeholder={t("Option name")}
                              className="h-10 flex-1 rounded-[8px] border-[#E5E5E5] bg-white px-3 text-[13px] focus-visible:border-primary focus-visible:ring-0"
                            />
                            <div className="flex h-10 items-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white px-2">
                              <input
                                type="number"
                                min="0"
                                value={option.price}
                                onChange={(e) =>
                                  updateOption(group.id, option.id, {
                                    price: Number(e.target.value) || 0,
                                  })
                                }
                                className="w-10 bg-transparent text-center text-[13px] font-semibold text-[#28293D] focus:outline-none focus:ring-0 border-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  aria-label={t("Increase")}
                                  onClick={() =>
                                    updateOption(group.id, option.id, {
                                      price: option.price + 1,
                                    })
                                  }
                                  className="cursor-pointer text-[#8B8B8B] hover:text-[#28293D]"
                                >
                                  <ChevronUp className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  aria-label={t("Decrease")}
                                  onClick={() =>
                                    updateOption(group.id, option.id, {
                                      price: Math.max(0, option.price - 1),
                                    })
                                  }
                                  className="cursor-pointer text-[#8B8B8B] hover:text-[#28293D]"
                                >
                                  <ChevronDown className="size-3.5" />
                                </button>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeOption(group.id, option.id)}
                              aria-label={t("Remove option")}
                              className="cursor-pointer p-1 text-[#C90000]"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addOption(group.id)}
                        className="mt-2.5 flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold text-primary"
                      >
                        <Plus className="size-3.5" />
                        {t("New Option")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Extras */}
            <div className="rounded-[12px] border border-[#E5E5E5] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[15px] font-semibold text-[#28293D] flex items-center gap-1.5">
                  <Sparkles className="size-4.5 text-[#28293D]" />
                  {language === "ar" ? "الإضافات (Extras)" : t("Extras")}
                </span>
                <button
                  type="button"
                  onClick={addExtra}
                  className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[8px] border border-[#B28A15] px-3 text-[13px] font-semibold text-[#B28A15] hover:bg-[#FDFBF7]"
                >
                  <Plus className="size-4" />
                  {t("Add Extra")}
                </button>
              </div>

              {form.extras.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-[#B28A15] bg-[#FDFBF7] py-5 text-center text-[13px] font-semibold text-[#B28A15]">
                  {t("No extras added yet.")}
                </div>
              ) : (
                <div className="mt-3 rounded-[12px] border border-[#E5E5E5] p-4 bg-[#FAFAF7]/30 space-y-3">
                  {form.extras.map((extra) => (
                    <div
                      key={extra.id}
                      className="flex items-center gap-3"
                    >
                      <Input
                        value={extra.name}
                        onChange={(e) =>
                          updateExtra(extra.id, { name: e.target.value })
                        }
                        placeholder={t("Extra name")}
                        className="h-12 flex-1 rounded-xl border-[#E5E5E5] bg-white px-4.5 text-[14px] focus-visible:border-primary focus-visible:ring-0"
                      />
                      <Input
                        type="number"
                        min="0"
                        value={extra.price === 0 ? "" : extra.price}
                        onChange={(e) =>
                          updateExtra(extra.id, { price: Number(e.target.value) || 0 })
                        }
                        placeholder="0"
                        className="h-12 w-20 rounded-xl border-[#E5E5E5] bg-white px-3 text-[14px] text-center focus-visible:border-primary focus-visible:ring-0"
                      />
                      <label className="flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-[#28293D] shrink-0">
                        <Checkbox
                          checked={extra.active}
                          onCheckedChange={(val) =>
                            updateExtra(extra.id, { active: Boolean(val) })
                          }
                          className="size-5 rounded-[6px] border-[#8F6900]"
                        />
                        {t("Active")}
                      </label>
                      <button
                        type="button"
                        onClick={() => removeExtra(extra.id)}
                        aria-label={t("Remove")}
                        className="h-12 w-12 rounded-xl bg-[#C90000] text-white flex items-center justify-center hover:bg-[#A80000] transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                  ))}
                </div>
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
                disabled={isSaving}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {isSaving
                  ? t("Saving...")
                  : editingProduct
                    ? t("Update Product")
                    : t("Add Product")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
