import DatePicker from "@/shared/components/DatePicker";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { AccountDateRange as AccountDateRangeType } from "../types";

interface AccountDateRangeProps {
  value: AccountDateRangeType;
  onChange: (value: AccountDateRangeType) => void;
}

const AccountDateRange = ({ value, onChange }: AccountDateRangeProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
      <DatePicker
        value={value.from}
        onChange={(from) => onChange({ ...value, from })}
        placeholder={t("From")}
        popoverPlacement="bottom-right"
        withBackdrop
      />
      <DatePicker
        value={value.to}
        onChange={(to) => onChange({ ...value, to })}
        placeholder={t("To")}
        popoverPlacement="bottom-right"
        minDate={value.from || undefined}
        withBackdrop
      />
    </div>
  );
};

export default AccountDateRange;
