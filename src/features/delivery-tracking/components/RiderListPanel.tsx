import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Rider } from "../types";
import RiderCard from "./RiderCard";

interface RiderListPanelProps {
  riders: Rider[];
  onSelectRider: (rider: Rider) => void;
}

const RiderListPanel = ({ riders, onSelectRider }: RiderListPanelProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex max-h-full flex-col rounded-[16px] border border-[#CACBD4] bg-[#F5F0EA]">
      {/* Header — pinned */}
      <div className="shrink-0 px-3 pt-3 pb-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-normal text-[#28293D]">
            {t("Active Riders:")}
          </span>
          <span className="text-[12px] text-[#8B8B8B]">
            {riders.length} {t("Riders")}
          </span>
        </div>

        {/* Separator */}
        <div className="mt-3 h-px bg-[#E5E5E5]" />
      </div>

      {/* Scrollable rider list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pt-3 pb-5">
        <div className="flex flex-col gap-3">
          {riders.map((rider) => (
            <RiderCard key={rider.id} rider={rider} onClick={onSelectRider} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiderListPanel;
