export type KitchenStatus = "active" | "busy";

export type KitchenIcon = "main" | "pastry" | "barista";

export interface Kitchen {
  id: string;
  name: string;
  description: string;
  status: KitchenStatus;
  color: string;
  icon: KitchenIcon;
  activeOrders: number;
  requests: number;
  detailActiveOrders: number;
  lowStock: number;
}

export type OrderType = "takeaway" | "dine-in";

export type OrderStatus = "delivered" | "preparing" | "rejected";

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  receivedAt: string;
  customerType: string;
  customerPhone: string;
  items: string[];
  type: OrderType;
  status: OrderStatus;
}
