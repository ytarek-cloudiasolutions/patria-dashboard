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
  nameAr?: string;
  description: string;
  descriptionAr?: string;
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
  extraQuantity?: number;
  barcode?: string;
  showInApp?: boolean;
  showInPos?: boolean;
  isInfiniteStock?: boolean;
}

// --- Ingredients (Recipes tab) ---------------------------------------------

export interface Ingredient {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  imageUrl: string;
  price: number;
  quantity: number;
  unit: string;
  recipe?: OptionRecipeItem[];
  isExtra?: boolean;
  isActive?: boolean;
  extraCategories?: string[];
  extraTargetProductIds?: string[];
  extraQuantity?: number;
  barcode?: string;
  productType?: string;
  category?: string;
  categoryId?: string;
}


// --- Categories -------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  imageUrl: string;
  itemCount: number;
  active: boolean;
  kitchenType?: KitchenType;
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
  quantity?: number;
  unit?: string;
  recipe?: OptionRecipeItem[];
  active?: boolean;
  isActive?: boolean;
}

export interface ProductFormData {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  barcode: string;
  price: string;
  discountPrice: string;
  discountType: ProductDiscountType;
  discountValue: string;
  category: string;
  productType: string;
  quantity: string;
  unit: string;
  imageUrl?: string;
  imageFile?: File;
  removeImage?: boolean;
  variantGroups: VariantGroup[];
  ingredients: RecipeIngredient[];
  recipe: OptionRecipeItem[];
  extras: ProductExtra[];
  showInApp: boolean;
  showInPos: boolean;
  isInfiniteStock: boolean;
  /** True when editing an existing product and its real recipe failed to
   * load (network/server error) — `recipe` above is then just the stale
   * initial empty array, not a confirmed "no recipe", so saving must NOT
   * be allowed to overwrite/delete whatever recipe is actually stored. */
  recipeFetchFailed?: boolean;
}

// --- Add Ingredient form ----------------------------------------------------

export interface IngredientFormData {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  barcode: string;
  price: string;
  quantity: string;
  unit: string;
  productType: string;
  extraQuantity?: string;
  imageUrl?: string;
  imageFile?: File;
  removeImage?: boolean;
  recipe?: OptionRecipeItem[];
  isExtra: boolean;
  extraCategories: string[];
  extraTargetProductIds?: string[];
  /** True when editing an existing ingredient and its real recipe failed to
   * load — see ProductFormData.recipeFetchFailed for why this must block
   * sending `recipe` on save. */
  recipeFetchFailed?: boolean;
}

// --- Add Category form ------------------------------------------------------

export type KitchenType = 'barista' | 'pastry' | 'hot_food' | null;

export interface CategoryFormData {
  name: string;
  nameAr?: string;
  imageUrl?: string;
  imageFile?: File;
  removeImage?: boolean;
  kitchenType?: KitchenType;
}

// --- Send WhatsApp message --------------------------------------------------

export type WhatsAppMode = "random" | "select";

export interface CustomerContact {
  id: number;
  name: string;
  phone: string;
}
