import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import type { InputFieldProps } from "../types";

const PasswordInputField = ({ id, label, placeholder }: InputFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="mb-6">
      <Label htmlFor={label.htmlFor} className="label-base mb-2.5">
        {label.labelText}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          className="input-field input-base"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible((prevState) => !prevState)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0 text-[#20222F] hover:bg-transparent focus-visible:ring-ring/50"
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    </div>
  );
};

export default PasswordInputField;
