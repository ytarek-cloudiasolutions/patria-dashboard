import type {
  InventoryOverview,
  InventoryProduct,
  ShortageProduct,
} from "./types";

export const INVENTORY_OVERVIEW: InventoryOverview = {
  totalProducts: 3,
  lowStock: 1,
  outOfStock: 2,
  inventoryValue: "EGP 12,000",
};

export const INVENTORY_PRODUCTS: InventoryProduct[] = [
  {
    id: "1",
    name: "Kunafa Tiramsu",
    image: "/images/kunafa.jpg",
    category: "Bakery",
    categoryColor: "bg-[#5C4A0E] text-white",
    currentQuantity: 0,
    minimumQuantity: 10,
    status: "Out Of Stock",
  },
  {
    id: "2",
    name: "Tomatoes",
    image: "/images/tomatoes.jpg",
    category: "Raw Ingredient",
    categoryColor: "bg-[#5C4A0E] text-white",
    currentQuantity: 0,
    minimumQuantity: 10,
    status: "Out Of Stock",
  },
  {
    id: "3",
    name: "Amber Sobila",
    image: "/images/amber.jpg",
    category: "Barista",
    categoryColor: "bg-[#5C4A0E] text-white",
    currentQuantity: 7,
    minimumQuantity: 10,
    status: "Low Stock",
  },
];

export const SHORTAGE_PRODUCTS: ShortageProduct[] = [
  {
    id: "1",
    name: "Artisanal Sourdough",
    currentQuantity: 0,
    salesRatePerDay: 1.33,
    daysRemaining: 5,
    expectedExpiryDate: "22/4/2026",
    urgencyLevel: "Critical",
  },
  {
    id: "2",
    name: "Eish el Saraya",
    currentQuantity: 0,
    salesRatePerDay: 0.1,
    daysRemaining: 5,
    expectedExpiryDate: "22/4/2026",
    urgencyLevel: "Critical",
  },
  {
    id: "3",
    name: "Middle Eastern Roast Beef",
    currentQuantity: 0,
    salesRatePerDay: 0.07,
    daysRemaining: 5,
    expectedExpiryDate: "22/4/2026",
    urgencyLevel: "Critical",
  },
  {
    id: "4",
    name: "Tomatoes",
    currentQuantity: 0,
    salesRatePerDay: 0.5,
    daysRemaining: 5,
    expectedExpiryDate: "22/4/2026",
    urgencyLevel: "Critical",
  },
  {
    id: "5",
    name: "Brazilian Coffee",
    currentQuantity: 7,
    salesRatePerDay: 0.2,
    daysRemaining: 45,
    expectedExpiryDate: null,
    urgencyLevel: "Good",
  },
  {
    id: "6",
    name: "Kunafa Tiramsu",
    currentQuantity: 0,
    salesRatePerDay: null,
    daysRemaining: null,
    expectedExpiryDate: null,
    urgencyLevel: "Sufficient stock",
  },
];
