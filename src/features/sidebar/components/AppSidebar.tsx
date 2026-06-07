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
import { useTranslation } from "@/shared/i18n/useTranslation";
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
  const { t, dir } = useTranslation();

  return (
    <Sidebar
      collapsible="offcanvas"
      side={dir === "rtl" ? "right" : "left"}
      className="border-e border-white"
    >
      {/* Header — Brand + POS button */}
      <SidebarHeader className="bg-white px-3 pt-6 sm:pt-8">
        {/* Brand */}
        <div className="mb-4 flex items-center gap-3 sm:mb-4.5 sm:gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] bg-primary sm:h-10 sm:w-10">
            <Store size={22} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[17px] font-semibold text-[#333333] sm:text-[18px]">
              Patria
            </p>
            <p className="truncate text-[11px] text-[#595959] sm:text-[12px]">
              {t("Admin Dashboard")}
            </p>
          </div>
        </div>

        {/* Open POS Button */}
        <button
          onClick={onOpenPOS}
          className="flex w-full items-center justify-center gap-2 rounded-[5px] bg-primary px-4 py-2.5 text-[12px] font-semibold text-white cursor-pointer sm:gap-3 sm:px-6 sm:py-3 transition-opacity hover:opacity-90"
        >
          <ShoppingCart size={17} className="shrink-0" />
          <span>{t("Open POS System")}</span>
        </button>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-white">
        {NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.title}>
            {section.title && (
              <SidebarGroupLabel className="text-[10px] tracking-widest font-bold text-[#595959]">
                {t(section.title)}
              </SidebarGroupLabel>
            )}

            <SidebarMenu>
              {section.items.map((item) => {
                const isActive = activePath === item.href;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
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
                          size={16}
                          className={cn(
                            "shrink-0",
                            isActive ? "text-white" : "text-[#595959]"
                          )}
                        />
                        <span className="truncate">{t(item.label)}</span>
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
                <LogOut size={16} className="shrink-0" />
                <span>{t("Logout")}</span>
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
