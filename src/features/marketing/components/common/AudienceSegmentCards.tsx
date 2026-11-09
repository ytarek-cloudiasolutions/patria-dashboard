import { cn } from "@/lib/utils";
import type { AudienceSegment } from "../../types";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface AudienceSegmentCardsProps {
  selectedSegment: AudienceSegment;
  onSelectSegment: (segment: AudienceSegment) => void;
  counts?: Partial<Record<AudienceSegment, number>>;
  className?: string;
}

interface SegmentItem {
  id: AudienceSegment;
  title: string;
  subtitle: string;
}

export const AudienceSegmentCards = ({
  selectedSegment,
  onSelectSegment,
  counts,
  className,
}: AudienceSegmentCardsProps) => {
  const { t } = useTranslation();

  const segments: SegmentItem[] = [
    { id: "all", title: t("All Customers"), subtitle: t("Everyone registered in the app") },
    {
      id: "havent_ordered_lately",
      // Fixed server-side threshold (customerSegments.js STALE_DAYS) — not
      // operator-configurable, so this no longer offers a "days" input that
      // wouldn't actually change what gets queried.
      title: t("Haven't Ordered Lately"),
      subtitle: t("Ordered before, but not in the last 30 days"),
    },
    { id: "never_ordered", title: t("Never Ordered"), subtitle: t("Signed up but never placed an order") },
    { id: "ordered_recently", title: t("Ordered Recently"), subtitle: t("Ordered within the last 7 days") },
    { id: "loyal", title: t("Loyal Customers"), subtitle: t("Placed at least 5 orders in total") },
    { id: "birthday", title: t("Birthday"), subtitle: t("Customers that have a birthday today") },
  ];

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {segments.map((seg) => {
          const isSelected = selectedSegment === seg.id;
          const count = counts?.[seg.id];
          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => onSelectSegment(seg.id)}
              className={cn(
                "group w-full px-3 py-4 rounded-[5px] outline outline-2 outline-offset-[-2px] inline-flex flex-col justify-start items-start gap-1 overflow-hidden cursor-pointer text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.99]",
                isSelected
                  ? "bg-[#F5F0EA] outline-[#8F6900]"
                  : "bg-white outline-[#CACBD4] hover:outline-[#8F6900]/50"
              )}
            >
              <div className="self-stretch inline-flex justify-start items-start gap-2">
                {/* Radio Indicator */}
                <div className="size-3.5 relative shrink-0">
                  {isSelected ? (
                    <div className="size-3.5 left-0 top-0 absolute bg-[#8F6900] rounded-full outline outline-[2.80px] outline-yellow-900/10 transition-all duration-200 scale-105" />
                  ) : (
                    <div className="size-3.5 left-0 top-0 absolute rounded-full outline outline-[0.70px] outline-[#8F6900] transition-all duration-200 group-hover:scale-105" />
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
                      {count != null ? `${count} ${t("Customers")}` : "…"}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
