import type { InputFieldProps } from "../types/inputField.types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

const InputField = ({ data }: { data: InputFieldProps }) => {
  return (
    <div className={cn("flex flex-col", data.wrapperClassName)}>
      <Label
        htmlFor={data.label.htmlFor}
        className="text-[#000000] text-[16px] font-medium mb-2.5 block"
      >
        {data.label.labelText}
        {data.required && <span className="text-[#C90000] ml-1">*</span>}
      </Label>
      <Input
        id={data.id}
        type={data.type ?? "text"}
        placeholder={data.placeholder}
        required={data.required}
        {...data.inputProps}
        className={cn(
          "h-12.5 p-3 rounded-[12px] bg-white border-[#E5E5E5] focus-visible:border-primary focus-visible:ring-0 text-[#23252A] text-[16px] placeholder:text-[#8B8B8B]",
          data.className
        )}
      />
    </div>
  );
};

export default InputField;
