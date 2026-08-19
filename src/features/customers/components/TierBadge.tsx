import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { CustomerTier } from "../types";

interface TierBadgeProps {
  tier?: string | CustomerTier;
  className?: string;
}

const normalizeTier = (tier?: string): "Gold" | "Silver" | "Bronze" => {
  if (!tier) return "Bronze";
  const lower = tier.toLowerCase();
  if (lower.includes("gold")) return "Gold";
  if (lower.includes("silver")) return "Silver";
  return "Bronze";
};

const TIER_STYLES: Record<"Gold" | "Silver" | "Bronze", string> = {
  Gold: "bg-[rgba(254,154,0,0.10)] text-[#C7861E] border-[#C7861E]",
  Silver: "bg-[#E5E5E5] text-[#23252A] border-[#8B8B8B]",
  Bronze: "bg-[#EDF4FB] text-[#3574FF] border-[#053CB8]",
};

const TIER_LABEL: Record<"Gold" | "Silver" | "Bronze", string> = {
  Gold: "GOLD",
  Silver: "SILVER",
  Bronze: "BRONZE",
};

const TierBadge = ({ tier, className }: TierBadgeProps) => {
  const { t } = useTranslation();
  const normalized = normalizeTier(tier);

  return (
    <Badge
      className={cn(
        "px-2.5 py-0.5 text-[11px] font-semibold border rounded-[30px] tracking-[0.22px] uppercase justify-center items-center gap-1 shrink-0 shadow-none",
        TIER_STYLES[normalized],
        className
      )}
    >
      {t(TIER_LABEL[normalized])}
    </Badge>
  );
};

export default TierBadge;
