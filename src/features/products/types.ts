export type ProductsTab = "products" | "recipes" | "categories";

// --- Products ---------------------------------------------------------------

export type ProductDiscountType = "fixed" | "percentage";

export interface ProductDiscount {
  type: ProductDiscountType;
  /** Fixed → the discounted price in EGP. Percentage → the percent off. */
  value: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  price: number;
  discount?: ProductDiscount;
  available: boolean;
}

// --- Ingredients (Recipes tab) ---------------------------------------------

export interface Ingredient {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  unit: string;
  isExtra?: boolean;
  extraCategories?: string[];
}

// --- Categories -------------------------------------------------------------

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  itemCount: number;
  active: boolean;
}

// --- Add Product form -------------------------------------------------------

export interface VariantOption {
  id: string;
  name: string;
  price: number;
}

export interface VariantGroup {
  id: string;
  name: string;
  required: boolean;
  options: VariantOption[];
}

export interface RecipeIngredient {
  ingredientId: number;
  name: string;
  amount: number;
  unit: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  barcode: string;
  price: string;
  quantity: string;
  imageUrl?: string;
  variantGroups: VariantGroup[];
  ingredients: RecipeIngredient[];
}

// --- Add Ingredient form ----------------------------------------------------

export interface IngredientFormData {
  name: string;
  description: string;
  barcode: string;
  price: string;
  quantity: string;
  imageUrl?: string;
  isExtra: boolean;
  extraCategories: string[];
}

// --- Add Category form ------------------------------------------------------

export interface CategoryFormData {
  name: string;
  imageUrl?: string;
}

// --- Send WhatsApp message --------------------------------------------------

export type WhatsAppMode = "random" | "select";

export interface CustomerContact {
  id: number;
  name: string;
  phone: string;
}
