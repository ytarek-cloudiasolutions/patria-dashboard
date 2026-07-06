import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { useState } from "react";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface RememberMeFieldProps {
  checked?: boolean;
  id?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const RememberMeField = ({
  checked,
  id = "logged_in",
  onCheckedChange,
}: RememberMeFieldProps) => {
  const { t } = useTranslation();
  const [internalChecked, setInternalChecked] = useState(false);
  const isChecked = checked ?? internalChecked;

  const handleCheckedChange = (nextChecked: boolean) => {
    setInternalChecked(nextChecked);
    onCheckedChange?.(nextChecked);
  };

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`rounded-[10px] p-1 ${isChecked ? "bg-[#624F1C1A]" : ""}`}
      >
        <Checkbox
          id={id}
          checked={isChecked}
          onCheckedChange={(value) => handleCheckedChange(value === true)}
          className="h-5 w-5 rounded-[5.99px] border-[#8F6900] cursor-pointer"
        />
      </div>
      <Label
        htmlFor={id}
        className="text-[16px] font-medium text-[#333333] cursor-pointer"
      >
        {t("Remember me")}
      </Label>
    </div>
  );
};

export default RememberMeField;
