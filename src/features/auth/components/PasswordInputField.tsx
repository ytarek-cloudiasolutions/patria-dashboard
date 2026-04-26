import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import type { InputFieldProps } from "@/shared/types/inputField.types";


const PasswordInputField = ({
  id,
  label,
  placeholder,
  className,
}: InputFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className={className}>
      <Label htmlFor={label.htmlFor} className="mb-2.5 text-000000-16-medium">
        {label.labelText}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          className="h-12.5 px-4.5 py-3 rounded-[12px] bg-white border-[#E5E5E5] focus-visible:border-primary focus-visible:ring-0 text-23252A-16-normal placeholder:text-8B8B8B-14-normal"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible((prevState) => !prevState)}
          className="absolute inset-y-0 right-2 z-10 my-auto p-0 hover:bg-transparent focus-visible:ring-ring/50"
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    </div>
  );
};

export default PasswordInputField;
