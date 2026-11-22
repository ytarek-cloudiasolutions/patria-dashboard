import { useMemo, useState } from "react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Rider } from "../types";
import RiderCard from "./RiderCard";

interface RiderListPanelProps {
  riders: Rider[];
  onSelectRider: (rider: Rider) => void;
}

type FilterType = "All" | "On-Route" | "Active";

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "All", label: "All" },
  { key: "On-Route", label: "On-Route" },
  { key: "Active", label: "Active" },
];

const RiderListPanel = ({ riders, onSelectRider }: RiderListPanelProps) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const counts = useMemo(
    () => ({
      All: riders.length,
      "On-Route": riders.filter((rider) => rider.status === "On-Route").length,
      Active: riders.filter((rider) => rider.status === "Active").length,
    }),
    [riders],
  );

  const filteredRiders = useMemo(
    () =>
      activeFilter === "All"
        ? riders
        : riders.filter((rider) => rider.status === activeFilter),
    [activeFilter, riders],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[#CACBD4] bg-[#F5F0EA]">
      {/* Header — pinned */}
      <div className="shrink-0 px-3 pt-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[13px] font-semibold text-black">
            {t("Active Riders:")}
          </span>
          <span className="text-[12px] font-semibold tracking-[0.24px] text-[#8B8B8B]">
            {riders.length} {t("Riders")}
          </span>
        </div>

        <div className="flex items-center border-b border-[#E5E5E5]">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`relative -mb-px flex flex-1 cursor-pointer items-center justify-center gap-1 border-b-2 px-1 py-2.5 text-[12px] font-semibold transition-all duration-150 active:scale-95 ${
                  isActive
                    ? "border-primary text-[#28293D]"
                    : "border-transparent text-[#8B8B8B] hover:border-[#CACBD4] hover:text-[#28293D]"
                }`}
              >
                <span className="whitespace-nowrap">{t(filter.label)}</span>
                <span
                  className={`flex h-4 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold transition-all duration-150 ${
                    isActive
                      ? "bg-[#8F6900]/15 text-[#8F6900]"
                      : "bg-[#E5E5E5] text-[#595959]"
                  }`}
                >
                  {counts[filter.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable rider list */}
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pt-3 pb-5">
        {filteredRiders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-[#8B8B8B] animate-in fade-in-50 duration-200">
            <p className="text-[13px] font-medium">{t("No riders found")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 animate-in fade-in-50 duration-200">
            {filteredRiders.map((rider) => (
              <RiderCard key={rider.id} rider={rider} onClick={onSelectRider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderListPanel;
