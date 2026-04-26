import { useNavigate, useLocation } from "react-router-dom";
import {
  Store, // Dashboard
  ShoppingBag, // Orders
  Coffee, // Products
  Heart, // Offers (or Shield for offers)
  MapPin, // Locations
  Package, // Inventory
  Send, // Requests (or MessageSquare)
  Settings, // Settings
  LogOut,
  UtensilsCrossed,
  User,
  Car,
  TrendingUpDown,
  SubscriptIcon, // Logout
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { Avatar } from "radix-ui";
import { Children } from "react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
}

const CrmAndLogisticsMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: "Customers",
      icon: <User />,
      path: "/customers",
      isActive: location.pathname === "/customers",
    },
    {
      label: "Subscriptions",
      icon: <SubscriptIcon />,
      path: "/subscriptions",
      isActive: location.pathname === "/subscriptions",
    },
    {
      label: "Locations",
      icon: <MapPin />,
      path: "/locations",
      isActive: location.pathname === "/locations",
    },
    {
      label: "Logistics",
      icon: <Car />,
      path: "/logistics",
      isActive: location.pathname === "/logistics",
    },
    {
      label: "Production",
      icon: <TrendingUpDown />,
      path: "/production",
      isActive: location.pathname === "/production",
    },
    {
      label: "Requests",
      icon: <Send />,
      path: "/requests",
      isActive: location.pathname === "/requests",
    },
  ];
  return (
    <SidebarMenu className="*:mb-2 flex flex-col h-full">
      {navItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            onClick={() => navigate(item.path)}
            isActive={item.isActive}
            className="py-2 px-3 data-active:bg-primary data-active:text-white data-active:hover:bg-primary data-active:hover:text-white rounded-[16px]"
          >
            {item.icon}
            <span className="font-medium text-[12px]">{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      {/* Logout Button at Bottom
      <SidebarMenuItem className="mt-14">
        <SidebarMenuButton
          onClick={() => navigate("/")}
          className="data-active:bg-primary data-active:text-white rounded-[16px]"
        >
          <LogOut size={18} />
          <span className="font-medium text-[12px]">Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem> */}
    </SidebarMenu>
  );
};

export default CrmAndLogisticsMenu;
