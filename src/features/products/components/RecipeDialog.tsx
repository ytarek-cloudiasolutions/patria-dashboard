import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { useProducts } from "../hooks/useProducts";
import {
  getRecipe,
  saveRecipe,
  type RecipeIngredient,
} from "../api/recipeApi";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface RecipeDialogProps {
  open: boolean;
  productId: string;
  productName: string;
  onOpenChange: (open: boolean) => void;
}

const UNIT_OPTIONS = ["g", "ml", "pcs", "kg", "l"];

const emptyRow = (): RecipeIngredient => ({
  productId: "",
  quantity: 1,
  unit: "pcs",
});

const RecipeDialog = ({
  open,
  productId,
  productName,
  onOpenChange,
}: RecipeDialogProps) => {
  const { t } = useTranslation();
  const { products, getProducts } = useProducts();
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    getProducts({ limit: 200 });
    setIsLoading(true);
    getRecipe(productId)
      .then((recipe) => {
        if (recipe) {
          setIngredients(recipe.ingredients || []);
          setNotes(recipe.notes || "");
        } else {
          setIngredients([]);
          setNotes("");
        }
      })
      .catch(() => {
        setIngredients([]);
        setNotes("");
      })
      .finally(() => setIsLoading(false));
  }, [open, productId, getProducts]);

  // Products that can be used as ingredients (exclude the product itself)
  const availableProducts = products.filter((p) => p.id !== productId);

  const addRow = () => setIngredients((prev) => [...prev, emptyRow()]);

  const removeRow = (index: number) =>
    setIngredients((prev) => prev.filter((_, i) => i !== index));

  const updateRow = (index: number, patch: Partial<RecipeIngredient>) =>
    setIngredients((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );

  const handleSave = async () => {
    const validIngredients = ingredients.filter(
      (i) => i.productId && i.quantity > 0,
    );
    setIsSaving(true);
    try {
      await saveRecipe(productId, {
        ingredients: validIngredients,
        notes: notes.trim() || undefined,
      });
      showSuccessToast(t("Recipe saved successfully"));
      onOpenChange(false);
    } catch {
      showErrorToast(t("Failed to save recipe"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-160"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Recipe")} — {productName}
            </DialogTitle>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <span className="text-[14px] text-[#8B8B8B]">
                  {t("Loading...")}
                </span>
              </div>
            ) : (
              <>
                {ingredients.length > 0 && (
                  <div className="space-y-3">
                    {/* Header row */}
                    <div className="hidden sm:flex items-center gap-3 px-1">
                      <span className="flex-1 text-[12px] font-semibold text-[#8B8B8B] uppercase">
                        {t("Ingredient")}
                      </span>
                      <span className="w-24 text-center text-[12px] font-semibold text-[#8B8B8B] uppercase">
                        {t("Qty")}
                      </span>
                      <span className="w-20 text-center text-[12px] font-semibold text-[#8B8B8B] uppercase">
                        {t("Unit")}
                      </span>
                      <span className="w-12" />
                    </div>

                    {ingredients.map((row, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <select
                          value={row.productId}
                          onChange={(e) =>
                            updateRow(index, { productId: e.target.value })
                          }
                          className="flex-1 h-12 rounded-xl border border-[#E5E5E5] bg-white px-3 text-[14px] text-[#28293D] focus:outline-none focus:border-primary cursor-pointer"
                        >
                          <option value="">{t("Select ingredient")}</option>
                          {availableProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          value={row.quantity}
                          onChange={(e) =>
                            updateRow(index, {
                              quantity: Number(e.target.value) || 0,
                            })
                          }
                          className="h-12 w-24 rounded-xl border-[#E5E5E5] text-center focus-visible:border-primary focus-visible:ring-0"
                        />
                        <select
                          value={row.unit}
                          onChange={(e) =>
                            updateRow(index, { unit: e.target.value })
                          }
                          className="h-12 w-20 rounded-xl border border-[#E5E5E5] bg-white px-2 text-[13px] text-[#28293D] focus:outline-none focus:border-primary cursor-pointer"
                        >
                          {UNIT_OPTIONS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          aria-label={t("Remove ingredient")}
                          className="h-12 w-12 rounded-xl bg-[#C90000] text-white flex items-center justify-center hover:bg-[#A80000] transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-2 text-[13px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  <Plus className="size-4" />
                  {t("Add Ingredient")}
                </button>

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-[#28293D]">
                    {t("Notes")}{" "}
                    <span className="text-[#8B8B8B] font-normal text-[13px]">
                      {t("(Optional)")}
                    </span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("Recipe notes...")}
                    rows={3}
                    className="rounded-xl border border-[#E5E5E5] px-4 py-3 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </>
            )}
          </div>

          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary"
              >
                {t("Cancel")}
              </Button>
              <Button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="w-full sm:w-auto text-white"
              >
                {isSaving ? t("Saving...") : t("Save Recipe")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;
