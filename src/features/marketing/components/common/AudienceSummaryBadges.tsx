import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface AudienceSummaryBadgesProps {
  customerCount?: number;
  deviceCount?: number;
  womenCount?: number;
  menCount?: number;
  className?: string;
}

export const AudienceSummaryBadges = ({
  customerCount = 12,
  deviceCount = 8,
  womenCount = 7,
  menCount = 1,
  className,
}: AudienceSummaryBadgesProps) => {
  const { t } = useTranslation();

  const renderGenderSummary = () => {
    if (womenCount > 0 && menCount > 0) {
      return `${womenCount} ${t("Women")} • ${menCount} ${t("Men")}`;
    }
    if (womenCount > 0) {
      return `${womenCount} ${t("Women")}`;
    }
    if (menCount > 0) {
      return `${menCount} ${t("Men")}`;
    }
    return null;
  };

  const genderSummary = renderGenderSummary();

  return (
    <div className={cn("inline-flex flex-wrap items-center gap-3 w-full", className)}>
      {/* Primary / Amber Badge */}
      <div className="flex items-center gap-1 px-3 py-1 rounded-[30px] border border-[#8F6900] bg-[#F5F0EA] transition-transform duration-200 hover:scale-[1.03]">
        <span className="text-[#8F6900] text-[12px] font-semibold font-['Montserrat',sans-serif] tracking-tight whitespace-nowrap">
          {customerCount} {t("Customers in this audience")}
        </span>
      </div>

      {/* Blue Badge */}
      <div className="flex items-center gap-1 px-3 py-1 rounded-[30px] border border-[#004EF9] bg-[#EDF4FB] transition-transform duration-200 hover:scale-[1.03]">
        <span className="text-[#004EF9] text-[12px] font-semibold font-['Montserrat',sans-serif] tracking-tight whitespace-nowrap">
          {deviceCount} {t("devices will  get it")}
        </span>
      </div>

      {/* Purple Badge */}
      {genderSummary && (
        <div className="flex items-center gap-1 px-3 py-1 rounded-[30px] border border-[#7E00D7] bg-[#F3E9FA] transition-transform duration-200 hover:scale-[1.03]">
          <span className="text-[#7E00D7] text-[12px] font-semibold font-['Montserrat',sans-serif] tracking-tight whitespace-nowrap">
            {genderSummary}
          </span>
        </div>
      )}
    </div>
  );
};
