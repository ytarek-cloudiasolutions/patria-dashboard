import type {
  Ingredient,
  IngredientFormData,
  Product,
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
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Smoked Turkey",
    description: "Turkey, cheese, and mustard.",
    category: "Sandwiches",
    price: 85,
    status: "Available",
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=80&h=80&fit=crop",
    discountLabel: "EGP 24.00",
  },
  {
    id: 2,
    name: "Blueberry Muffin",
    description: "Soft muffin filled with blueberries.",
    category: "Pastries",
    price: 55,
    status: "Available",
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=80&h=80&fit=crop",
    discountLabel: "30%",
  },
  {
    id: 3,
    name: "Chocolate Croissant",
    description: "Butter croissant with chocolate filling.",
    category: "Pastries",
    price: 64,
    status: "Available",
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop",
  },
  {
    id: 4,
    name: "Cold Brew",
    description: "Cold coffee brewed for 16 hours.",
    category: "Coffee",
    price: 90,
    status: "Available",
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=80&h=80&fit=crop",
  },
  {
    id: 5,
    name: "Berry Danish",
    description: "Flaky pastry topped with berry jam.",
    category: "Pastries",
    price: 78,
    status: "Out Of Stock",
    isActive: false,
    imageUrl:
      "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?w=80&h=80&fit=crop",
  },
  {
    id: 6,
    name: "Iced Matcha Latte",
    description: "Matcha with milk and a sweet finish.",
    category: "Coffee",
    price: 95,
    status: "Available",
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1f2f6?w=80&h=80&fit=crop",
  },
];

export const MOCK_INGREDIENTS: Ingredient[] = [
  {
    id: 1,
    name: "Flour",
    description: "High quality wheat flour.",
    category: "Raw Ingredient",
    price: 45,
    initialQuantity: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop",
  },
  {
    id: 2,
    name: "Sugar",
    description: "Fine white granulated sugar.",
    category: "Raw Ingredient",
    price: 40,
    initialQuantity: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=80&h=80&fit=crop",
  },
  {
    id: 3,
    name: "Butter",
    description: "Unsalted premium butter.",
    category: "Raw Ingredient",
    price: 75,
    initialQuantity: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=80&h=80&fit=crop",
  },
  {
    id: 4,
    name: "Milk",
    description: "Fresh full-cream milk.",
    category: "Raw Ingredient",
    price: 30,
    initialQuantity: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop",
  },
  {
    id: 5,
    name: "Yeast",
    description: "Instant dry yeast.",
    category: "Raw Ingredient",
    price: 18,
    initialQuantity: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1612257999902-2ebc5af2f4b9?w=80&h=80&fit=crop",
  },
  {
    id: 6,
    name: "Egg",
    description: "Farm fresh eggs.",
    category: "Raw Ingredient",
    price: 32,
    initialQuantity: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=80&h=80&fit=crop",
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
