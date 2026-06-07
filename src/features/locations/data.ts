import type { DeliveryZone } from "./types";

export const INITIAL_ZONES: DeliveryZone[] = [
  {
    id: 1,
    name: "Kafr Abdo",
    deliveryFee: 65,
    minOrderAmount: 250,
    status: "Active",
  },
  {
    id: 2,
    name: "Semouha",
    deliveryFee: 50,
    minOrderAmount: 200,
    status: "Active",
  },
  {
    id: 3,
    name: "Gleem",
    deliveryFee: 38,
    minOrderAmount: 150,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Sidi Gaber",
    deliveryFee: 45,
    minOrderAmount: 200,
    status: "Active",
  },
  {
    id: 5,
    name: "Moharam Bek",
    deliveryFee: 35,
    minOrderAmount: 150,
    status: "Active",
  },
  {
    id: 6,
    name: "Roushdy",
    deliveryFee: 55,
    minOrderAmount: 200,
    status: "Active",
  },
  {
    id: 7,
    name: "Zahraa El Maadi",
    deliveryFee: 40,
    minOrderAmount: 100,
    status: "Active",
  },
];
