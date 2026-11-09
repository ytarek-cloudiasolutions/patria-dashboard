import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface AudienceSummaryBadgesProps {
  customerCount?: number;
  className?: string;
}

export const AudienceSummaryBadges = ({ customerCount, className }: AudienceSummaryBadgesProps) => {
  const { t } = useTranslation();

  return (
    <div className={cn("inline-flex flex-wrap items-center gap-3 w-full", className)}>
      <div className="flex items-center gap-1 px-3 py-1 rounded-[30px] border border-[#8F6900] bg-[#F5F0EA] transition-transform duration-200 hover:scale-[1.03]">
        <span className="text-[#8F6900] text-[12px] font-semibold font-['Montserrat',sans-serif] tracking-tight whitespace-nowrap">
          {customerCount != null ? customerCount : "…"} {t("Customers in this audience")}
        </span>
      </div>
    </div>
  );
};
