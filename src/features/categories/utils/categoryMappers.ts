import type { Category, GetCategoryResponseItem } from "../store/categoryTypes";

export const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80";

export const mapCategory = (backendCat: any): Category => {
  return {
    id: backendCat._id || backendCat.id,
    name: backendCat.name,
    imageUrl: backendCat.image || backendCat.imageUrl || DEFAULT_CATEGORY_IMAGE,
    itemCount: backendCat.productsCount ?? backendCat.itemCount ?? 0,
    active: backendCat.isActive ?? backendCat.active ?? true,
  };
};

export const mapCategories = (backendCats: any[]): Category[] => {
  return (backendCats || []).map(mapCategory);
};
