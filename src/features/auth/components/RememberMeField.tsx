import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { useState } from "react";

const RememberMeField = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`rounded-[10px] p-1 ${isChecked ? "bg-[#624F1C1A]" : ""}`}
      >
        <Checkbox
          id="logged_in"
          checked={isChecked}
          onCheckedChange={(checked) => setIsChecked(checked === true)}
          className="h-5 w-5 rounded-[5.99px] border-[#8F6900] cursor-pointer"
        />
      </div>
      <Label
        htmlFor="logged_in"
        className="text-[16px] font-medium text-[#333333] cursor-pointer"
      >
        Remember me
      </Label>
    </div>
  );
};

export default RememberMeField;
