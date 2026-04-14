export type CustomerTier = "Gold" | "Silver" | "Bronze";

export type TierFilter = "All" | CustomerTier;

export interface Customer {
  id: number;
  name: string;
  role: string;
  nameSubtitle: string;
  isSubscriber?: boolean;
  email: string;
  phone: string;
  date: string;
  tier: CustomerTier;
  tierLabel: string;
  points: number;
  ltv: number;
  ltvLabel: string;
}

export interface CustomerTableRowProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
}

export interface CustomerTierBadgeProps {
  tier: CustomerTier;
  label: string;
}

export interface CustomerActionsProps {
  onEdit: () => void;
}
