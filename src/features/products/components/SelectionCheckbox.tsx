import { Checkbox } from "@/shared/components/ui/checkbox";

interface SelectionCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  ariaLabel: string;
}

const SelectionCheckbox = ({ checked, onCheckedChange, ariaLabel }: SelectionCheckboxProps) => (
  <span className={`inline-flex rounded-[10px] p-1 ${checked ? "bg-[#624F1C1A]" : ""}`}>
    <Checkbox checked={checked} onCheckedChange={(value) => onCheckedChange(value === true)} aria-label={ariaLabel} className="size-5 cursor-pointer rounded-[5.994px] border-[#8F6900] bg-white shadow-[0_1.998px_3.996px_0_rgba(27,28,29,0.04)]" />
  </span>
);

export default SelectionCheckbox;
