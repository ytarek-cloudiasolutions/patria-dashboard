import type {
  CartItem,
  EmployeeAccount,
  PendingOrder,
  PosCategory,
  PosProduct,
  ProductExtra,
  ShiftPaymentSummary,
  StaffMember,
  StaffPosition,
} from "./types";

const IMG = {
  turkey:
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
  chemex:
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
  croissant:
    "https://images.unsplash.com/photo-1620146344904-097a0002d797?auto=format&fit=crop&w=600&q=80",
  sobia:
    "https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=600&q=80",
  roastBeef:
    "https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=600&q=80",
  saraya:
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80",
  tiramisu:
    "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=600&q=80",
  almond:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
};

/** Extras shared by the bakery / dessert products. */
export const BAKERY_EXTRAS: ProductExtra[] = [
  { id: "chocolate", name: "Chocolate", price: 85.2 },
  { id: "lotus", name: "Lotus", price: 85.2 },
];

export const POS_CATEGORIES: PosCategory[] = [
  { id: "all", label: "All", imageUrl: IMG.croissant },
  { id: "drinks", label: "Drinks", imageUrl: IMG.chemex },
  { id: "ramadan-desserts", label: "Ramadan Desserts", imageUrl: IMG.tiramisu },
  { id: "sandwiches", label: "Sandwiches", imageUrl: IMG.turkey },
  { id: "bakery", label: "Bakery", imageUrl: IMG.almond },
  { id: "ramadan-oasis", label: "Ramadan Oasis", imageUrl: IMG.sobia },
];

export const POS_PRODUCTS: PosProduct[] = [
  {
    id: "classic-turkey",
    name: "The Classic Turkey",
    price: 460,
    category: "sandwiches",
    imageUrl: IMG.turkey,
    accent: "bg-[#F4E6D6]",
  },
  {
    id: "chemex",
    name: "Chemex",
    price: 89.25,
    category: "drinks",
    imageUrl: IMG.chemex,
    accent: "bg-[#ECE7DD]",
  },
  {
    id: "blueberry-croissant",
    name: "Blueberry Croissant",
    price: 120.96,
    category: "bakery",
    imageUrl: IMG.croissant,
    accent: "bg-[#EFE5D8]",
    extras: BAKERY_EXTRAS,
  },
  {
    id: "amber-sobia",
    name: "Amber Sobia",
    price: 99.22,
    category: "ramadan-oasis",
    imageUrl: IMG.sobia,
    stockBadge: "Low - 7",
    accent: "bg-[#F3EFE7]",
  },
  {
    id: "roast-beef",
    name: "Middle Eastern Roast Beef",
    price: 460,
    category: "sandwiches",
    imageUrl: IMG.roastBeef,
    accent: "bg-[#EFE4D5]",
  },
  {
    id: "eish-el-saraya",
    name: "Eish el Saraya",
    price: 460,
    category: "ramadan-desserts",
    imageUrl: IMG.saraya,
    accent: "bg-[#F2EDE6]",
    extras: BAKERY_EXTRAS,
  },
  {
    id: "kunafa-tiramisu",
    name: "Kunafa Tiramisu",
    price: 460,
    category: "ramadan-desserts",
    imageUrl: IMG.tiramisu,
    accent: "bg-[#F2ECE4]",
    extras: BAKERY_EXTRAS,
  },
  {
    id: "almond-croissant",
    name: "Almond Croissant",
    price: 91.8,
    originalPrice: 134,
    category: "bakery",
    imageUrl: IMG.almond,
    accent: "bg-[#EFE5D8]",
    extras: BAKERY_EXTRAS,
  },
];

export const POS_TABLE_OPTIONS = [
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4",
  "Table 5",
  "Table 6",
  "Table 12",
];

export const STAFF_POSITIONS: StaffPosition[] = [
  "Admin",
  "Manager",
  "Barista",
  "Staff",
];

export const STAFF_MEMBERS: StaffMember[] = [
  { id: "omnia", name: "Omnia Maher Galal", role: "Admin", remaining: 120 },
  { id: "ahmed", name: "Ahmed Said", role: "Manager", remaining: 470 },
  { id: "kareem", name: "Kareem Nabil", role: "Barista", remaining: 250 },
  { id: "youssef", name: "Youssef Abdallah", role: "Staff", remaining: 0 },
  { id: "osama", name: "Osama Abdallah", remaining: 80 },
];

export const EMPLOYEE_ACCOUNTS: EmployeeAccount[] = [
  {
    id: "omnia",
    name: "Omnia Maher",
    daysLeft: 30,
    total: 250,
    remaining: 250,
    payBook: [],
  },
  {
    id: "esraa",
    name: "Esraa Abdallah",
    daysLeft: 30,
    total: 1250,
    remaining: 670,
    payBook: [
      { amount: 100, method: "Cash", date: "May 13, 2026, 6:01:28 PM" },
      { amount: 100, method: "Cash", date: "May 13, 2026, 6:01:28 PM" },
      { amount: 100, method: "Card", date: "May 13, 2026, 6:01:28 PM" },
    ],
  },
];

export const PENDING_ORDERS: PendingOrder[] = [
  { id: "p1", table: "Table 6", itemCount: 7, time: "2:46:39 PM", total: 402 },
  { id: "p2", table: "Table 3", itemCount: 7, time: "2:46:39 PM", total: 769 },
  { id: "p3", table: "Table 1", itemCount: 7, time: "2:46:39 PM", total: 798 },
  { id: "p4", table: "Table 12", itemCount: 7, time: "2:46:39 PM", total: 402 },
  { id: "p5", table: "Table 12", itemCount: 7, time: "2:46:39 PM", total: 402 },
];

export const SHIFT_SUMMARY = {
  orderCount: 3,
  total: 670,
};

export const SHIFT_PAYMENT_SUMMARY: ShiftPaymentSummary[] = [
  { method: "cash", label: "Cash", amount: 420 },
  { method: "card", label: "Visa/Card", amount: 420 },
  { method: "mix", label: "Mix", amount: 420 },
];

export const PAYMENT_REGISTRATION_METHODS = ["Cash", "Visa/Card", "Mix"];

let lineCounter = 0;
/** Stable unique id for a new cart line (avoids Math.random for SSR safety). */
export const nextLineId = () => `line-${(lineCounter += 1)}`;

const withExtras = (extras: ProductExtra[], selectedIds: string[] = []) =>
  extras.map((extra) => ({
    ...extra,
    selected: selectedIds.includes(extra.id),
  }));

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    lineId: nextLineId(),
    productId: "sourdough",
    name: "Sourdough",
    unitPrice: 85.2,
    qty: 2,
    extras: [],
  },
  {
    lineId: nextLineId(),
    productId: "croissant",
    name: "Croissant",
    unitPrice: 85.2,
    qty: 2,
    extras: withExtras(
      [{ id: "chocolate-sauce", name: "Chocolate Sauce", price: 85.2 }],
      ["chocolate-sauce"],
    ),
  },
  {
    lineId: nextLineId(),
    productId: "sourdough-2",
    name: "Sourdough",
    unitPrice: 85.2,
    qty: 2,
    extras: [],
  },
];
