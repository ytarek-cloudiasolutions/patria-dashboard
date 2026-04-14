import { useState, useEffect } from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Switch = ({
  checked,
  onCheckedChange,
  disabled = false,
}: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  // Update internal state when checked prop changes
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = () => {
    if (!disabled) {
      const newValue = !isChecked;
      setIsChecked(newValue);
      onCheckedChange(newValue);
    }
  };

  return (
    <div
      className={`w-15 h-5.5 flex justify-center items-center rounded-[6.75px] ${
        isChecked ? "bg-[#624F1C1A]" : "bg-[#DCDCDC]"
      }`}
    >
      <button
        onClick={handleChange}
        disabled={disabled}
        className={`relative inline-flex h-[18.22px] w-14 items-center rounded-[6.75px] transition-colors py-1.75 ${
          isChecked ? "bg-primary" : "bg-[#CACBD4]"
        } ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } p-1.5`}
        aria-label="Toggle switch"
      >
        <span
          className={`inline-block h-[12.14px] w-[12.14px] transform rounded-full bg-white shadow-sm transition-transform ${
            isChecked ? "translate-x-9" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default Switch;
