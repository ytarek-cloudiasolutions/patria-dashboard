import type { Order, OrderStatus } from "./types";

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 7,
    customerName: "Layla Ibrahim",
    customerPhone: "+20 122 555 7890",
    date: "Mar 15, 2026",
    location: "Kafr Abdo",
    total: 85.2,
    status: "Pending",
    category: "Delivery",
    deliveryZone: "Kafr Abdo",
    address: "12 Sea View St, Kafr Abdo",
    paymentMethod: "Cash",
    items: [
      {
        id: 1,
        name: "1X Kunafa Tiramisu",
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=80&h=80&fit=crop",
      },
      {
        id: 2,
        name: "1X Amber Sobia",
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=80&h=80&fit=crop",
      },
    ],
  },
  {
    id: 6,
    customerName: "Ahmed El-Sayed",
    customerPhone: "+20 122 555 7890",
    date: "Mar 15, 2026",
    location: "Semouha",
    total: 125.2,
    status: "Confirmed",
    category: "Dine-in",
    deliveryZone: "Semouha",
    address: "20 Semouha, Alex",
    paymentMethod: "Card",
    items: [
      {
        id: 3,
        name: "2X Shawarma Wrap",
        quantity: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=80&h=80&fit=crop",
      },
    ],
  },
  {
    id: 5,
    customerName: "Omar Khaled",
    customerPhone: "+20 122 555 7890",
    date: "Mar 15, 2026",
    location: "New Cairo",
    total: 1340.67,
    status: "Preparing",
    category: "Delivery",
    deliveryZone: "New Cairo",
    address: "89 Fifth Settlement",
    paymentMethod: "Card",
    items: [
      {
        id: 4,
        name: "Family Meal",
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop",
      },
    ],
  },
  {
    id: 4,
    customerName: "Youssef Nabil",
    customerPhone: "+20 122 555 7890",
    date: "Mar 15, 2026",
    location: "Dokki",
    total: 110.45,
    status: "Out for Delivery",
    category: "Pickup",
    deliveryZone: "Dokki",
    address: "14 Tahrir St, Dokki",
    paymentMethod: "Cash",
    items: [
      {
        id: 5,
        name: "2X Kofta Meal",
        quantity: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=80&h=80&fit=crop",
      },
    ],
  },
  {
    id: 3,
    customerName: "Laila Ahmed",
    customerPhone: "+20 122 555 7890",
    date: "Mar 15, 2026",
    location: "Maadi",
    total: 720,
    status: "Delivered",
    category: "Delivery",
    deliveryZone: "Maadi",
    address: "10 Nile Corniche, Maadi",
    paymentMethod: "Card",
    items: [
      {
        id: 6,
        name: "3X Chicken Rice Bowl",
        quantity: 3,
        imageUrl:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=80&h=80&fit=crop",
      },
    ],
  },
  {
    id: 2,
    customerName: "Mona El-Sharif",
    customerPhone: "+20 122 555 7890",
    date: "Mar 15, 2026",
    location: "Zamalek",
    total: 680.89,
    status: "Cancelled",
    category: "Dine-in",
    deliveryZone: "Zamalek",
    address: "3 Brazil St, Zamalek",
    paymentMethod: "Card",
    items: [
      {
        id: 7,
        name: "1X Kunafa Tiramisu",
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=80&h=80&fit=crop",
      },
      {
        id: 8,
        name: "1X Amber Sobia",
        quantity: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=80&h=80&fit=crop",
      },
    ],
  },
  {
    id: 1,
    customerName: "Dina Samir",
    customerPhone: "+20 122 555 7890",
    date: "Mar 15, 2026",
    location: "Zamalek",
    total: 180,
    status: "Pending",
    category: "Pickup",
    deliveryZone: "Zamalek",
    address: "7 Hassan Sabry, Zamalek",
    paymentMethod: "Cash",
    items: [
      {
        id: 9,
        name: "2X Beef Burger",
        quantity: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?w=80&h=80&fit=crop",
      },
    ],
  },
];
