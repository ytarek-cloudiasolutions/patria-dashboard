import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserRole } from "../types";

const ROLE_STYLES: Record<UserRole, string> = {
  Staff: "bg-[#DCDCDC] text-[#23252A] border-[#595959]",
  Admin: "bg-[#EDF4FB] text-[#3574FF] border-[#004EF9]",
  User: "bg-[#F3E9FA] text-[#9524E4] border-[#7E00D7]",
  Manager: "bg-[#FFF5DC] text-[#C7861E] border-[#C7861E]",
  "POS/Cashier": "bg-[#E2F4ED] text-[#059B5A] border-[#059B5A]",
};

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const RoleBadge = ({ role, className }: RoleBadgeProps) => (
  <Badge
    className={cn(
      "h-6 rounded-[30px] border px-3 py-1 text-[11px] font-semibold",
      ROLE_STYLES[role],
      className,
    )}
  >
    {role}
  </Badge>
);

export default RoleBadge;
