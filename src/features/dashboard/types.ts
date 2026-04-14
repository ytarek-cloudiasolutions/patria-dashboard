export interface RecentOrderProps {
  id: number;
  customerName: string;
  date: string;
  time: string;
  amount: string;
  status: "Confirmed" | "Preparing" | "Pending" | "Delivered" | "Cancelled";
}

export interface QuickActionItemProps {
  icon: string;
  label: string;
  onClick?: () => void;
}
