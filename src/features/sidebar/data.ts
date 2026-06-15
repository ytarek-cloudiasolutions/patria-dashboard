import {
  LayoutDashboard,
  ShoppingBag,
  Armchair,
  ChefHat,
  Coffee,
  Tag,
  Ticket,
  Box,
  Users,
  Truck,
  MapPin,
  Star,
  ShoppingCart,
  Warehouse,
  BarChart2,
  CookingPot,
  UserCircle,
  Settings,
  MessageSquare,
  BadgeDollarSign,
  Receipt,
  Clock,
} from "lucide-react";
import type { NavSection } from "./types";

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "OPERATIONS",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Orders", href: "/orders", icon: ShoppingBag },
      { label: "Tables", href: "/tables", icon: Armchair },
      { label: "Kitchen", href: "/kitchen", icon: ChefHat },
    ],
  },
  {
    title: "PRODUCT & OFFERS",
    items: [
      { label: "Products", href: "/products", icon: Coffee },
      { label: "Offers", href: "/offers", icon: Tag },
      { label: "Coupons", href: "/coupons", icon: Ticket },
      { label: "Inventory", href: "/inventory", icon: Box },
    ],
  },
  {
    title: "CRM & LOGISTICS",
    items: [
      { label: "Customers", href: "/customers", icon: Users },
      { label: "Suppliers", href: "/suppliers", icon: Truck },
      { label: "Locations", href: "/locations", icon: MapPin },
      { label: "Reviews", href: "/reviews", icon: Star },
    ],
  },
  {
    title: "SUPPLY CHAIN",
    items: [
      { label: "Purchasing", href: "/purchasing", icon: ShoppingCart },
      { label: "Warehouses", href: "/warehouses", icon: Warehouse },
      { label: "Logistics", href: "/logistics", icon: BarChart2 },
      { label: "Production", href: "/production", icon: CookingPot },
      { label: "Subscription", href: "/subscriptions", icon: UserCircle },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { label: "Financial Hub", href: "/financial-hub", icon: BadgeDollarSign },
      { label: "Reports", href: "/reports", icon: Receipt },
      { label: "Pricing", href: "/pricing", icon: Tag },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      {
        label: "User's & Permissions",
        href: "/users-permissions",
        icon: UserCircle,
      },
      {
        label: "Shift Management",
        href: "/shift-management",
        icon: Clock,
      },
      {
        label: "WhatsApp Gateway",
        href: "/whatsapp-gateway",
        icon: MessageSquare,
      },
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "MY Account", href: "/account", icon: UserCircle },
    ],
  },
];
