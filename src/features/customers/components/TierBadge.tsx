import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CustomerTier } from "../types";

interface TierBadgeProps {
  tier: CustomerTier;
  className?: string;
}

const TIER_STYLES: Record<CustomerTier, string> = {
  Gold: "bg-[#FFF0D2] text-[#B56C00] border-[#B56C00]/40",
  Silver: "bg-[#EAEAEA] text-[#5A5A66] border-[#8B8B8B]/40",
  Bronze: "bg-[#E3ECFF] text-[#3357B5] border-[#3357B5]/40",
};

const TIER_LABEL: Record<CustomerTier, string> = {
  Gold: "GOLD (WHOLESALE VIP)",
  Silver: "SILVER (PRO)",
  Bronze: "BRONZE (STANDARD)",
};

const TierBadge = ({ tier, className }: TierBadgeProps) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-6 px-3 py-0.5 text-[11px] font-semibold border rounded-full tracking-wide uppercase",
        TIER_STYLES[tier],
        className,
      )}
    >
      {t(TIER_LABEL[tier])}
    </Badge>
  );
};

export default TierBadge;
