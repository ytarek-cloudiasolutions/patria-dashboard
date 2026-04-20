export type InventoryStatus = "critical" | "low" | "normal" | "excess";

export interface InventoryMetric {
  id: string;
  title: string;
  value: number;
  cardColor: string;
  iconColor: string;
  valueColor: string;
  icon: "package" | "alert" | "triangle" | "arrow-up";
}

export interface StockLevelIndicator {
  status: InventoryStatus;
  label: string;
  bgColor: string;
  textColor: string;
}

export interface KitchenInventoryDistribution {
  critical: number;
  low: number;
  normal: number;
  excess: number;
}

export interface KitchenInventorySummary {
  id: string;
  name: string;
  icon: "main" | "barista" | "pastry";
  accentColor: string;
  totalTrackedItems: number;
  distribution: KitchenInventoryDistribution;
  status: "active";
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: InventoryStatus;
}

export interface KitchenInventoryDetails extends KitchenInventorySummary {
  subtitle: string;
  items: InventoryItem[];
}

export interface InventoryOverviewCardsProps {
  metrics: InventoryMetric[];
}

export interface StockLevelsProps {
  levels: StockLevelIndicator[];
}
