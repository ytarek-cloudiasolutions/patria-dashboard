import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Sun } from "lucide-react";
import notifications from "@/assets/icons/notifications.svg";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
const DashboardHeader = () => {
  return (
    <header className="bg-card sticky top-0 z-50 flex h-21 items-center justify-between gap-6 border-b border-white px-4 py-2 sm:px-6 ">
      <SidebarTrigger className="[&_svg]:size-5!" />
      <div className="flex gap-8 items-center ml-auto">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FAFAF7]">
          <Sun className="size-5" />
        </div>
        <div className="relative w-fit">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FAFAF7]">
            <img src={notifications} alt="Notifications" className="w-6 h-6" />
          </div>
          <Badge className="absolute top-1 right-3 translate-x-1/2 flex items-center justify-center tabular-nums bg-[#C90000] text-white text-[10px] font-semibold rounded-full w-3.5 h-3.5 min-w-3.5 p-0">
            2
          </Badge>
        </div>
        <div className="flex items-center gap-3.25">
          <Avatar className="w-9 h-9 rounded-full">
            <AvatarFallback className="bg-primary text-white font-bold text-[13px]">
              YT
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-gray-900">
              Admin User
            </span>
            <span className="text-[12px] font-normal">admin@erb.com</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
