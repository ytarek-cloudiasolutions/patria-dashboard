import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";

const RememberMeField = () => {
  return (
    <div className="flex gap-1.5 items-center">
      <Checkbox id="logged_in" className="border-primary" />
      <Label htmlFor="logged_in" className="font-medium text-[16px]">
        Remember me
      </Label>
    </div>
  );
};

export default RememberMeField;
