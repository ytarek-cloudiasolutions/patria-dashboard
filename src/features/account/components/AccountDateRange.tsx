import DatePicker from "@/shared/components/DatePicker";
import type { AccountDateRange as AccountDateRangeType } from "../types";

interface AccountDateRangeProps {
  value: AccountDateRangeType;
  onChange: (value: AccountDateRangeType) => void;
}

const AccountDateRange = ({ value, onChange }: AccountDateRangeProps) => (
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

export default AccountDateRange;
