import type {
  DailyReport,
  DailySale,
  ShiftRow,
  StaffTabUser,
  TopProduct,
} from "./types";

export const SHIFT_OPTIONS = [
  { value: "Morning", label: "Morning" },
  { value: "Evening", label: "Evening" },
  { value: "Night", label: "Night" },
];

export const PERIOD_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export const DAILY_REPORT: DailyReport = {
  orders: 1,
  quantity: 2,
  revenue: 250,
  cost: 120,
  profit: 5,
  profitMargin: 15,
  ordersAtDiscount: 2,
  products: [
    {
      id: 1,
      label: "Total",
      product: "Eish El Saraya",
      quantity: 2,
      revenue: 280,
      cost: 280,
      profit: 280,
      margin: 0,
    },
  ],
};

export const TOP_PRODUCTS: TopProduct[] = [
  { rank: 1, name: "Boldly Dark Glitch", count: 64 },
  { rank: 2, name: "Avocado Ranch", count: 13 },
  { rank: 3, name: "Middle Eastern Roast Beef", count: 13 },
  { rank: 4, name: "Almond Croissant", count: 11 },
  { rank: 5, name: "Amber Sobia", count: 10 },
];

export const DAILY_SALES: DailySale[] = [
  { id: 1, date: "3/31/2026", orders: 1, revenue: 10000 },
  { id: 2, date: "3/31/2026", orders: 2, revenue: 250000 },
];

const baseShift = {
  employee: "Super Admin",
  role: "Admin",
  start: "3/31/2026, 2:37:57 PM",
  end: "3/31/2026, 2:37:57 PM",
  duration: "10h 22m",
  revenue: 280,
};

export const SHIFT_ROWS: ShiftRow[] = [
  { id: 1, ...baseShift, shift: "Morning", orders: 22, status: "On Going" },
  { id: 2, ...baseShift, shift: "Evening", orders: 15, status: "Completed" },
  { id: 3, ...baseShift, shift: "-", orders: 23, status: "Completed" },
  { id: 4, ...baseShift, shift: "-", orders: 12, status: "Completed" },
  {
    id: 5,
    ...baseShift,
    shift: "-",
    orders: 22,
    discount: -80,
    status: "Completed",
  },
];

