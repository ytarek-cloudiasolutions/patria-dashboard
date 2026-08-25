export type ProductsTab = "products" | "recipes" | "categories";

// --- Products ---------------------------------------------------------------

export type ProductDiscountType = "fixed" | "percentage";

export interface ProductDiscount {
  type: ProductDiscountType;
  /** Fixed → the discounted price in EGP. Percentage → the percent off. */
  value: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  price: number;
  discount?: ProductDiscount;
  available: boolean;
  isActive?: boolean;
  extras?: ProductExtra[];
  variantGroups?: VariantGroup[];
  recipe?: OptionRecipeItem[];
  quantity?: number;
  unit?: string;
  productType?: string;
  isIngredient?: boolean;
  isExtra?: boolean;
  extraTargetProductIds?: string[];
  barcode?: string;
}

// --- Ingredients (Recipes tab) ---------------------------------------------

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  unit: string;
  recipe?: OptionRecipeItem[];
  isExtra?: boolean;
  isActive?: boolean;
  extraCategories?: string[];
  extraTargetProductIds?: string[];
  barcode?: string;
}


// --- Categories -------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  itemCount: number;
  active: boolean;
}

// --- Add Product form -------------------------------------------------------

export interface OptionRecipeItem {
  id?: string;
  material: string; // Raw ingredient product ID
  name: string;
  price: number;
  quantity: number;
  unit: string;
  ingredientUnit?: string;
}

export interface VariantOption {
  id: string;
  name: string;
  price: number;
  recipe?: OptionRecipeItem[];
}

export interface VariantGroup {
  id: string;
  name: string;
  required: boolean;
  options: VariantOption[];
}

export interface RecipeIngredient {
  ingredientId: string;
  name: string;
  amount: number;
  unit: string;
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
  active?: boolean;
  isActive?: boolean;
  quantity?: number;
  unit?: string;
  recipe?: OptionRecipeItem[];
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  barcode: string;
  price: string;
  quantity: string;
  productType: string;
  imageUrl?: string;
  imageFile?: File;
  variantGroups: VariantGroup[];
  ingredients: RecipeIngredient[];
  recipe: OptionRecipeItem[];
  extras: ProductExtra[];
}

// --- Add Ingredient form ----------------------------------------------------

export interface IngredientFormData {
  name: string;
  description: string;
  barcode: string;
  price: string;
  quantity: string;
  unit: string;
  imageUrl?: string;
  imageFile?: File;
  recipe?: OptionRecipeItem[];
  isExtra: boolean;
  extraCategories: string[];
  extraTargetProductIds?: string[];
}

// --- Add Category form ------------------------------------------------------

export type KitchenType = 'barista' | 'pastry' | 'hot_food' | null;

export interface CategoryFormData {
  name: string;
  imageUrl?: string;
  imageFile?: File;
  kitchenType?: KitchenType;
}

// --- Send WhatsApp message --------------------------------------------------

export type WhatsAppMode = "random" | "select";

export interface CustomerContact {
  id: number;
  name: string;
  phone: string;
}
