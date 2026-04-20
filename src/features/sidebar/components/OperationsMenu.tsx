import { useNavigate, useLocation } from "react-router-dom";
import {
  Store, // Dashboard
  ShoppingBag, // Orders
  Package, // Inventory
  UtensilsCrossed,
  Sofa,
  LayoutGrid,
  LayoutDashboardIcon, // Logout
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

const OperationsMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboardIcon />,
      path: "/",
      isActive: location.pathname === "/",
    },
    {
      label: "Orders",
      icon: <Store />,
      path: "/orders",
      isActive: location.pathname === "/orders",
    },
    {
      label: "Tables",
      icon: <Sofa />,
      path: "/tables",
      isActive: location.pathname === "/tables",
    },
    {
      label: "Kitchen",
      icon: <UtensilsCrossed />,
      path: "/kitchen",
      isActive: location.pathname.startsWith("/kitchen"),
    },

    {
      label: "Inventory",
      icon: <Package />,
      path: "/inventory",
      isActive: location.pathname.startsWith("/inventory"),
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

export default OperationsMenu;