export const MOCK_STAFF_TAB_USERS: StaffTabUser[] = [
  {
    id: "omnia-1",
    name: "Omnia Maher",
    totalOrders: 44,
    unpaidOrders: 44,
    total: 140.0,
    paid: 500.75,
    balance: 140.0,
    orders: [
      {
        id: "ord-1",
        orderNumber: "#ORD-749819",
        items: "Caramelized BBQ chicken × 2، Cheese Bomb × 1، Halloumi pesto chicken × 1، Plain Croissant × 2",
        date: "3/31/2026, 2:37:57 PM",
        price: 85.2,
        status: "Paid",
      },
      {
        id: "ord-2",
        orderNumber: "#ORD-749819",
        items: "Espresso × 1، Mineral water × 1، Chocolate Hazelnut Éclair × 1",
        date: "3/31/2026, 2:37:57 PM",
        price: 78.75,
        status: "Unpaid",
      },
      {
        id: "ord-3",
        orderNumber: "#ORD-749824",
        items: "Cheese Bomb × 1، Cookie Piece × 1، Cappuccino × 1",
        date: "3/31/2026, 2:37:57 PM",
        price: 102.3,
        status: "Unpaid",
      },
      {
        id: "ord-4",
        orderNumber: "#ORD-749822",
        items: "Mineral water × 1",
        date: "3/31/2026, 2:37:57 PM",
        price: 85.2,
        status: "Unpaid",
      },
      {
        id: "ord-5",
        orderNumber: "#ORD-749823",
        items: "Espresso × 1، French Coffee × 1، Mineral water × 1",
        date: "3/31/2026, 2:37:57 PM",
        price: 88.2,
        status: "Unpaid",
      },
      {
        id: "ord-6",
        orderNumber: "#ORD-749821",
        items: "Roast Beef Sandwich × 1",
        date: "3/31/2026, 2:37:57 PM",
        price: 95.0,
        status: "Unpaid",
      },
      {
        id: "ord-7",
        orderNumber: "#ORD-749820",
        items: "Roast Beef Sandwich × 1",
        date: "3/31/2026, 2:37:57 PM",
        price: 90.5,
        status: "Unpaid",
      },
    ],
  },
  {
    id: "omnia-2",
    name: "Omnia Maher",
    totalOrders: 44,
    unpaidOrders: 44,
    total: 140.0,
    paid: 500.75,
    balance: 140.0,
    orders: [
      {
        id: "ord-21",
        orderNumber: "#ORD-749819",
        items: "Caramelized BBQ chicken × 2، Cheese Bomb × 1",
        date: "3/31/2026, 2:37:57 PM",
        price: 85.2,
        status: "Paid",
      },
      {
        id: "ord-22",
        orderNumber: "#ORD-749824",
        items: "Espresso × 1، Mineral water × 1",
        date: "3/31/2026, 2:37:57 PM",
        price: 78.75,
        status: "Unpaid",
      },
    ],
  },
  {
    id: "omnia-3",
    name: "Omnia Maher",
    totalOrders: 44,
    unpaidOrders: 44,
    total: 140.0,
    paid: 500.75,
    balance: 140.0,
    orders: [
      {
        id: "ord-31",
        orderNumber: "#ORD-749819",
        items: "Cheese Bomb × 1، Cookie Piece × 1",
        date: "3/31/2026, 2:37:57 PM",
        price: 102.3,
        status: "Unpaid",
      },
    ],
  },
  {
    id: "liam-1",
    name: "Liam Johnson",
    totalOrders: 30,
    unpaidOrders: 15,
    total: 75.0,
    paid: 200.0,
    balance: 75.0,
    orders: [
      {
        id: "ord-41",
        orderNumber: "#ORD-748911",
        items: "Americano × 2, Tuna Croissant × 1",
        date: "3/31/2026, 1:15:30 PM",
        price: 75.0,
        status: "Unpaid",
      },
    ],
  },
  {
    id: "sara-1",
    name: "Sara Almasri",
    totalOrders: 50,
    unpaidOrders: 20,
    total: 300.0,
    paid: 250.0,
    balance: 50.0,
    orders: [
      {
        id: "ord-51",
        orderNumber: "#ORD-748512",
        items: "Spanish Latte × 1, Turkey Melt × 1",
        date: "3/31/2026, 12:45:10 PM",
        price: 50.0,
        status: "Unpaid",
      },
    ],
  },
  {
    id: "daniel-1",
    name: "Daniel Kim",
    totalOrders: 25,
    unpaidOrders: 10,
    total: 120.0,
    paid: 60.0,
    balance: 60.0,
    orders: [
      {
        id: "ord-61",
        orderNumber: "#ORD-747890",
        items: "Flat White × 1, Cinnamon Roll × 1",
        date: "3/31/2026, 11:20:00 AM",
        price: 60.0,
        status: "Unpaid",
      },
    ],
  },
  {
    id: "fatima-1",
    name: "Fatima Noor",
    totalOrders: 40,
    unpaidOrders: 5,
    total: 180.0,
    paid: 150.0,
    balance: 30.0,
    orders: [
      {
        id: "ord-71",
        orderNumber: "#ORD-747120",
        items: "Cappuccino × 1, Plain Croissant × 1",
        date: "3/31/2026, 10:10:45 AM",
        price: 30.0,
        status: "Unpaid",
      },
    ],
  },
  {
    id: "raj-1",
    name: "Raj Patel",
    totalOrders: 15,
    unpaidOrders: 0,
    total: 90.0,
    paid: 90.0,
    balance: 0.0,
    orders: [
      {
        id: "ord-81",
        orderNumber: "#ORD-746900",
        items: "Iced Caramel Macchiato × 1",
        date: "3/31/2026, 9:30:15 AM",
        price: 90.0,
        status: "Paid",
      },
    ],
  },
];

