import { Clock, UserRound } from "lucide-react";

import SearchInputField from "@/shared/components/SearchInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { useAuth } from "@/features/auth";

type PosTopbarProps = {
  search: string;
  timeLabel: string;
  onSearchChange: (value: string) => void;
};

const PosTopbar = ({ search, timeLabel, onSearchChange }: PosTopbarProps) => {
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

      <div className="flex items-center gap-6">
        {/* Clock Badge */}
        <div className="flex h-[46px] items-center justify-center gap-3 rounded-[16px] border border-[#E5E5E5] bg-[#FAFAF7] px-6">
          <Clock className="size-6 text-black stroke-[1.75]" />
          <span className="text-[14px] font-bold tracking-wide text-black">
            {timeLabel}
          </span>
        </div>

        {/* Cashier Badge */}
        <div className="flex items-center gap-[13px]">
          <div className="flex size-[36px] items-center justify-center rounded-full bg-[#8F6900]">
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
