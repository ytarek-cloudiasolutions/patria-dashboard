export type SubscriptionFrequency = "Weekly" | "bi-weekly" | "Monthly";
export type SubscriptionStatus = "Active" | "Paused" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending" | "Failed";

export type ProductGrind = "Whole Bean" | "Ground" | "Espresso";
export type RoastLevel = "Light" | "Medium" | "Dark";

export interface SubscriptionProduct {
  id: string;
  name: string;
  roast: RoastLevel;
  grind: ProductGrind;
}

export interface CustomerOption {
  id: string;
  name: string;
  email: string;
}

export interface Subscription {
  id: number;
  reference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  roast: RoastLevel;
  grind: ProductGrind;
  quantity: number;
  frequency: SubscriptionFrequency;
  nextDelivery: string;
  paymentStatus: PaymentStatus;
  status: SubscriptionStatus;
}

export interface NewSubscriptionFormData {
  customerId: string;
  productId: string;
  quantity: string;
  frequency: SubscriptionFrequency;
  firstDelivery: string;
}

export interface ManageSubscriptionFormData {
  status: SubscriptionStatus;
  frequency: SubscriptionFrequency;
  quantity: string;
  nextDelivery: string;
}
