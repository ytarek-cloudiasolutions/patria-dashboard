import {
  Coffee,
  LayoutDashboard,
  MapPin,
  Settings,
  ShoppingBag,
  Tag,
  UserCircle,
  Users,
} from "lucide-react";
import type { PermissionPage } from "../types";

export const PAGE_ICONS: Record<
  PermissionPage,
  { icon: React.ComponentType<{ size?: number; className?: string }>; color: string }
> = {
  Home: { icon: LayoutDashboard, color: "text-[#B56C00]" },
  "Order Management": { icon: ShoppingBag, color: "text-primary" },
  "Product Catalog": { icon: Coffee, color: "text-[#3357B5]" },
  "Customer Base": { icon: Users, color: "text-[#9524E4]" },
  "Offers & Discounts": { icon: Tag, color: "text-[#059B5A]" },
  Profile: { icon: UserCircle, color: "text-[#28293D]" },
  "General Settings": { icon: Settings, color: "text-[#28293D]" },
  "Users & Permissions": { icon: UserCircle, color: "text-[#C90000]" },
  "Branches & Locations": { icon: MapPin, color: "text-[#28293D]" },
};

interface PageChipProps {
  page: PermissionPage;
}

const PageChip = ({ page }: PageChipProps) => {
  const { icon: Icon, color } = PAGE_ICONS[page];
  return (
    <span className="inline-flex items-center gap-1 rounded-[30px] border border-[#E5E5E5] bg-white px-2 py-0.5 text-[10px] font-semibold text-black">
      <Icon size={12} className={color} />
      {page}
    </span>
  );
};

export default PageChip;
