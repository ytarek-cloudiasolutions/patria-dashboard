import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { useState } from "react";

const RememberMeField = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex gap-1.5 items-center">
      <div className={`p-1 rounded-[10px] ${isChecked ? "bg-[#624F1C1A]" : ""}`}>
        <Checkbox
          id="logged_in"
          checked={isChecked}
          onCheckedChange={(checked) => setIsChecked(checked === true)}
          className="w-[19.98px] h-[19.98px] rounded-[5.99px] border-primary"
        />
      </div>
      <Label htmlFor="logged_in" className="text-333333-16-medium">
        Remember me
      </Label>
    </div>
  );
};

export default RememberMeField;
