import { Sun, Bell, PanelLeftClose } from "lucide-react";
import { useSidebar } from "@/shared/components/ui/sidebar";

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

  return (
    <header className="flex h-21 items-center justify-between border-b border-white bg-white px-8 pt-6">
      {/* Toggle sidebar */}
      <button
        onClick={toggleSidebar}
        className="text-[#000000] transition-colors cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <PanelLeftClose size={24} />
      </button>

      {/* Right section */}
      <div className="flex items-center gap-8">
        {/* Theme toggle */}
        <button className="flex h-9 w-9 items-center justify-center rounded-[16px] text-[#000000] bg-[#FAFAF7] cursor-pointer">
          <Sun size={24} />
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-[16px] text-[#000000] bg-[#FAFAF7] cursor-pointer">
          <Bell size={24} />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C90000] text-[8px] font-semibold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Admin info */}
        <div className="flex items-center gap-3.25">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-white">
            {adminInitials}
          </div>
          <div>
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
