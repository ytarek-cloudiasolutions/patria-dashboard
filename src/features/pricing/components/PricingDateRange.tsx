import DatePicker from "@/shared/components/DatePicker";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { PricingDateRange as PricingDateRangeType } from "../types";

interface PricingDateRangeProps {
  value: PricingDateRangeType;
  onChange: (value: PricingDateRangeType) => void;
}

const PricingDateRange = ({ value, onChange }: PricingDateRangeProps) => {
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

export default PricingDateRange;
