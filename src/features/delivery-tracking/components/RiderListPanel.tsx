import { useMemo, useState } from "react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Rider } from "../types";
import RiderCard from "./RiderCard";

interface RiderListPanelProps {
  riders: Rider[];
  onSelectRider: (rider: Rider) => void;
}

type FilterType = "All" | "On-Route" | "Active" | "Delivered";

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "All", label: "All" },
  { key: "On-Route", label: "On-Route" },
  { key: "Active", label: "Active" },
  { key: "Delivered", label: "Delivered" },
];

const RiderListPanel = ({ riders, onSelectRider }: RiderListPanelProps) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const counts = useMemo(
    () => ({
      All: riders.length,
      "On-Route": riders.filter((r) => r.status === "On-Route").length,
      Active: riders.filter((r) => r.status === "Active").length,
      Delivered: riders.filter((r) => r.status === "Delivered").length,
    }),
    [riders],
  );

  const filteredRiders = useMemo(() => {
    if (activeFilter === "All") return riders;
    return riders.filter((rider) => rider.status === activeFilter);
  }, [riders, activeFilter]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-[#CACBD4] bg-[#F5F0EA]">
      {/* Header — pinned */}
      <div className="shrink-0 px-3 pt-3 pb-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[13px] font-normal text-[#28293D]">
            {t("Active Riders:")}
          </span>
          <span className="text-[12px] text-[#8B8B8B]">
            {riders.length} {t("Riders")}
          </span>
        </div>

        {/* Project standard tabs */}
        <div className="flex items-center border-b border-[#E5E5E5]">
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActiveFilter(f.key)}
                className={`relative flex flex-1 items-center justify-center gap-1 py-2.5 px-1 text-[12px] font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
                  isActive
                    ? "border-primary text-[#28293D]"
                    : "border-transparent text-[#8B8B8B] hover:text-[#28293D] hover:border-[#CACBD4]"
                }`}
              >
                <span className="whitespace-nowrap">{t(f.label)}</span>
                {counts[f.key] !== undefined && (
                  <span
                    className={`flex items-center justify-center min-w-4.5 h-4 px-1 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-[#8F6900]/15 text-[#8F6900]"
                        : "bg-[#E5E5E5] text-[#595959]"
                    }`}
                  >
                    {counts[f.key]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable rider list */}
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-3 pt-3 pb-5">
        {filteredRiders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-[#8B8B8B]">
            <p className="text-[13px] font-medium">{t("No riders found")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
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
