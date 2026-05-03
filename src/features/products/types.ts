export type ProductStatus = "Available" | "Out Of Stock";

export type ProductTab = "products" | "ingredients" | "categories";

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  status: ProductStatus;
  isActive: boolean;
  imageUrl: string;
  discountLabel?: string;
}

export interface Ingredient {
  id: number;
  name: string;
  description: string;
  category: "Raw Ingredient";
  price: number;
  initialQuantity: number;
  imageUrl: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  imageUrl: string;
  itemCount: number;
  isActive: boolean;
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  status: ProductStatus;
  discountType: string;
  discountValue: string;
  imageUrl: string;
  isActive: boolean;
}

export interface IngredientFormData {
  name: string;
  description: string;
  price: string;
  initialQuantity: string;
  category: "Raw Ingredient";
  imageUrl: string;
}

export interface CategoryFormData {
  name: string;
  imageUrl: string;
}

export interface RecipeSelection {
  id: number;
  name: string;
  quantityLabel: string;
}
