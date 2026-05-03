export interface OverviewCardProps {
  id?: number;
  title: string;
  value: number | string;
  badgeColor: string;
  icon: React.ReactNode;
  iconColor: string;
  trend?: {
    value: React.ReactNode;
    tone: "positive" | "negative" | "neutral";
  };
}
