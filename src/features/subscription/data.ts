import type {
  CustomerOption,
  Subscription,
  SubscriptionProduct,
} from "./types";

export const CUSTOMER_OPTIONS: CustomerOption[] = [
  { id: "omnia", name: "Omnia Maher", email: "ogalal@gmail.com" },
  { id: "esraa", name: "Esraa Abdalla", email: "eabdalla@gmail.com" },
  { id: "kareem", name: "Kareem Nabil", email: "knabil@gmail.com" },
  { id: "youssef", name: "Youssef Nabil", email: "ynabil@gmail.com" },
];

export const SUBSCRIPTION_PRODUCTS: SubscriptionProduct[] = [
  {
    id: "artisanal-sourdough",
    name: "Artisanal Sourdough",
    roast: "Medium",
    grind: "Whole Bean",
  },
  {
    id: "brazilian-coffee",
    name: "Brazilian Coffee",
    roast: "Medium",
    grind: "Whole Bean",
  },
  {
    id: "colombian-coffee",
    name: "Colombian Coffee",
    roast: "Medium",
    grind: "Whole Bean",
  },
  {
    id: "ethiopian-coffee",
    name: "Ethiopian Coffee",
    roast: "Light",
    grind: "Ground",
  },
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 1,
    reference: "#sub-177612480001104-92e6",
    customerId: "omnia",
    customerName: "Omnia Maher",
    customerEmail: "ogalal@gmail.com",
    productId: "artisanal-sourdough",
    productName: "Artisanal Sourdough",
    roast: "Medium",
    grind: "Whole Bean",
    quantity: 4,
    frequency: "Weekly",
    nextDelivery: "APR 21",
    paymentStatus: "Pending",
    status: "Active",
  },
  {
    id: 2,
    reference: "#sub-177612480001104-92e6",
    customerId: "esraa",
    customerName: "Esraa Abdalla",
    customerEmail: "eabdalla@gmail.com",
    productId: "brazilian-coffee",
    productName: "Brazilian Coffee",
    roast: "Medium",
    grind: "Whole Bean",
    quantity: 1,
    frequency: "bi-weekly",
    nextDelivery: "May 1",
    paymentStatus: "Pending",
    status: "Active",
  },
  {
    id: 3,
    reference: "#sub-177612480001104-92e6",
    customerId: "kareem",
    customerName: "Kareem Nabil",
    customerEmail: "knabil@gmail.com",
    productId: "colombian-coffee",
    productName: "Colombian Coffee",
    roast: "Medium",
    grind: "Whole Bean",
    quantity: 2,
    frequency: "Monthly",
    nextDelivery: "May 22",
    paymentStatus: "Pending",
    status: "Active",
  },
];

export const SUBSCRIPTION_PAYMENT_FILTERS = [
  { value: "all", label: "All Payments" },
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" },
  { value: "Failed", label: "Failed" },
];

export const SUBSCRIPTION_FREQUENCY_OPTIONS = [
  { value: "Weekly", label: "Weekly" },
  { value: "bi-weekly", label: "bi-weekly" },
  { value: "Monthly", label: "Monthly" },
];

export const SUBSCRIPTION_STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Paused", label: "Paused" },
  { value: "Cancelled", label: "Cancelled" },
];
