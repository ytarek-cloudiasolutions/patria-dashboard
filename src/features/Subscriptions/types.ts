export type SubscriptionStatus = "Active" | "Paused" | "Cancelled";
export type PaymentStatus = "Pending" | "Paid" | "Failed";
export type Frequency = "Weekly" | "bi-weekly" | "Monthly";

export interface SubscriptionCustomer {
  name: string;
  email: string;
}

export interface SubscriptionPlan {
  quantity: number;
  productName: string;
  tags?: string[];
}

export interface Subscription {
  id: string;
  customer: SubscriptionCustomer;
  plan: SubscriptionPlan;
  frequency: Frequency;
  nextDelivery: string;
  paymentStatus: PaymentStatus;
  paymentRef: string;
  status: SubscriptionStatus;
}

export interface NewSubscriptionForm {
  customerId: string;
  productId: string;
  frequency: Frequency;
  quantity: number;
  firstDeliveryDate: string;
}

export interface EditSubscriptionForm {
  status: SubscriptionStatus;
  frequency: Frequency;
  quantity: number;
  nextDeliveryDate: string;
}