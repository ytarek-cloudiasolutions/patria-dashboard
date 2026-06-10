import { Clock, UserRound } from "lucide-react";

import SearchInputField from "@/shared/components/SearchInputField";
import { useTranslation } from "@/shared/i18n/useTranslation";

type PosTopbarProps = {
  search: string;
  timeLabel: string;
  onSearchChange: (value: string) => void;
};

const PosTopbar = ({ search, timeLabel, onSearchChange }: PosTopbarProps) => {
  const { t } = useTranslation();

  return (
    <header className="flex h-[74px] shrink-0 items-center justify-between gap-5 border-b border-[#EDEBE7] bg-white px-4 sm:px-6">
      <div className="max-w-[460px] flex-1">
        <SearchInputField
          value={search}
          onChange={onSearchChange}
          placeholder={t("Search products by name or SKU...")}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-[10px] border border-[#E8E6E1] bg-[#FCFBF8] px-4 text-[13px] font-semibold text-[#333333]">
          <Clock className="size-4 text-primary" />
          {timeLabel}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary">
            <UserRound className="size-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[13px] font-semibold leading-4 text-[#333333]">
              {t("Cashier")}
            </p>
            <p className="text-[11px] text-[#8B8B8B]">Mariam - Staff</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PosTopbar;
