import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, ChevronRight, Check, CornerDownRight } from "lucide-react";
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
import type { IngredientFormData, Ingredient, Category, Product } from "../types";
import UploadDropzone from "./UploadDropzone";
import OptionRecipeEditor from "./OptionRecipeEditor";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Switch } from "@/shared/components/ui/switch";
import { getRecipe } from "../api/recipeApi";
import type { OptionRecipeItem } from "../types";
import { cn } from "@/lib/utils";

const FORM_ID = "add-ingredient-form";

const INITIAL_FORM: IngredientFormData = {
  name: "",
  description: "",
  barcode: "",
  price: "",
  quantity: "",
  unit: "g",
  extraQuantity: "0",
  recipe: [],
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
  categories?: Category[];
  products?: Product[];
  onSave: (data: IngredientFormData) => void;
}

const AddIngredientDialog = ({
  open,
  onOpenChange,
  isSaving = false,
  editingIngredient,
  categories = [],
  products = [],
  onSave,
}: AddIngredientDialogProps) => {
  const { t, language } = useTranslation();
  const [form, setForm] = useState<IngredientFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof IngredientFormData, string>>
  >({});
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [extraSearchQuery, setExtraSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    const initialExtraTargetIds =
      editingIngredient?.extraTargetProductIds && editingIngredient.extraTargetProductIds.length > 0
        ? editingIngredient.extraTargetProductIds
        : editingIngredient?.extraCategories || [];

    setForm(
      editingIngredient
        ? {
            name: editingIngredient.name,
            description: editingIngredient.description || "",
            barcode: editingIngredient.barcode || "",
            price: String(editingIngredient.price),
            quantity: String(editingIngredient.quantity),
            unit: editingIngredient.unit || "g",
            extraQuantity: String(editingIngredient.extraQuantity ?? "0"),
            recipe: editingIngredient.recipe ?? [],
            imageUrl: editingIngredient.imageUrl,
            imageFile: undefined,
            isExtra: editingIngredient.isExtra ?? false,
            extraCategories: initialExtraTargetIds,
          }
        : INITIAL_FORM,
    );
    setErrors({});
    setIsUnitOpen(false);
    setExtraSearchQuery("");
  }, [open, editingIngredient]);

  useEffect(() => {
    if (open && editingIngredient?.id) {
      getRecipe(editingIngredient.id)
        .then((recipeRes: any) => {
          const recipeObj = recipeRes?.recipe || recipeRes;
          const ingredientsList =
            recipeObj?.ingredients ||
            recipeObj?.recipe?.ingredients ||
            recipeObj?.recipe ||
            [];

          if (Array.isArray(ingredientsList) && ingredientsList.length > 0) {
            const mappedItems: OptionRecipeItem[] = ingredientsList.map((item: any) => {
              const matObj =
                typeof item.productId === "object" && item.productId !== null
                  ? item.productId
                  : typeof item.material === "object" && item.material !== null
                    ? item.material
                    : null;

              const matId = matObj
                ? String(matObj._id || matObj.id || "")
                : String(item.productId || item.material || item.ingredientId || "");

              const matName = matObj?.name || item.name || item.productName || "";
              const matPrice = matObj?.price ?? item.price ?? 0;

              return {
                id: String(item._id || item.id || `r-${Math.random()}`),
                material: matId,
                name: matName,
                price: Number(matPrice) || 0,
                quantity: Number(item.quantity ?? item.amount ?? 1),
                unit: item.unit || "pcs",
                ingredientUnit: item.ingredientUnit || item.unit || "pcs",
              };
            });

            setForm((prev) => ({
              ...prev,
              recipe: mappedItems,
            }));
          }
        })
        .catch((err) => {
          console.warn("Failed to fetch recipe for ingredient:", err);
        });
    }
  }, [open, editingIngredient]);

  useEffect(() => {
    if (open && editingIngredient?.extraTargetProductIds?.length) {
      const catsToExpand: string[] = [];
      availableCategoryObjects.forEach((catObj) => {
        const catProds = getProductsForCategory(catObj.name, catObj.id);
        const hasMatch = catProds.some(
          (p) =>
            editingIngredient.extraTargetProductIds?.includes(p.id) ||
            editingIngredient.extraTargetProductIds?.includes(p.name)
        );
        if (hasMatch) catsToExpand.push(catObj.name);
      });
      if (catsToExpand.length > 0) {
        setExpandedCategories((prev) => Array.from(new Set([...prev, ...catsToExpand])));
      }
    }
  }, [open, editingIngredient, products]);

  const availableCategoryObjects = (categories || []).filter(
    (c) =>
      c.name.toLowerCase() !== "raw ingredient" &&
      c.name.toLowerCase() !== "raw ingredients"
  );

  const availableCategories = availableCategoryObjects.map((c) => c.name);

  const getProductsForCategory = (catName: string, catId?: string) => {
    return products
      .filter((p) => {
        const pCat = String(p.category || "").trim();
        if (!pCat) return false;
        if (catId && pCat === String(catId)) return true;
        if (pCat.toLowerCase() === catName.toLowerCase()) return true;
        return false;
      })
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
      }));
  };

  const set = <K extends keyof IngredientFormData>(
    key: K,
    value: IngredientFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleCategoryExpand = (catName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const toggleCategorySelect = (catName: string, catId?: string) => {
    const catProds = getProductsForCategory(catName, catId);
    const prodIds = catProds.map((p) => p.id);
    const prodNames = catProds.map((p) => p.name);
    const isSelected =
      form.extraCategories.includes(catName) ||
      (catProds.length > 0 &&
        catProds.every(
          (p) =>
            form.extraCategories.includes(p.id) ||
            form.extraCategories.includes(p.name)
        ));

    if (isSelected) {
      set(
        "extraCategories",
        form.extraCategories.filter(
          (c) => c !== catName && !prodIds.includes(c) && !prodNames.includes(c)
        )
      );
    } else {
      set(
        "extraCategories",
        Array.from(new Set([...form.extraCategories, catName, ...prodIds]))
      );
    }
  };

  const toggleItemSelect = (prod: { id: string; name: string }, parentCat: string, parentId?: string) => {
    const isSelected =
      form.extraCategories.includes(prod.id) ||
      form.extraCategories.includes(prod.name);

    let updated: string[];
    if (isSelected) {
      updated = form.extraCategories.filter((c) => c !== prod.id && c !== prod.name);
    } else {
      updated = [...form.extraCategories, prod.id];
    }
    const catProds = getProductsForCategory(parentCat, parentId);
    const allProdIds = catProds.map((p) => p.id);
    const hasAllProds =
      allProdIds.length > 0 &&
      allProdIds.every(
        (pId) =>
          updated.includes(pId) ||
          catProds.some((p) => p.id === pId && updated.includes(p.name))
      );

    if (hasAllProds && !updated.includes(parentCat)) {
      updated.push(parentCat);
    } else if (!hasAllProds && updated.includes(parentCat)) {
      updated = updated.filter((c) => c !== parentCat);
    }
    set("extraCategories", updated);
  };

  const isAllExtraSelected =
    availableCategories.length > 0 &&
    availableCategories.every((catName) => form.extraCategories.includes(catName));

  const toggleAllExtras = () => {
    if (isAllExtraSelected) {
      set("extraCategories", []);
    } else {
      const allItems: string[] = [...availableCategories];
      availableCategoryObjects.forEach((c) => {
        getProductsForCategory(c.name, c.id).forEach((p) => allItems.push(p.name));
      });
      set("extraCategories", Array.from(new Set(allItems)));
    }
  };

  const computeExtraTargetProductIds = (): string[] => {
    if (!form.isExtra || form.extraCategories.length === 0) return [];

    const targetIds = new Set<string>();

    form.extraCategories.forEach((item) => {
      const matchingProd = products.find(
        (p) => p.id === item || p.name.toLowerCase() === item.toLowerCase()
      );
      if (matchingProd) {
        targetIds.add(matchingProd.id);
      } else {
        const matchingCatObj = availableCategoryObjects.find(
          (c) => c.id === item || c.name.toLowerCase() === item.toLowerCase()
        );
        if (matchingCatObj) {
          const catProds = getProductsForCategory(matchingCatObj.name, matchingCatObj.id);
          catProds.forEach((p) => targetIds.add(p.id));
        }
      }
    });

    return Array.from(targetIds);
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

    const extraTargetProductIds = computeExtraTargetProductIds();
    onSave({
      ...form,
      extraQuantity: form.extraQuantity || "0",
      extraTargetProductIds,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-150"
      >
        {isUnitOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

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

              <div>
                <InputField
                  data={{
                    id: "ingredient-description",
                    label: {
                      htmlFor: "ingredient-description",
                      labelText: t("Description"),
                    },
                    placeholder: t("Description"),
                    inputProps: {
                      value: form.description,
                      onChange: (e) => set("description", e.target.value),
                    },
                  }}
                />
              </div>
            </div>

            <InputField
              data={{
                id: "ingredient-barcode",
                label: {
                  htmlFor: "ingredient-barcode",
                  labelText: t("Barcode"),
                },
                placeholder: t("Barcode"),
                inputProps: {
                  value: form.barcode,
                  onChange: (e) => set("barcode", e.target.value),
                },
              }}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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

              <div className="flex flex-col">
                <Label
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Price Unit")}
                </Label>
                <DropdownSelect
                  options={[
                    { value: "ml", label: "ml" },
                    { value: "g", label: "g" },
                    { value: "kg", label: "kg" },
                    { value: "L", label: "L" },
                    { value: "pcs", label: "pcs" },
                  ]}
                  selected={form.unit}
                  onSelect={(val) => set("unit", val)}
                  onOpenChange={setIsUnitOpen}
                  align="start"
                  className="w-full md:w-full sm:w-full h-12.5 rounded-xl font-normal text-[#23252A]"
                  contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:w-[var(--radix-dropdown-menu-trigger-width)]"
                />
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

            {/* Recipe / Ingredients (Optional) */}
            <div className="flex flex-col">
              <Label className="mb-2.5 text-[16px] font-medium text-black">
                {t("Recipe/Ingredients")}{" "}
                <span className="text-[13px] font-normal text-[#8B8B8B]">
                  {t("(Optional)")}
                </span>
              </Label>
              <OptionRecipeEditor
                recipe={form.recipe || []}
                onChange={(newRecipe) => set("recipe", newRecipe)}
                ingredients={products}
                categories={categories}
                placeholder={language === "ar" ? "اختر وصفة / مكون" : "Select a reciepe"}
                showSubtext={false}
                inputPosition="bottom"
              />
            </div>

            {/* Add as Extra section matching Figma specification */}
            <div className="flex flex-col gap-[18px] rounded-[16px] border border-[#CACBD4] bg-[#FAFAF7] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-medium text-[#333333] tracking-[0.32px]">
                  {t("Add as extra")}
                </span>
                <Switch
                  checked={form.isExtra}
                  onCheckedChange={(checked) => set("isExtra", checked)}
                />
              </div>

              {form.isExtra && (
                <>
                  {/* Extra initial quantity Card matching Figma */}
                  <div className="flex flex-col gap-2 rounded-[16px] border border-[#CACBD4] bg-[#F5F0EA] p-3 text-start">
                    <div className="flex flex-col gap-[10px]">
                      <span className="text-[13px] font-medium text-[#23252A]">
                        {t("Extra initial quantity")}
                      </span>
                      <div className="flex flex-col gap-1">
                        <div className="flex h-[50px] w-full items-center justify-between gap-3 rounded-[12px] border border-[#E5E5E5] bg-white px-3">
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="number"
                              min="0"
                              value={form.extraQuantity ?? "0"}
                              onChange={(e) => set("extraQuantity", e.target.value)}
                              style={{ width: `${Math.max(1, (form.extraQuantity || "0").length) * 11 + 6}px` }}
                              className="bg-transparent text-[16px] font-normal text-black outline-none focus:ring-0 border-0 p-0 text-start [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="0"
                            />
                            <span className="text-[16px] font-normal text-black">
                              {form.unit || "ml"}
                            </span>
                          </div>
                          <div className="flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => {
                                const currentVal = Number(form.extraQuantity || "0") || 0;
                                set("extraQuantity", String(currentVal + 1));
                              }}
                              className="cursor-pointer text-[#8B8B8B] hover:text-black"
                            >
                              <ChevronUp className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const currentVal = Number(form.extraQuantity || "0") || 0;
                                set("extraQuantity", String(Math.max(0, currentVal - 1)));
                              }}
                              className="cursor-pointer text-[#8B8B8B] hover:text-black"
                            >
                              <ChevronDown className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        <span className="text-[10px] font-normal text-[#8B8B8B] leading-[22px] tracking-[0.10px]">
                          {t(
                            "Set the amount used each time this extra is added. This will be used as the initial quantity for this item."
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Categories Box with dashed gold border */}
                  <div className="border-dashed-gold bg-[#FAFAF7] p-4 flex flex-col gap-2 text-start">
                    <span className="text-[12px] font-normal text-black tracking-[0.24px]">
                      {t("Categories")}
                    </span>

                    <div className="flex flex-col gap-[14px] w-full">
                      {/* Search Bar */}
                      <div className="flex h-[37px] w-full items-center gap-[10px] rounded-[8px] border border-[#CACBD4] bg-white px-3.5">
                        <Search className="size-4 shrink-0 text-[#8B8B8B]" />
                        <input
                          type="text"
                          value={extraSearchQuery}
                          onChange={(e) => setExtraSearchQuery(e.target.value)}
                          placeholder={t("Search products...")}
                          className="w-full bg-transparent text-[14px] font-normal text-black placeholder:text-[#8B8B8B] outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-2 pb-4">
                        {/* All option */}
                        <div className="flex items-center justify-between py-1">
                          <div
                            onClick={toggleAllExtras}
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            <div
                              className={cn(
                                "flex size-[19.98px] items-center justify-center rounded-[5.99px] border transition-all cursor-pointer",
                                isAllExtraSelected
                                  ? "border-[#8F6900] bg-[#8F6900] text-white shadow-sm ring-4 ring-[#624F1C]/10"
                                  : "border-[#8F6900] bg-white shadow-sm"
                              )}
                            >
                              {isAllExtraSelected && <Check className="size-3.5 stroke-[3]" />}
                            </div>
                            <span className="text-[14px] font-semibold text-[#333333] tracking-[0.28px]">
                              {t("All")}
                            </span>
                          </div>
                        </div>

                        <div className="w-full border-t border-[#CACBD4] my-1" />

                    {/* Categories list */}
                    {availableCategoryObjects.map((catObj, catIdx) => {
                      const catName = catObj.name;
                      const catId = catObj.id;
                      const rawProds = getProductsForCategory(catName, catId);
                      const isCatSelected = form.extraCategories.includes(catName);
                      const isExpanded = expandedCategories.includes(catName) || extraSearchQuery.trim() !== "";

                      const filteredProds = extraSearchQuery.trim()
                        ? rawProds.filter((p) => p.name.toLowerCase().includes(extraSearchQuery.toLowerCase()))
                        : rawProds;

                      if (extraSearchQuery.trim() && filteredProds.length === 0 && !catName.toLowerCase().includes(extraSearchQuery.toLowerCase())) {
                        return null;
                      }

                      return (
                        <div key={catName} className="flex flex-col gap-1">
                          {catIdx > 0 && <div className="w-full border-t border-[#CACBD4] my-1" />}

                          {/* Category Header Row */}
                          <div
                            onClick={() => toggleCategoryExpand(catName)}
                            className="flex items-center justify-between py-1 cursor-pointer hover:bg-black/5 rounded-md px-1 transition-colors"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCategorySelect(catName, catId);
                                }}
                                className={cn(
                                  "flex size-[19.98px] items-center justify-center rounded-[5.99px] border transition-all cursor-pointer",
                                  isCatSelected
                                    ? "border-[#8F6900] bg-[#8F6900] text-white shadow-sm ring-4 ring-[#624F1C]/10"
                                    : "border-[#8F6900] bg-white shadow-sm"
                                )}
                              >
                                {isCatSelected && <Check className="size-3.5 stroke-[3]" />}
                              </div>
                              <span className="text-[14px] font-semibold text-black tracking-[0.28px]">
                                {catName}
                              </span>
                            </div>
                            <div className="p-1 text-black">
                              {isExpanded ? (
                                <ChevronDown className="size-4 text-black" />
                              ) : (
                                <ChevronRight className="size-4 text-black" />
                              )}
                            </div>
                          </div>

                          {/* Sub-products Accordion */}
                          {isExpanded && filteredProds.length > 0 && (
                            <div className="ps-3 pt-1 pb-2 flex flex-col gap-2">
                              {filteredProds.map((prod, idx) => {
                                const isProdSelected =
                                  form.extraCategories.includes(prod.id) ||
                                  form.extraCategories.includes(prod.name);
                                return (
                                  <div key={prod.id || idx} className="flex flex-col gap-2">
                                    {idx > 0 && <div className="w-full border-t border-[#E5E5E5]/60" />}
                                    <div className="flex items-center justify-between w-full">
                                      <div
                                        onClick={() => toggleItemSelect(prod, catName, catId)}
                                        className="flex items-center gap-2 cursor-pointer flex-1"
                                      >
                                        <CornerDownRight className="size-3.5 text-[#595959] shrink-0" />
                                        <div
                                          className={cn(
                                            "flex size-4 items-center justify-center rounded-[4.8px] border transition-all cursor-pointer",
                                            isProdSelected
                                              ? "border-[#8F6900] bg-[#8F6900] text-white shadow-sm ring-4 ring-[#624F1C]/10"
                                              : "border-[#8F6900] bg-white shadow-sm"
                                          )}
                                        >
                                          {isProdSelected && <Check className="size-2.5 stroke-[3]" />}
                                        </div>
                                        <span
                                          className={cn(
                                            "text-[13px] tracking-[0.26px]",
                                            isProdSelected ? "font-semibold text-[#333333]" : "font-medium text-[#595959]"
                                          )}
                                        >
                                          {prod.name}
                                        </span>
                                      </div>
                                      <div className="text-[13px] text-black" dir="ltr">
                                        <span className="font-medium text-black">EGP </span>
                                        <span className="font-bold text-black">{Number(prod.price).toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
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
