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
  Type,
  Receipt,
  ReceiptText,
  MessageSquare,
  MessageSquareMore, // Logout
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  isActive: boolean;
}
const AdministrationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: "User's & Permissions",
      icon: <User />,
      path: "/users-permissions",
      isActive: location.pathname === "/users-permissions",
    },
    {
      label: "Settings",
      icon: <Settings />,
      path: "/settings",
      isActive: location.pathname === "/settings",
    },

    {
      label: "WhatsApp Gateway",
      icon: <MessageSquareMore />,
      path: "/whatsapp-gateway",
      isActive: location.pathname === "/whatsapp-gateway",
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

      {/* Logout Button at Bottom */}
      <SidebarMenuItem className="mt-14">
        <SidebarMenuButton
          onClick={() => navigate("/sign-in")}
          className="data-active:bg-primary data-active:text-white rounded-[16px]"
        >
          <LogOut size={18} />
          <span className="font-medium text-[12px]">Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default AdministrationMenu;
