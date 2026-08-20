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

export const getRecipe = async (productId: string): Promise<Recipe | null> => {
  const res = await api.get<any>(`/recipes/${productId}`);
  return res.data?.data?.recipe || res.data?.recipe || res.data || null;
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
