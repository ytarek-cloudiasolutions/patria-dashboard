import { ShoppingCart, LogOut, Store } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar";

import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "../data";

interface AppSidebarProps {
  activePath?: string;
  onNavigate?: (href: string) => void;
  onOpenPOS?: () => void;
  onLogout?: () => void;
}

const AppSidebar = ({
  activePath = "/reports",
  onNavigate,
  onOpenPOS,
  onLogout,
}: AppSidebarProps) => {
  return (
    <Sidebar className="border-r border-white">
      {/* Header — Brand + POS button */}
      <SidebarHeader className="bg-white px-3 pt-8">
        {/* Brand */}
        <div className="mb-4.5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-primary">
            <Store size={24} className="text-white" />
          </div>
          <div>
            <p className="text-[18px] font-semibold text-[#333333]">Patria</p>
            <p className="text-[12px] text-[#595959]">Admin Dashboard</p>
          </div>
        </div>

        {/* Open POS Button */}
        <button
          onClick={onOpenPOS}
          className="flex w-full items-center justify-center gap-3 rounded-[5px] bg-primary px-6 py-3 text-[12px] font-semibold text-white cursor-pointer"
        >
          <ShoppingCart size={18} />
          Open POS System
        </button>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-white">
        {NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.title}>
            {section.title && (
              <SidebarGroupLabel className="text-[10px] tracking-widest font-bold text-[#595959]">
                {section.title}
              </SidebarGroupLabel>
            )}

            <SidebarMenu>
              {section.items.map((item) => {
                const isActive = activePath === item.href;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href} className="py-2">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "flex w-full items-center gap-1.5 rounded-[16px] px-3 py-2 text-[12px] transition-colors cursor-pointer",
                        "font-medium text-[#595959] hover:bg-[#F5F0EA]",
                        "data-[active=true]:font-semibold data-[active=true]:bg-primary data-[active=true]:text-white"
                      )}
                    >
                      <button onClick={() => onNavigate?.(item.href)}>
                        <Icon
                          size={18}
                          className={cn(
                            "shrink-0",
                            isActive ? "text-white" : "text-[#595959]"
                          )}
                        />
                        <span>{item.label}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer — Logout */}
      <SidebarFooter className="px-3 py-4 border-t border-[#F3F3F3] bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex w-full items-center gap-1.5 rounded-[16px] text-[12px] text-[#595959] hover:bg-[#F5F0EA] transition-colors cursor-pointer"
            >
              <button onClick={onLogout}>
                <LogOut size={18} className="shrink-0" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
