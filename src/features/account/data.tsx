import { Users, ShoppingBag } from "lucide-react";
import type { AccountFormData, OrderStat, Order } from "./types";

export const defaultAccountFormData: AccountFormData = {
  fullName: "",
  email: "admin@er.com",
  phoneNumber: "",
  shipmentAddress: "",
};

export const orderStats: OrderStat[] = [
  {
    label: "Total Orders",
    value: 52,
    icon: <Users size={20} />,
    badgeColor: "bg-[#FFF5EC]",
    iconColor: "text-[#FF8A00]",
  },
  {
    label: "Total Revenue",
    value: "EGP 8,906.8",
    icon: <ShoppingBag size={20} />,
    badgeColor: "bg-[#E8F5FF]",
    iconColor: "text-[#0099FF]",
  },
];

export const ordersData: Order[] = [
  {
    orderNo: "#ORD-214067",
    customer: "Omnia",
    date: "4/14/2026",
    status: "Pending",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-387939",
    customer: "Esraa",
    date: "4/14/2026",
    status: "Confirmed",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Kareem Nabil",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-732018",
    customer: "Omnia",
    date: "4/14/2026",
    status: "On the Way",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-929481",
    customer: "Yasmine Abdallah",
    date: "4/14/2026",
    status: "Cancelled",
    total: null,
  },
  {
    orderNo: "#ORD-021928",
    customer: "Ashraf Hakimi",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Mourad Ali",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Nasser Mahmoud",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Ali Farouky",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Mina Maher",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Youssef",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Ahmed",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Hassan Osama",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Salwa Hassan",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Nadia Elsayed",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Youssef Ibrahim",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
  {
    orderNo: "#ORD-021928",
    customer: "Ahmed Khaled",
    date: "4/14/2026",
    status: "Delivered",
    total: "EGP 227.4",
  },
];
