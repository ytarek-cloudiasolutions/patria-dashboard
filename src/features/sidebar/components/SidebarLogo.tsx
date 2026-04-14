import { Store } from "lucide-react";

const SidebarLogo = () => {
  return (
    <div className="flex items-center gap-4 px-3 pt-8">
      <div className="bg-primary w-10 h-10 flex justify-center items-center rounded-[5px]">
        <Store className="text-white w-6 h-6" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-normal text-[18px]">Patria</span>
        <span className="font-normal text-[12px]">Admin Dashboard</span>
      </div>
    </div>
  );
};

export default SidebarLogo;
