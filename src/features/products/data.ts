import type {
  CategoryFormData,
  Ingredient,
  IngredientFormData,
  Product,
  ProductCategory,
  ProductFormData,
  ProductStatus,
} from "./types";

export const PRODUCT_STATUS_OPTIONS: ProductStatus[] = [
  "Available",
  "Out Of Stock",
];

export const PRODUCT_CATEGORY_OPTIONS = [
  "All Categories",
  "Pastries",
  "Coffee",
  "Sandwiches",
  "Desserts",
  "Drinks",
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Kunafa Tiramsu",
    description: "Rich, bold espresso from single-origin...",
    category: "Pastries",
    price: 85.2,
    status: "Available",
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=80&h=80&fit=crop",
    discountLabel: "EGP 25.00",
  },
  {
    id: 2,
    name: "Eish el Saraya",
    description: "Buttery croissant filled with almond...",
    category: "Pastries",
    price: 85.2,
    status: "Available",
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=80&h=80&fit=crop",
    discountLabel: "30%",
  },
  {
    id: 3,
    name: "Middle Eastern Roast Beef",
    description: "Moist banana bread with toasted walnuts",
    category: "Pastries",
    price: 85.2,
    status: "Out Of Stock",
    isActive: false,
    imageUrl:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=80&h=80&fit=crop",
  },
  {
    id: 4,
    name: "Amber Sobia",
    description:
      "Savor the robust taste of our premium single-origin espresso, ideal for any coffee lover.",
    category: "Coffee",
    price: 85.2,
    status: "Available",
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1f2f6?w=80&h=80&fit=crop",
  },
  {
    id: 5,
    name: "Blueberry Croissant",
    description:
      "Savor the robust taste of our premium single-origin espresso, ideal for any coffee lover.",
    category: "Pastries",
    price: 85.2,
    status: "Available",
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?w=80&h=80&fit=crop",
  },
  {
    id: 6,
    name: "Chemex",
    description:
      "Savor the robust taste of our premium single-origin espresso, ideal for any coffee lover.",
    category: "Coffee",
    price: 85.2,
    status: "Out Of Stock",
    isActive: false,
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop",
  },
  {
    id: 7,
    name: "The Classic Turkey",
    description:
      "Savor the robust taste of our premium single-origin espresso, ideal for any coffee lover.",
    category: "Sandwiches",
    price: 85.2,
    status: "Available",
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=80&h=80&fit=crop",
  },
];

export const MOCK_INGREDIENTS: Ingredient[] = [
  {
    id: 1,
    name: "Smoked Turkey",
    description: "Lightly smoked and tender, with a mild, savory flavor perfect f...",
    category: "Raw Ingredient",
    price: 85.2,
    initialQuantity: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=80&h=80&fit=crop",
  },
  {
    id: 2,
    name: "Smoked Beef",
    description: "Fresh eggs cooked to perfection, with a rich yolk and delicate...",
    category: "Raw Ingredient",
    price: 85.2,
    initialQuantity: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=80&h=80&fit=crop",
  },
  {
    id: 3,
    name: "Fried Eggs",
    description: "Fresh eggs cooked to perfection, with a rich yolk and delicate...",
    category: "Raw Ingredient",
    price: 85.2,
    initialQuantity: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=80&h=80&fit=crop",
  },
  {
    id: 4,
    name: "Cheddar Cheese",
    description: "Sharp and creamy, adding a bold cheesy flavor to sandwiches.",
    category: "Raw Ingredient",
    price: 85.2,
    initialQuantity: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=80&h=80&fit=crop",
  },
  {
    id: 5,
    name: "Tomatoes",
    description: "Fresh, juicy, and slightly tangy, commonly used in salads, sauc...",
    category: "Raw Ingredient",
    price: 85.2,
    initialQuantity: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=80&h=80&fit=crop",
  },
  {
    id: 6,
    name: "Spinach",
    description: "-",
    category: "Raw Ingredient",
    price: 85.2,
    initialQuantity: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=80&h=80&fit=crop",
  },
  {
    id: 7,
    name: "Mushrooms",
    description: "Earthy and meaty in texture, commonly used in a variety of sa...",
    category: "Raw Ingredient",
    price: 85.2,
    initialQuantity: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=80&h=80&fit=crop",
  },
  {
    id: 8,
    name: "Lettuce",
    description: "Crisp leafy greens for sandwiches and salads.",
    category: "Raw Ingredient",
    price: 85.2,
    initialQuantity: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=80&h=80&fit=crop",
  },
];

export const MOCK_CATEGORIES: ProductCategory[] = [
  {
    id: 1,
    name: "All",
    imageUrl:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=80&h=80&fit=crop",
    itemCount: 51,
    isActive: true,
  },
  {
    id: 2,
    name: "Bakery",
    imageUrl:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=80&h=80&fit=crop",
    itemCount: 12,
    isActive: true,
  },
  {
    id: 3,
    name: "Desserts",
    imageUrl:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=80&h=80&fit=crop",
    itemCount: 4,
    isActive: true,
  },
  {
    id: 4,
    name: "Drinks",
    imageUrl:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1f2f6?w=80&h=80&fit=crop",
    itemCount: 6,
    isActive: true,
  },
  {
    id: 5,
    name: "Sandwiches",
    imageUrl:
      "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?w=80&h=80&fit=crop",
    itemCount: 12,
    isActive: true,
  },
  {
    id: 6,
    name: "Speciality Coffee",
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop",
    itemCount: 8,
    isActive: true,
  },
  {
    id: 7,
    name: "Ramadan Drinks",
    imageUrl:
      "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=80&h=80&fit=crop",
    itemCount: 9,
    isActive: false,
  },
];

export const INITIAL_PRODUCT_FORM: ProductFormData = {
  name: "",
  category: "",
  description: "",
  price: "",
  status: "Available",
  discountType: "",
  discountValue: "",
  imageUrl: "",
  isActive: true,
};

export const INITIAL_INGREDIENT_FORM: IngredientFormData = {
  name: "",
  description: "",
  price: "",
  initialQuantity: "",
  category: "Raw Ingredient",
  imageUrl: "",
};

export const INITIAL_CATEGORY_FORM: CategoryFormData = {
  name: "",
  imageUrl: "",
};
