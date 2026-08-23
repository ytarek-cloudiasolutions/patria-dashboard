import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, PlusCircle, Box, BadgePlus, Layers, ListPlus, Sparkles } from "lucide-react";
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
import { api } from "@/config/api";
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
import OptionRecipeEditor from "./OptionRecipeEditor";
import { getRecipe } from "../api/recipeApi";

const FORM_ID = "add-product-form";

let uid = 0;
const nextId = () => `v${++uid}`;

const emptyOption = (): VariantOption => ({
  id: nextId(),
  name: "",
  price: 0,
  recipe: [],
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
  productType: "ready",
  imageUrl: undefined,
  imageFile: undefined,
  variantGroups: [],
  ingredients: [],
  recipe: [],
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
  const [isItemTypeOpen, setIsItemTypeOpen] = useState(false);
  const [openRecipeKey, setOpenRecipeKey] = useState<string | null>(null);

  const [recipeSearch, setRecipeSearch] = useState("");
  const [recipeSearchResults, setRecipeSearchResults] = useState<any[]>([]);
  const [isSearchingRecipes, setIsSearchingRecipes] = useState(false);

  useEffect(() => {
    if (!recipeSearch.trim()) {
      setRecipeSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingRecipes(true);
      try {
        const rawIngredientCategory = categories.find(
          (c) => c.name.toLowerCase() === "raw ingredients"
        );
        const categoryId = rawIngredientCategory
          ? rawIngredientCategory.id
          : "6a3927888bbe5f4d11bde590";

        const response = await api.get("/products", {
          params: {
            search: recipeSearch.trim(),
            category: categoryId,
            limit: 20,
          },
        });
        const fetchedData =
          response.data?.products || response.data?.data || response.data || [];
        setRecipeSearchResults(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (err) {
        console.error("Failed to search recipe products:", err);
      } finally {
        setIsSearchingRecipes(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [recipeSearch, categories]);

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
            barcode: editingProduct.barcode || "",
            price: String(editingProduct.price),
            imageUrl: editingProduct.imageUrl,
            extras: editingProduct.extras ?? [],
            variantGroups: editingProduct.variantGroups ?? [],
            recipe: editingProduct.recipe ?? [],
            productType: editingProduct.productType ?? "ready",
          }
        : INITIAL_FORM,
    );
    setErrors({});
    setIsCategoryOpen(false);
    setIsRecipeOpen(false);
    setIsItemTypeOpen(false);

    if (editingProduct?.id) {
      getRecipe(editingProduct.id)
        .then((recipeRes: any) => {
          const recipeObj = recipeRes?.recipe || recipeRes;
          const ingredientsList = recipeObj?.ingredients || recipeObj?.recipe?.ingredients || [];

          if (Array.isArray(ingredientsList) && ingredientsList.length > 0) {
            const mappedRecipe = ingredientsList.map((ing: any) => {
              const matObj =
                typeof ing.productId === "object" && ing.productId !== null
                  ? ing.productId
                  : typeof ing.material === "object" && ing.material !== null
                    ? ing.material
                    : {};
              const matId = String(
                matObj._id ||
                  matObj.id ||
                  (typeof ing.productId === "string" ? ing.productId : "") ||
                  (typeof ing.material === "string" ? ing.material : "") ||
                  ""
              );
              const localIng = ingredients.find(
                (item) => String(item.id) === String(matId)
              );
              const matName = ing.name || matObj.name || localIng?.name || "";
              const matPrice = Number(
                ing.price ?? matObj.price ?? localIng?.price ?? 0
              );

              return {
                id: String(ing._id || ing.id || ""),
                material: matId,
                name: matName,
                price: matPrice,
                quantity: Number(ing.quantity || ing.amount || 0),
                unit: ing.unit || "pcs",
                ingredientUnit: ing.unit || "pcs",
              };
            });
            setForm((prev) => ({ ...prev, recipe: mappedRecipe }));
          }
        })
        .catch((err) => {
          console.error("Failed to fetch product recipe:", err);
        });
    }
  }, [open, editingProduct, categories, ingredients]);

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
      form.variantGroups.filter((g) => String(g.id) !== String(groupId)),
    );

  const updateGroup = (groupId: string, patch: Partial<VariantGroup>) =>
    set(
      "variantGroups",
      form.variantGroups.map((g) =>
        String(g.id) === String(groupId) ? { ...g, ...patch } : g,
      ),
    );

  const addOption = (groupId: string) =>
    set(
      "variantGroups",
      form.variantGroups.map((g) =>
        String(g.id) === String(groupId) ? { ...g, options: [...g.options, emptyOption()] } : g,
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
        String(g.id) === String(groupId)
          ? {
              ...g,
              options: g.options.map((o) =>
                String(o.id) === String(optionId) ? { ...o, ...patch } : o,
              ),
            }
          : g,
      ),
    );

  const removeOption = (groupId: string, optionId: string) =>
    set(
      "variantGroups",
      form.variantGroups.map((g) =>
        String(g.id) === String(groupId)
          ? { ...g, options: g.options.filter((o) => String(o.id) !== String(optionId)) }
          : g,
      ),
    );

  // --- Recipe ingredients ---------------------------------------------------

  const recipeSourceList = recipeSearch.trim()
    ? recipeSearchResults
    : ingredients;

  const addIngredient = (value: string) => {
    const ingredient =
      recipeSourceList.find((i: any) => String(i._id || i.id) === value) ||
      ingredients.find((i: any) => String(i._id || i.id) === value);
    if (!ingredient) return;

    const ingId = String(ingredient._id || ingredient.id);
    if (form.ingredients.some((i) => String(i.ingredientId) === ingId)) return;

    set("ingredients", [
      ...form.ingredients,
      {
        ingredientId: ingId,
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

  const ingredientOptions = recipeSourceList.map((i: any) => ({
    label: i.name,
    value: String(i._id || i.id),
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-160"
      >
        {(isCategoryOpen || isRecipeOpen || isItemTypeOpen) && (
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

              <div className="flex flex-col gap-2.5">
                <Label className="text-[16px] font-medium text-black">
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

            <div className="flex flex-col gap-2.5">
              <Label className="text-[16px] font-medium text-black">
                {t("Item Type")}
              </Label>
              <DropdownSelect
                options={[
                  { value: "ready", label: t("Ready-made (sold directly)") },
                  { value: "manufactured", label: t("Manufactured (from components – automatically deducted)") },
                  { value: "manufactured_work_order", label: t("Manufactured via work order") },
                  { value: "raw_material", label: t("Raw materials") },
                  { value: "service", label: t("Service") },
                ]}
                selected={form.productType}
                onSelect={(value) => set("productType", value)}
                onOpenChange={setIsItemTypeOpen}
                placeholder={t("Select item type")}
                align="start"
                className="md:w-full"
                contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <Label
                htmlFor="product-description"
                className="text-[16px] font-medium text-black"
              >
                {t("Description")}<span className="text-[#C90000]">*</span>
              </Label>
              <Textarea
                id="product-description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder={t("Describe this product...")}
                className="min-h-20 rounded-xl border-[#E5E5E5] px-4.5 py-3 text-[16px] text-[#23252A] placeholder:text-[#8B8B8B] placeholder:text-[16px] focus-visible:border-primary focus-visible:ring-0"
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
              <Label className="mb-2.5 text-[13px] font-medium text-black">
                {t("Recipe/Ingredients")}{" "}
                <span className="text-[13px] font-medium text-[#595959]">
                  {t("(Optional)")}
                </span>
              </Label>
              <OptionRecipeEditor
                recipe={form.recipe || []}
                onChange={(newRecipe) => set("recipe", newRecipe)}
                ingredients={ingredients}
                categories={categories}
                placeholder={language === "ar" ? "اختر وصفة / مكون" : "Select a reciepe"}
                showSubtext={false}
                inputPosition="top"
              />
            </div>

            {/* Variants */}
            <div className="rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#333333] flex items-center gap-1">
                  <Box className="size-4.5 text-[#333333]" />
                  {t("Variants")}
                </span>
                <button
                  type="button"
                  onClick={addGroup}
                  className="flex h-[36px] cursor-pointer items-center gap-1.5 rounded-[5px] border border-[#8F6900] px-3 text-[12px] font-semibold text-[#8F6900] hover:bg-[#FDFBF7]"
                >
                  <Plus className="size-4 text-[#8F6900]" />
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
                      className="border-dashed-gold bg-white p-3 sm:p-4 space-y-3"
                    >
                      {/* Group Header Row */}
                      <div className="flex items-center gap-2.5">
                        <Input
                          value={group.name}
                          onChange={(e) =>
                            updateGroup(group.id, { name: e.target.value })
                          }
                          placeholder={t("Group Name(e.g. Bread Type)")}
                          className="h-[50px] flex-1 rounded-[12px] border-[#E5E5E5] bg-white px-3.5 text-[16px] font-normal text-black focus-visible:border-[#8F6900] focus-visible:ring-0"
                        />
                        <label className="flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-[#333333] shrink-0">
                          <Checkbox
                            checked={group.required}
                            onCheckedChange={(val) =>
                              updateGroup(group.id, { required: Boolean(val) })
                            }
                            className="size-[20px] rounded-[6px] border-[#8F6900]"
                          />
                          {t("Required")}
                        </label>
                        <button
                          type="button"
                          onClick={() => removeGroup(group.id)}
                          aria-label={t("Remove group")}
                          className="cursor-pointer p-1 text-[#C90000]"
                        >
                          <Trash2 className="size-4.5" />
                        </button>
                      </div>

                      {/* Options with Vertical Gold Accent Bar */}
                      <div className="flex gap-2.5 w-full ps-1">
                        <div className="w-1 self-stretch rounded-full bg-[#8F6900] shrink-0" />
                        <div className="flex-1 flex flex-col gap-2.5">
                          {group.options.map((option) => {
                            const optionRecipeKey = `opt-${group.id}-${option.id}`;
                            const isRecipeOpen = openRecipeKey === optionRecipeKey;
                            const recipeCount = option.recipe?.length || 0;

                            return (
                              <div key={option.id} className="flex flex-col gap-2">
                                <div className="flex items-center gap-2.5">
                                  <Input
                                    value={option.name}
                                    onChange={(e) =>
                                      updateOption(group.id, option.id, {
                                        name: e.target.value,
                                      })
                                    }
                                    placeholder={t("Option name")}
                                    className="h-[50px] flex-1 rounded-[12px] border-[#E5E5E5] bg-white px-3.5 text-[16px] font-normal text-black focus-visible:border-[#8F6900] focus-visible:ring-0"
                                  />
                                  <div className="flex h-[50px] w-[93px] min-w-[93px] items-center justify-between rounded-[12px] border border-[#E5E5E5] bg-white px-3">
                                    <input
                                      type="number"
                                      min="0"
                                      value={option.price}
                                      onChange={(e) =>
                                        updateOption(group.id, option.id, {
                                          price: Number(e.target.value) || 0,
                                        })
                                      }
                                      className="w-10 bg-transparent text-center text-[16px] font-normal text-black focus:outline-none focus:ring-0 border-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                                        className="cursor-pointer text-[#333333] hover:text-black"
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
                                        className="cursor-pointer text-[#333333] hover:text-black"
                                      >
                                        <ChevronDown className="size-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Recipe Button */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenRecipeKey(
                                        isRecipeOpen ? null : optionRecipeKey
                                      )
                                    }
                                    className={cn(
                                      "h-[40px] px-3.5 text-[16px] font-semibold rounded-[5px] border transition-colors flex items-center gap-1.5 cursor-pointer shrink-0",
                                      isRecipeOpen
                                        ? "bg-[#8F6900] text-white border-[#8F6900]"
                                        : "bg-[#F5F0EA] text-[#8F6900] border-[#8F6900] hover:bg-[#EFE8DE]"
                                    )}
                                  >
                                    {language === "ar" ? "وصفة" : t("Recipe")}
                                    {recipeCount > 0 && ` (${recipeCount})`}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => removeOption(group.id, option.id)}
                                    aria-label={t("Remove option")}
                                    className="cursor-pointer p-1 text-[#C90000]"
                                  >
                                    <Trash2 className="size-4.5" />
                                  </button>
                                </div>

                                {/* Option Recipe Editor Container */}
                                {isRecipeOpen && (
                                  <div className="w-full rounded-[16px] border border-[#E5E5E5] bg-[#F5F0EA] p-3 text-start flex flex-col gap-2">
                                    <OptionRecipeEditor
                                      recipe={option.recipe || []}
                                      onChange={(newRecipe) =>
                                        updateOption(group.id, option.id, {
                                          recipe: newRecipe,
                                        })
                                      }
                                      ingredients={ingredients}
                                      categories={categories}
                                      placeholder={language === "ar" ? "أضف مكون / وصفة" : "Add reciepe"}
                                      showSubtext={true}
                                      inputPosition="bottom"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          <button
                            type="button"
                            onClick={() => addOption(group.id)}
                            className="mt-1 flex h-[40px] cursor-pointer items-center justify-center gap-1.5 rounded-[5px] text-[12px] font-semibold text-[#8F6900] hover:bg-[#FDFBF7]"
                          >
                            <Plus className="size-3.5 text-[#8F6900]" />
                            {t("New Option")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Extras */}
            <div className="rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#333333] flex items-center gap-1.5">
                  <Sparkles className="size-5 text-[#333333]" />
                  {language === "ar" ? "الإضافات (Extras)" : t("Extras")}
                </span>
                <button
                  type="button"
                  onClick={addExtra}
                  className="flex h-[36px] cursor-pointer items-center gap-1.5 rounded-[5px] border border-[#8F6900] px-3 text-[12px] font-semibold text-[#8F6900] hover:bg-[#FDFBF7]"
                >
                  <Plus className="size-4 text-[#8F6900]" />
                  {t("Add Extra")}
                </button>
              </div>

              {form.extras.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-[#B28A15] bg-[#FDFBF7] py-5 text-center text-[13px] font-semibold text-[#B28A15]">
                  {t("No extras added yet.")}
                </div>
              ) : (
                <div className="space-y-4">
                  {form.extras.map((extra) => {
                    const extraRecipeKey = `ext-${extra.id}`;
                    const isExtraRecipeOpen = openRecipeKey === extraRecipeKey;
                    const extraRecipeCount = extra.recipe?.length || 0;

                    return (
                      <div
                        key={extra.id}
                        className="border-dashed-gold bg-white p-3.5 sm:p-4 flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <Input
                            value={extra.name}
                            onChange={(e) =>
                              updateExtra(extra.id, { name: e.target.value })
                            }
                            placeholder={t("Extra name")}
                            className="h-[50px] flex-1 rounded-[12px] border-[#E5E5E5] bg-white px-3.5 text-[14px] font-normal text-[#28293D] focus-visible:border-primary focus-visible:ring-0"
                          />
                          <div className="flex h-[50px] items-center gap-2 rounded-[12px] border border-[#E5E5E5] bg-white px-3">
                            <input
                              type="number"
                              min="0"
                              value={extra.price}
                              onChange={(e) =>
                                updateExtra(extra.id, {
                                  price: Number(e.target.value) || 0,
                                })
                              }
                              className="w-10 bg-transparent text-center text-[15px] font-normal text-[#28293D] focus:outline-none focus:ring-0 border-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <div className="flex flex-col">
                              <button
                                type="button"
                                aria-label={t("Increase")}
                                onClick={() =>
                                  updateExtra(extra.id, {
                                    price: extra.price + 1,
                                  })
                                }
                                className="cursor-pointer text-[#333333] hover:text-black"
                              >
                                <ChevronUp className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                aria-label={t("Decrease")}
                                onClick={() =>
                                  updateExtra(extra.id, {
                                    price: Math.max(0, extra.price - 1),
                                  })
                                }
                                className="cursor-pointer text-[#333333] hover:text-black"
                              >
                                <ChevronDown className="size-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Recipe Button for Extras */}
                          <button
                            type="button"
                            onClick={() =>
                              setOpenRecipeKey(
                                isExtraRecipeOpen ? null : extraRecipeKey
                              )
                            }
                            className={cn(
                              "h-[40px] px-3.5 text-[13px] font-semibold rounded-[5px] border transition-colors flex items-center gap-1.5 cursor-pointer shrink-0",
                              isExtraRecipeOpen
                                ? "bg-[#8F6900] text-white border-[#8F6900]"
                                : extraRecipeCount > 0
                                  ? "bg-[#F5F0EA] text-[#8F6900] border-[#8F6900]"
                                  : "bg-[#F5F0EA] text-[#8F6900] border-[#8F6900] hover:bg-[#EFE8DE]"
                            )}
                          >
                            {language === "ar" ? "وصفة" : t("Recipe")}
                            {extraRecipeCount > 0 && ` (${extraRecipeCount})`}
                          </button>

                          <label className="flex cursor-pointer items-center gap-1.5 text-[12px] font-medium text-[#333333] shrink-0 px-1">
                            <Checkbox
                              checked={extra.active}
                              onCheckedChange={(val) =>
                                updateExtra(extra.id, { active: Boolean(val) })
                              }
                              className="size-[20px] rounded-[6px] border-[#8F6900]"
                            />
                            {t("Active")}
                          </label>
                          <button
                            type="button"
                            onClick={() => removeExtra(extra.id)}
                            aria-label={t("Remove")}
                            className="cursor-pointer p-1 text-[#C90000]"
                          >
                            <Trash2 className="size-4.5" />
                          </button>
                        </div>

                        {/* Extra Recipe Editor */}
                        {isExtraRecipeOpen && (
                          <div className="w-full rounded-[16px] border border-[#E5E5E5] bg-[#F5F0EA] p-3 text-start flex flex-col gap-2">
                            <OptionRecipeEditor
                              recipe={extra.recipe || []}
                              onChange={(newRecipe) =>
                                updateExtra(extra.id, { recipe: newRecipe })
                              }
                              ingredients={ingredients}
                              categories={categories}
                              placeholder={language === "ar" ? "أضف مكون / وصفة" : "Add reciepe"}
                              showSubtext={true}
                              inputPosition="bottom"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
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
