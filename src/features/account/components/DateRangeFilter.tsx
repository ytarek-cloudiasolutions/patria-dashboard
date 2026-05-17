import DatePicker from "@/shared/components/DatePicker";

interface DateRangeFilterProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
}

const DateRangeFilter = ({
  from,
  to,
  onFromChange,
  onToChange,
}: DateRangeFilterProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <DatePicker
        value={from}
        onChange={onFromChange}
        placeholder="From"
        withBackdrop
        popoverPlacement="bottom-right"
        className="min-w-0"
      />
      <DatePicker
        value={to}
        onChange={onToChange}
        placeholder="To"
        withBackdrop
        popoverPlacement="bottom-right"
        className="min-w-0"
      />
    </div>
  );
};

export default DateRangeFilter;
