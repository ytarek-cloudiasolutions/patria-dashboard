import type { AccountFormData, OrderReport } from "./types";

export const DEFAULT_ACCOUNT: AccountFormData = {
  fullName: "Super Admin",
  email: "admin@er.com",
  phone: "",
  shipmentAddress: "",
};

export const ORDER_REPORTS: OrderReport[] = [
  { id: 1, orderNo: "#ORD-214067", customer: "Omnia", date: "4/14/2026", status: "Pending", total: 227.4 },
  { id: 2, orderNo: "#ORD-387939", customer: "Esraa", date: "4/14/2026", status: "Confirmed", total: 227.4 },
  { id: 3, orderNo: "#ORD-021928", customer: "Kareem Nabil", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 4, orderNo: "#ORD-732018", customer: "Omnia", date: "4/14/2026", status: "On the Way", total: 227.4 },
  { id: 5, orderNo: "#ORD-829481", customer: "Yasmine Abdallah", date: "4/14/2026", status: "Cancelled", total: null },
  { id: 6, orderNo: "#ORD-021928", customer: "Ashraf Hakimi", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 7, orderNo: "#ORD-021928", customer: "Mourad Ali", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 8, orderNo: "#ORD-021928", customer: "Nasser Mahmoud", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 9, orderNo: "#ORD-021928", customer: "Ali Farouky", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 10, orderNo: "#ORD-021928", customer: "Mina Maher", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 11, orderNo: "#ORD-021928", customer: "Youssef", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 12, orderNo: "#ORD-021928", customer: "Ahmed", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 13, orderNo: "#ORD-021928", customer: "Hassan Osama", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 14, orderNo: "#ORD-021928", customer: "Salwa Hassan", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 15, orderNo: "#ORD-021928", customer: "Nadia Elsayed", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 16, orderNo: "#ORD-021928", customer: "Youssef Ibrahim", date: "4/14/2026", status: "Delivered", total: 227.4 },
  { id: 17, orderNo: "#ORD-021928", customer: "Ahmed Khaled", date: "4/14/2026", status: "Delivered", total: 227.4 },
];

export const ACCOUNT_STATS = {
  totalOrders: 52,
  totalRevenue: 8906.8,
};
