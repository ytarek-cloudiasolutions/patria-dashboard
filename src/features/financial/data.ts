import type {
  FinancialTransaction,
  InventoryCountSession,
  AdjustmentWastageRecord,
  OpeningBalanceRecord,
  ReorderItem,
  CategoryCostBreakdown,
  CostAnalysisRow,
  ConsumptionRow,
} from "./types";

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 1,
    statement: "Employee Salary",
    category: "Salary",
    amount: -20000,
    type: "Expense",
    date: "4/14/2026",
    status: "Registered",
    classifiedAsSalary: true,
  },
  {
    id: 2,
    statement: "Rent",
    category: "Rent",
    amount: -5000,
    type: "Expense",
    date: "4/14/2026",
    status: "Registered",
  },
  {
    id: 3,
    statement: "Sales",
    category: "Other",
    amount: 10000,
    type: "Income",
    date: "4/14/2026",
    status: "Registered",
  },
];

export const REVENUES_VS_EXPENSES_BREAKDOWN = [
  { id: "rent", label: "Rent", amount: 5000 },
  { id: "salary", label: "Salary", amount: 20000 },
];

export const PERFORMANCE_INDICATORS = [
  { id: "orders", label: "Total orders", amount: 20, tone: "neutral" as const },
  {
    id: "net-profit",
    label: "Net Profit",
    amount: -2623,
    tone: "negative" as const,
  },
  {
    id: "salaries",
    label: "Salaries",
    amount: 4000,
    tone: "neutral" as const,
  },
  {
    id: "operating-expenses",
    label: "Operating Expenses",
    amount: 5000,
    tone: "neutral" as const,
  },
  {
    id: "avg-order-value",
    label: "Avg. Order Value",
    amount: 219,
    tone: "neutral" as const,
  },
];

export const TRANSACTION_CATEGORY_OPTIONS = [
  { value: "Salary", label: "Salary" },
  { value: "Rent", label: "Rent" },
  { value: "Other", label: "Other" },
  { value: "Sales", label: "Sales" },
  { value: "Utilities", label: "Utilities" },
  { value: "Marketing", label: "Marketing" },
];

export const INVENTORY_COUNT_SESSIONS: InventoryCountSession[] = [
  {
    id: "1",
    number: "INV-1783935539920-80",
    warehouse: "Main Kitchen",
    date: "4/14/2026",
    status: "In Progress",
    noOfItems: 930,
  },
  {
    id: "2",
    number: "INV-1783935539920-80",
    warehouse: "Front Counter",
    date: "4/14/2026",
    status: "Completed",
    noOfItems: 195,
  },
];

export const ADJUSTMENTS_WASTAGE_RECORDS: AdjustmentWastageRecord[] = [
  {
    id: "1",
    number: "WELCOME 20",
    type: "Fixed Price (EGP)",
    warehouse: "Main Kitchen",
    date: "4/14/2026",
    value: "2 / ∞",
    noOfItems: 2,
    status: "In Progress",
  },
  {
    id: "2",
    number: "RMDKAREEM",
    type: "Percentage (%)",
    warehouse: "Main Kitchen",
    date: "4/14/2026",
    value: "2 / 20",
    noOfItems: 4,
    status: "In Progress",
  },
  {
    id: "3",
    number: "FIRST30",
    type: "Percentage (%)",
    warehouse: "Main Kitchen",
    date: "4/14/2026",
    value: "10 / ∞",
    noOfItems: 0,
    status: "In Progress",
  },
];

export const OPENING_BALANCE_RECORDS: OpeningBalanceRecord[] = [
  {
    id: "1",
    number: "OPB-1784021777164-697",
    warehouse: "Main Kitchen",
    periodStart: "4/14/2026",
    totalValue: 280.0,
    noOfItems: 1,
    status: "Draft",
  },
  {
    id: "2",
    number: "OPB-1784021716568-878",
    warehouse: "Main Kitchen",
    periodStart: "4/14/2026",
    totalValue: 280.0,
    noOfItems: 2,
    status: "Draft",
  },
  {
    id: "3",
    number: "OPB-1784021716568-007",
    warehouse: "Main Kitchen",
    periodStart: "4/14/2026",
    totalValue: 280.0,
    noOfItems: 1,
    status: "Draft",
  },
];

