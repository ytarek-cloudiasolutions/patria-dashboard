import type {
  Category,
  CustomerContact,
  Ingredient,
  Product,
} from "./types";

/** Shared product / ingredient imagery (re-used from the POS catalogue). */
const IMG = {
  tiramisu:
    "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=600&q=80",
  saraya:
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80",
  roastBeef:
    "https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=600&q=80",
  sobia:
    "https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=600&q=80",
  croissant:
    "https://images.unsplash.com/photo-1620146344904-097a0002d797?auto=format&fit=crop&w=600&q=80",
  chemex:
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
  turkey:
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
  almond:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  beef: "https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=600&q=80",
  eggs: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80",
  cheese:
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80",
  tomato:
    "https://images.unsplash.com/photo-1546470427-e26264be0b0d?auto=format&fit=crop&w=600&q=80",
  spinach:
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
  mushroom:
    "https://images.unsplash.com/photo-1602273660127-a0000560a4c1?auto=format&fit=crop&w=600&q=80",
};

const DESCRIPTION =
  "Savor the robust taste of our premium single-origin espresso, ideal for any coffee lover.";

export const PRODUCT_PRICE = 85.2;

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Kunafa Tiramisu",
    description: "Rich, bold espresso from single origin coffee beans.",
    category: "Pastries",
    imageUrl: IMG.tiramisu,
    price: PRODUCT_PRICE,
    discount: { type: "fixed", value: 79 },
    available: true,
  },
  {
    id: 2,
    name: "Eish el Saraya",
    description: "Buttery croissant filled with almond cream.",
    category: "Pastries",
    imageUrl: IMG.saraya,
    price: PRODUCT_PRICE,
    discount: { type: "percentage", value: 30 },
    available: true,
  },
  {
    id: 3,
    name: "Middle Eastern Roast Beef",
    description: "Moist banana bread with toasted walnuts.",
    category: "Pastries",
    imageUrl: IMG.roastBeef,
    price: PRODUCT_PRICE,
    available: false,
  },
  {
    id: 4,
    name: "Amber Sobia",
    description: DESCRIPTION,
    category: "Coffee",
    imageUrl: IMG.sobia,
    price: PRODUCT_PRICE,
    available: true,
  },
  {
    id: 5,
    name: "Blueberry Croissant",
    description: DESCRIPTION,
    category: "Pastries",
    imageUrl: IMG.croissant,
    price: PRODUCT_PRICE,
    available: true,
  },
  {
    id: 6,
    name: "Chemex",
    description: DESCRIPTION,
    category: "Coffee",
    imageUrl: IMG.chemex,
    price: PRODUCT_PRICE,
    available: false,
  },
  {
    id: 7,
    name: "The Classic Turkey",
    description: DESCRIPTION,
    category: "Sandwiches",
    imageUrl: IMG.turkey,
    price: PRODUCT_PRICE,
    available: true,
  },
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  {
    id: 1,
    name: "Smoked Turkey",
    description:
      "Lightly smoked and tender, with a mild, savory flavor perfect for sandwiches.",
    imageUrl: IMG.turkey,
    price: PRODUCT_PRICE,
    quantity: 22,
    unit: "Piece(s)",
  },
  {
    id: 2,
    name: "Smoked Beef",
    description:
      "Fresh eggs cooked to perfection, with a rich yolk and delicate flavor.",
    imageUrl: IMG.beef,
    price: PRODUCT_PRICE,
    quantity: 12,
    unit: "Piece(s)",
  },
  {
    id: 3,
    name: "Fried Eggs",
    description:
      "Fresh eggs cooked to perfection, with a rich yolk and delicate flavor.",
    imageUrl: IMG.eggs,
    price: PRODUCT_PRICE,
    quantity: 8,
    unit: "Piece(s)",
  },
  {
    id: 4,
    name: "Cheddar Cheese",
    description: "Sharp and creamy, adding a bold cheesy flavor to sandwiches.",
    imageUrl: IMG.cheese,
    price: PRODUCT_PRICE,
    quantity: 9,
    unit: "Piece(s)",
  },
  {
    id: 5,
    name: "Tomatoes",
    description:
      "Fresh, juicy, and slightly tangy, commonly used in salads, sauces.",
    imageUrl: IMG.tomato,
    price: PRODUCT_PRICE,
    quantity: 3,
    unit: "Piece(s)",
  },
  {
    id: 6,
    name: "Spinach",
    description:
      "Tender green leaves with a mild, earthy taste, rich in nutrients.",
    imageUrl: IMG.spinach,
    price: PRODUCT_PRICE,
    quantity: 35,
    unit: "Piece(s)",
  },
  {
    id: 7,
    name: "Mushrooms",
    description: "Earthy and meaty in texture, used in a variety of salads.",
    imageUrl: IMG.mushroom,
    price: PRODUCT_PRICE,
    quantity: 24,
    unit: "Piece(s)",
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: "All", imageUrl: IMG.tiramisu, itemCount: 51, active: true },
  { id: 2, name: "Bakery", imageUrl: IMG.saraya, itemCount: 12, active: true },
  {
    id: 3,
    name: "Desserts",
    imageUrl: IMG.turkey,
    itemCount: 4,
    active: true,
  },
  { id: 4, name: "Drinks", imageUrl: IMG.sobia, itemCount: 6, active: true },
  {
    id: 5,
    name: "Sandwiches",
    imageUrl: IMG.croissant,
    itemCount: 12,
    active: true,
  },
  {
    id: 6,
    name: "Speciality Coffee",
    imageUrl: IMG.chemex,
    itemCount: 8,
    active: true,
  },
  {
    id: 7,
    name: "Ramadan Drinks",
    imageUrl: IMG.turkey,
    itemCount: 9,
    active: false,
  },
];

/** Category names available when adding/filtering products. */
export const PRODUCT_CATEGORIES = [
  "Bakery",
  "Pastries",
  "Desserts",
  "Drinks",
  "Coffee",
  "Speciality Coffee",
  "Sandwiches",
  "Ramadan Drinks",
];

/** Categories that a "raw ingredient" can be offered as an extra under. */
export const EXTRA_CATEGORIES = [
  "All",
  "Bakery",
  "Desserts",
  "Drinks",
  "Sandwiches",
  "Speciality Coffee",
];

/** Preset audience sizes for the WhatsApp blast. */
export const WHATSAPP_AUDIENCE_PRESETS = [25, 50, 100, 200, 500];

export const CUSTOMER_CONTACTS: CustomerContact[] = [
  { id: 1, name: "Omnia Maher Galal", phone: "01288716491" },
  { id: 2, name: "Liam Johnson", phone: "01345678901" },
  { id: 3, name: "Aisha Patel", phone: "01098765432" },
  { id: 4, name: "Mohamed Hassan", phone: "01211223344" },
  { id: 5, name: "Sara Ahmed", phone: "01055667788" },
  { id: 6, name: "Youssef Kamal", phone: "01233445566" },
];
