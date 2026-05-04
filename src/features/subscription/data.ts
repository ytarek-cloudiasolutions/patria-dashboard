import type { Subscription } from "./types";

export const subscriptionsData: Subscription[] = [
  {
    id: "sub-1776124B000104-92e6",
    customer: { name: "Omnia Maher", email: "ogala@gmail.com" },
    plan: { quantity: 4, productName: "Artisanal Sourdough" },
    frequency: "Weekly",
    nextDelivery: "APR 21",
    paymentStatus: "Pending",
    paymentRef: "#sub-1776124B000104-92e6",
    status: "Active",
  },
  {
    id: "sub-1776124B000104-92e7",
    customer: { name: "Esraa Abdalla", email: "eabdalla@gmail.com" },
    plan: {
      quantity: 1,
      productName: "Brazilian Coffee",
      tags: ["Medium", "Whole Bean"],
    },
    frequency: "bi-weekly",
    nextDelivery: "May 1",
    paymentStatus: "Pending",
    paymentRef: "#sub-1776124B000104-92e5",
    status: "Active",
  },
  {
    id: "sub-1776124B000104-92e8",
    customer: { name: "Kareem Nabil", email: "knabi@gmail.com" },
    plan: {
      quantity: 2,
      productName: "Colombian Coffee",
      tags: ["Medium", "Whole Bean"],
    },
    frequency: "Monthly",
    nextDelivery: "May 22",
    paymentStatus: "Pending",
    paymentRef: "#sub-1776124B000104-92e6",
    status: "Active",
  },
];

export const customerOptions = [
  { value: "omnia", label: "Omnia Maher" },
  { value: "esraa", label: "Esraa Abdalla" },
  { value: "kareem", label: "Kareem Nabil" },
];

export const productOptions = [
  { value: "sourdough", label: "Artisanal Sourdough" },
  { value: "brazilian-coffee", label: "Brazilian Coffee" },
  { value: "colombian-coffee", label: "Colombian Coffee" },
];

export const frequencyOptions = [
  { value: "Weekly", label: "Weekly" },
  { value: "bi-weekly", label: "bi-weekly" },
  { value: "Monthly", label: "Monthly" },
];

export const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Paused", label: "Paused" },
  { value: "Cancelled", label: "Cancelled" },
];
