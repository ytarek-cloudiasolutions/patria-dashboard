import DatePicker from "@/shared/components/DatePicker";
import type { PricingDateRange as PricingDateRangeType } from "../types";

interface PricingDateRangeProps {
  value: PricingDateRangeType;
  onChange: (value: PricingDateRangeType) => void;
}

const PricingDateRange = ({ value, onChange }: PricingDateRangeProps) => (
  <div className="mb-6 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
    <DatePicker
      value={value.from}
      onChange={(from) => onChange({ ...value, from })}
      placeholder="From"
      popoverPlacement="bottom-right"
      withBackdrop
    />
    <DatePicker
      value={value.to}
      onChange={(to) => onChange({ ...value, to })}
      placeholder="To"
      popoverPlacement="bottom-right"
      minDate={value.from || undefined}
      withBackdrop
    />
  </div>
);

export default PricingDateRange;
