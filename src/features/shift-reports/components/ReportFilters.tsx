import DatePicker from "@/shared/components/DatePicker";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Label } from "@/shared/components/ui/label";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface ReportFiltersProps {
  date: string;
  onDateChange: (date: string) => void;
  selectLabel: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (value: string) => void;
  onMenuOpenChange: (open: boolean) => void;
}

/** The shared "Date + (Shift | Period)" filter row used by every tab. */
const ReportFilters = ({
  date,
  onDateChange,
  selectLabel,
  options,
  selected,
  onSelect,
  onMenuOpenChange,
}: ReportFiltersProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col">
        <Label className="mb-2 text-[16px] font-medium text-black">
          {t("Date")}
        </Label>
        <DatePicker
          value={date}
          onChange={onDateChange}
          placeholder="15/6/2026"
          popoverPlacement="bottom-right"
          withBackdrop
        />
      </div>
      <div className="flex flex-col">
        <Label className="mb-2 text-[16px] font-medium text-black">
          {t(selectLabel)}
        </Label>
        <DropdownSelect
          options={options.map((o) => ({ ...o, label: t(o.label) }))}
          selected={selected}
          onSelect={onSelect}
          onOpenChange={onMenuOpenChange}
          align="start"
          className="md:w-full"
          contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
        />
      </div>
    </div>
  );
};

export default ReportFilters;
