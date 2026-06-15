import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import type { InputFieldProps } from "@/shared/types/InputField.types";

const PasswordInputField = ({ id, label, placeholder }: InputFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={id} className="text-[16px] font-medium text-black">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          className="h-12.5 rounded-xl border border-[#E5E5E5] bg-white px-4.5 py-3 pe-12 text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:ring-0 focus-visible:border-primary"
        />
        <div
          onClick={() => setIsVisible((prev) => !prev)}
          className="absolute end-4.5 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center"
        >
          {isVisible ? (
            <EyeOffIcon className="h-6 w-6" />
          ) : (
            <EyeIcon className="h-6 w-6" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordInputField;
