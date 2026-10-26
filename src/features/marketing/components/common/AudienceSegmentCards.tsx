import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AudienceSegment } from "../../types";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface AudienceSegmentCardsProps {
  selectedSegment: AudienceSegment;
  onSelectSegment: (segment: AudienceSegment) => void;
  inactiveDays: number;
  onInactiveDaysChange: (days: number) => void;
  className?: string;
}

interface SegmentItem {
  id: AudienceSegment;
  title: string;
  subtitle: string;
  countBadge: string;
}

export const AudienceSegmentCards = ({
  selectedSegment,
  onSelectSegment,
  inactiveDays,
  onInactiveDaysChange,
  className,
}: AudienceSegmentCardsProps) => {
  const { t } = useTranslation();

  const segments: SegmentItem[] = [
    {
      id: "all",
      title: t("All Customers"),
      subtitle: t("Everyone registered in the app"),
      countBadge: `398 ${t("Customers")}`,
    },
    {
      id: "inactive",
      title: t("Haven’t Ordered Lately"),
      subtitle: t("Ordered before, but not in the last {days} days.").replace(
        "{days}",
        String(inactiveDays)
      ),
      countBadge: `142 ${t("Customers")}`,
    },
    {
      id: "never_ordered",
      title: t("Never Ordered"),
      subtitle: t("Signed up but never placed an order"),
      countBadge: `96 ${t("Customers")}`,
    },
    {
      id: "recent",
      title: t("Ordered Recently"),
      subtitle: t("Ordered within the last 7 days"),
      countBadge: `178 ${t("Customers")}`,
    },
    {
      id: "loyal",
      title: t("Loyal Customers"),
      subtitle: t("Placed at least 5 orders in total"),
      countBadge: `54 ${t("Customers")}`,
    },
    {
      id: "birthday",
      title: t("Birthday"),
      subtitle: t("Customers that have a birthday today"),
      countBadge: `54 ${t("Customers")}`,
    },
  ];

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {segments.map((seg) => {
          const isSelected = selectedSegment === seg.id;
          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => onSelectSegment(seg.id)}
              className={cn(
                "w-full px-3 py-4 rounded-[5px] outline outline-2 outline-offset-[-2px] inline-flex flex-col justify-start items-start gap-1 overflow-hidden cursor-pointer text-left transition-all",
                isSelected
                  ? "bg-[#F5F0EA] outline-[#8F6900]"
                  : "bg-white outline-[#CACBD4] hover:outline-[#8F6900]/50"
              )}
            >
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                {/* Radio Indicator */}
                <div className="size-3.5 relative shrink-0">
                  {isSelected ? (
                    <div className="size-3.5 left-0 top-0 absolute bg-[#8F6900] rounded-full outline outline-[2.80px] outline-yellow-900/10" />
                  ) : (
                    <div className="size-3.5 left-0 top-0 absolute rounded-full outline outline-[0.70px] outline-[#8F6900]" />
                  )}
                </div>

                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2 min-w-0">
                  <div className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="self-stretch inline-flex justify-start items-start gap-2">
                      <div className="justify-start text-black text-xs font-semibold font-['Montserrat',sans-serif] leading-3 tracking-tight">
                        {seg.title}
                      </div>
                    </div>
                    <div className="self-stretch inline-flex justify-start items-start gap-2">
                      <div className="flex-1 justify-start text-[#8C8C8C] text-xs font-normal font-['Montserrat',sans-serif] leading-4 tracking-tight">
                        {seg.subtitle}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex justify-center items-center gap-2">
                    <div className="justify-start text-[#8F6900] text-[10px] font-bold font-['Montserrat',sans-serif] tracking-tight">
                      {seg.countBadge}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Input Field: Number of days (shown when "Haven't Ordered Lately" is selected) */}
      {selectedSegment === "inactive" && (
        <div className="pt-2 flex flex-col justify-start items-start gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <label className="block text-xs font-semibold text-[#1A1A1A] font-['Montserrat',sans-serif]">
            {t("Number of days")}
          </label>
          <div className="self-stretch h-12 px-3.5 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-[#CACBD4] focus-within:outline-[#8F6900] flex justify-between items-center gap-2 overflow-hidden">
            <div className="flex-1 flex items-center gap-1">
              <input
                type="number"
                min={1}
                max={365}
                value={inactiveDays}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onInactiveDaysChange(
                    isNaN(val) ? 1 : Math.max(1, Math.min(365, val))
                  );
                }}
                style={{
                  width: `${Math.max(1, String(inactiveDays).length)}ch`,
                }}
                className="p-0 m-0 border-0 text-[#1A1A1A] text-base font-normal font-['Montserrat',sans-serif] focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-left leading-none"
              />
              <span className="text-[#8B8B8B] text-base font-normal font-['Montserrat',sans-serif] select-none leading-none">
                {t("Days")}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center -space-y-0.5">
              <button
                type="button"
                onClick={() =>
                  onInactiveDaysChange(Math.min(365, inactiveDays + 1))
                }
                className="p-0.5 text-[#8B8B8B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                aria-label={t("Increase days")}
              >
                <ChevronUp className="size-4 stroke-[2]" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onInactiveDaysChange(Math.max(1, inactiveDays - 1))
                }
                className="p-0.5 text-[#8B8B8B] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                aria-label={t("Decrease days")}
              >
                <ChevronDown className="size-4 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
