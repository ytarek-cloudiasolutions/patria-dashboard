import { Clock, UserRound, SlidersHorizontal } from "lucide-react";

import SearchInputField from "@/shared/components/SearchInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useAuth } from "@/features/auth";

type PosTopbarProps = {
  search: string;
  timeLabel: string;
  onSearchChange: (value: string) => void;
  onAvailabilityClick?: () => void;
};

const PosTopbar = ({ search, timeLabel, onSearchChange, onAvailabilityClick }: PosTopbarProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const staffName = user?.name || "Mariam";
  const staffRole = user?.role || "Staff";
  const staffLabel = `${staffName} · ${staffRole}`;

  return (
    <header className="flex h-[74px] shrink-0 items-center justify-between gap-5 bg-white px-4 sm:px-6">
      <div className="max-w-[460px] flex-1">
        <SearchInputField
          value={search}
          onChange={onSearchChange}
          placeholder={t("Search products by name or SKU...")}
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Availability Button */}
        <button
          type="button"
          data-buttonactive="True"
          data-icononly="False"
          data-leading-icon="True"
          data-size="Small"
          data-trailing-icon="False"
          data-type="Secondary"
          onClick={onAvailabilityClick}
          className="group h-10 px-6 py-3 bg-[#F5F0EA] rounded-[5px] inline-flex justify-center items-center gap-3 cursor-pointer transition-all duration-200 hover:shadow-xs active:scale-95"
        >
          <SlidersHorizontal className="size-4 text-[#8F6900] transition-transform duration-200 group-hover:rotate-12" />
          <span className="text-[#8F6900] text-sm font-semibold font-['Montserrat'] leading-6">
            {t("Availability")}
          </span>
        </button>

        {/* Clock Badge */}
        <div className="flex h-[46px] items-center justify-center gap-3 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] px-6 transition-all duration-200 hover:border-[#D4D4D8] hover:shadow-xs">
          <Clock className="size-6 text-black stroke-[1.75]" />
          <span className="text-[14px] font-bold tracking-wide text-black">
            {timeLabel}
          </span>
        </div>

        {/* Cashier Badge */}
        <div className="group flex items-center gap-[13px] cursor-default">
          <div className="flex size-[36px] items-center justify-center rounded-full bg-[#8F6900] transition-transform duration-200 group-hover:scale-105">
            <UserRound className="size-5 text-white" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <p className="text-[14px] font-semibold leading-[14.98px] tracking-[0.28px] text-[#333333]">
              {t("Cashier")}
            </p>
            <p className="text-[12px] font-normal leading-[16.80px] tracking-[0.24px] text-[#8B8B8B]">
              {staffLabel}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PosTopbar;
