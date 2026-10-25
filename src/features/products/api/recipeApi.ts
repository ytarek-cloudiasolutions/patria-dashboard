import { api } from "@/config/api";

export interface RecipeIngredient {
  productId: string;
  quantity: number;
  unit: string;
  // populated from backend
  product?: { _id: string; name: string; stockQty: number };
}

export interface Recipe {
  _id?: string;
  productId: string;
  ingredients: RecipeIngredient[];
  notes?: string;
}

export interface RecipeItem {
  id: string;
  material: string;
  name: string;
  quantity: number;
  unit: string;
}

/** Normalizes the many shapes the recipes API can return into a flat list. */
export const mapRecipeItems = (recipeRes: any): RecipeItem[] => {
  const recipeObj = recipeRes?.recipe || recipeRes;
  const ingredientsList =
    recipeObj?.ingredients ||
    recipeObj?.recipe?.ingredients ||
    (Array.isArray(recipeObj) ? recipeObj : []);

  if (!Array.isArray(ingredientsList)) return [];

  return ingredientsList.map((item: any, index: number) => {
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

    return {
      id: String(item._id || item.id || matId || `r-${index}`),
      material: matId,
      name: matName,
      quantity: Number(item.quantity ?? item.amount ?? 0),
      unit: item.unit || item.ingredientUnit || "g",
    };
  });
};

export const getRecipe = async (productId: string): Promise<Recipe | null> => {
  const res = await api.get<any>(`/recipes/${productId}`);
  return res.data?.data?.recipe || res.data?.recipe || res.data || null;
};

/**
 * Fetches the recipe for a product and returns its ingredient rows.
 * Returns an empty array when the product has no recipe (or the request fails),
 * so callers can always render safely.
 */
export const getRecipeItems = async (
  productId: string,
): Promise<RecipeItem[]> => {
  try {
    const recipe = await getRecipe(productId);
    return mapRecipeItems(recipe);
  } catch (error) {
    console.warn("Failed to fetch recipe items:", error);
    return [];
  }
};

export const saveRecipe = async (
  productId: string,
  data: { ingredients: RecipeIngredient[]; notes?: string },
): Promise<Recipe> => {
  const res = await api.post<any>(`/recipes/${productId}`, data);
  return res.data?.data?.recipe || res.data?.recipe || res.data || null;
};

export const deleteRecipe = async (productId: string): Promise<void> => {
  await api.delete(`/recipes/${productId}`);
};
