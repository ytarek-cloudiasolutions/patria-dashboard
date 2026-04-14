import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

const SidebarLogoutButton = () => {
  const navigate = useNavigate();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="mt-60">
        <SidebarMenuButton onClick={() => navigate("/")}>
          <LogOut />
          <span className="font-medium text-[12px]">Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarLogoutButton;