export const REORDER_ITEMS: ReorderItem[] = [
  {
    id: "1",
    name: "Almond Croissant",
    currentInventory: 0,
    orderLimit: 10,
    shortage: 10,
    supplier: "Patria Pastry",
    status: "Out of Stock",
  },
  {
    id: "2",
    name: "Middle Eastern Roast Beef",
    currentInventory: 27,
    orderLimit: 10,
    shortage: 10,
    supplier: "Patria Pastry",
    status: "Sufficient stock",
  },
  {
    id: "3",
    name: "Layaly Lebnan - M",
    currentInventory: 12,
    orderLimit: 10,
    shortage: 10,
    supplier: "Patria Pastry",
    status: "Low",
  },
  {
    id: "4",
    name: "Kunafa Tiramisu - M",
    currentInventory: 10,
    orderLimit: 10,
    shortage: 10,
    supplier: "-",
    status: "Low",
  },
  {
    id: "5",
    name: "Banoffy Kunafa - L",
    currentInventory: 15,
    orderLimit: 10,
    shortage: 10,
    supplier: "-",
    status: "Low",
  },
];

export const CATEGORY_COST_BREAKDOWNS: CategoryCostBreakdown[] = [
  { id: "1", category: "Bakery", totalValue: 1000, itemCount: 110 },
  { id: "2", category: "General", totalValue: 1500, itemCount: 50 },
  { id: "3", category: "Drinks", totalValue: 3200, itemCount: 75 },
  { id: "4", category: "Sandwiches", totalValue: 0, itemCount: 110 },
  { id: "5", category: "Desserts", totalValue: 5800, itemCount: 30 },
];

export const COST_ANALYSIS_ROWS: CostAnalysisRow[] = [
  {
    id: "1",
    item: "Almond Croissant",
    cost: 280.0,
    sellingPrice: 280.0,
    balance: 0,
    inventoryValue: 0.0,
    profitMargin: "100.00%",
  },
  {
    id: "2",
    item: "Middle Eastern Roast Beef",
    cost: 280.0,
    sellingPrice: 280.0,
    balance: 0,
    inventoryValue: 0.0,
    profitMargin: "100.00%",
  },
  {
    id: "3",
    item: "Layaly Lebnan - M",
    cost: 280.0,
    sellingPrice: 280.0,
    balance: 0,
    inventoryValue: 0.0,
    profitMargin: "100.00%",
  },
  {
    id: "4",
    item: "Kunafa Tiramisu - M",
    cost: 280.0,
    sellingPrice: 280.0,
    balance: 0,
    inventoryValue: 0.0,
    profitMargin: "0.00%",
  },
  {
    id: "5",
    item: "Banoffy Kunafa - L",
    cost: 280.0,
    sellingPrice: 280.0,
    balance: 0,
    inventoryValue: 0.0,
    profitMargin: "70.00%",
  },
];

export const CONSUMPTION_ROWS: ConsumptionRow[] = [
  {
    id: "1",
    item: "Almond Croissant",
    sales: 10,
    waste: 2,
    production: 0,
    total: 8,
    cost: 140.0,
    income: 500.75,
    profit: 0.0,
  },
  {
    id: "2",
    item: "Middle Eastern Roast Beef",
    sales: 5,
    waste: 0,
    production: 0,
    total: 5,
    cost: 0.0,
    income: 100.0,
    profit: 0.0,
  },
  {
    id: "3",
    item: "Layaly Lebnan - M",
    sales: 1,
    waste: 0,
    production: 0,
    total: 1,
    cost: 0.0,
    income: 1000.0,
    profit: 500.75,
  },
  {
    id: "4",
    item: "Kunafa Tiramisu - M",
    sales: 1,
    waste: 0,
    production: 0,
    total: 1,
    cost: 0.0,
    income: 0.0,
    profit: 500.75,
  },
  {
    id: "5",
    item: "Banoffy Kunafa - L",
    sales: 1,
    waste: 0,
    production: 0,
    total: 1,
    cost: 0.0,
    income: 250.5,
    profit: 500.75,
  },
];
