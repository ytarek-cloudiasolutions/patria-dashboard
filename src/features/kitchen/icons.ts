import {
  Beer,
  Beef,
  CakeSlice,
  ChefHat,
  Coffee,
  CookingPot,
  Croissant,
  CupSoda,
  Fish,
  IceCreamCone,
  Pizza,
  Refrigerator,
  Salad,
  Soup,
  Store,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export const KITCHEN_ICONS = [
  { id: "kitchen_hat", label: "Kitchen Hat", Icon: ChefHat },
  { id: "utensils", label: "Utensils", Icon: Utensils },
  { id: "coffee", label: "Coffee", Icon: Coffee },
  { id: "cooking_pot", label: "Cooking Pot", Icon: CookingPot },
  { id: "drinks", label: "Drinks", Icon: CupSoda },
  { id: "pizza", label: "Pizza", Icon: Pizza },
  { id: "fish", label: "Fish", Icon: Fish },
  { id: "ice_cream", label: "Ice Cream", Icon: IceCreamCone },
  { id: "grill", label: "Grill", Icon: Beef },
  { id: "store", label: "Store", Icon: Store },
  { id: "soup", label: "Soup", Icon: Soup },
  { id: "salad", label: "Salad", Icon: Salad },
  { id: "bakery", label: "Bakery", Icon: Croissant },
  { id: "fridge", label: "Fridge", Icon: Refrigerator },
  { id: "bar", label: "Bar", Icon: Beer },
  { id: "desserts", label: "Desserts", Icon: CakeSlice },
] as const;

export type KitchenIconId = (typeof KITCHEN_ICONS)[number]["id"];

export type KitchenIconOption = (typeof KITCHEN_ICONS)[number];

export const getKitchenIcon = (id: string): LucideIcon =>
  KITCHEN_ICONS.find((option) => option.id === id)?.Icon ?? ChefHat;
