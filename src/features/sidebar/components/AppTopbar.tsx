import { useState } from "react";
import { Sun, Bell, PanelLeftClose, PanelRightClose, Languages } from "lucide-react";
import { useSidebar } from "@/shared/components/ui/sidebar";
import { useTranslation } from "@/shared/i18n/useTranslation";
import NotificationsPanel from "@/features/notifications/components/NotificationsPanel";

interface AppTopbarProps {
  adminName?: string;
  adminEmail?: string;
  adminInitials?: string;
  notificationCount?: number;
}

const AppTopbar = ({
  adminName = "Admin User",
  adminEmail = "admin@erb.com",
  adminInitials = "OM",
  notificationCount = 2,
}: AppTopbarProps) => {
  const { toggleSidebar } = useSidebar();
  const { language, toggleLanguage, dir } = useTranslation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const PanelIcon = dir === "rtl" ? PanelRightClose : PanelLeftClose;

  return (
    <header className="flex h-16 items-center justify-between border-b border-white bg-white px-4 sm:h-21 sm:px-8 sm:pt-6">
      {/* Toggle sidebar */}
      <button
        onClick={toggleSidebar}
        className="text-[#000000] transition-colors cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <PanelIcon size={22} />
      </button>

      {/* Right section */}
      <div className="flex items-center gap-3 sm:gap-8">
        {/* Language toggle (English / Arabic) */}
        <button
          onClick={toggleLanguage}
          aria-label="Toggle language"
          className="flex h-8 items-center gap-1.5 rounded-[16px] bg-[#FAFAF7] px-2.5 text-[12px] font-semibold text-[#000000] cursor-pointer sm:h-9 sm:px-3 sm:text-[13px]"
        >
          <Languages size={18} />
          {language === "en" ? "العربية" : "English"}
        </button>

        {/* Theme toggle */}
        <button className="flex h-8 w-8 items-center justify-center rounded-[16px] text-[#000000] bg-[#FAFAF7] cursor-pointer sm:h-9 sm:w-9">
          <Sun size={20} />
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => setIsNotifOpen(true)}
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-[16px] text-[#000000] bg-[#FAFAF7] cursor-pointer sm:h-9 sm:w-9"
        >
          <Bell size={20} />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C90000] text-[8px] font-semibold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        <NotificationsPanel open={isNotifOpen} onOpenChange={setIsNotifOpen} />

        {/* Admin info */}
        <div className="flex items-center gap-2 sm:gap-3.25">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white sm:h-9 sm:w-9 sm:text-[13px]">
            {adminInitials}
          </div>
          {/* Hide name/email on very small screens */}
          <div className="hidden sm:block">
            <p className="text-[14px] font-semibold text-[#333333]">
              {adminName}
            </p>
            <p className="text-[12px] text-[#8B8B8B]">{adminEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppTopbar;
