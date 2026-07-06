import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserRole } from "../types";

const ROLE_STYLES: Record<UserRole, string> = {
  superadmin: "bg-[#EDF4FB] text-[#3574FF] border-[#004EF9]",
  admin: "bg-[#EDF4FB] text-[#3574FF] border-[#004EF9]",
  manager: "bg-[#FFF5DC] text-[#C7861E] border-[#C7861E]",
  cashier: "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]",
  kitchen: "bg-[#F5F0EA] text-[#8F6900] border-[#8F6900]",
  staff: "bg-[#DCDCDC] text-[#23252A] border-[#595959]",
};

const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  cashier: "Cashier",
  kitchen: "Kitchen",
  staff: "Staff",
};

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const RoleBadge = ({ role, className }: RoleBadgeProps) => (
  <Badge
    className={cn(
      "h-6 rounded-[30px] border px-3 py-1 text-[11px] font-semibold",
      ROLE_STYLES[role] || "bg-[#DCDCDC] text-[#23252A] border-[#595959]",
      className,
    )}
  >
    {ROLE_LABELS[role] || role}
  </Badge>
);

export default RoleBadge;
