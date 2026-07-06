import type { InputFieldProps } from "../types/InputField.types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

interface InputFieldComponentProps {
  id?: string;
  label?: string | { htmlFor: string; labelText: string };
  type?: string;
  placeholder?: string;
  required?: boolean;
  wrapperClassName?: string;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  data?: InputFieldProps;
}

const InputField = ({
  id: propsId,
  label: propsLabel,
  type: propsType = "text",
  placeholder: propsPlaceholder,
  required: propsRequired,
  wrapperClassName: propsWrapperClassName,
  className: propsClassName,
  inputProps: propsInputProps,
  data,
}: InputFieldComponentProps) => {
  // Use data prop if provided, otherwise use individual props
  const id = data?.id ?? propsId ?? "";
  const label = data?.label ?? propsLabel;
  const type = data?.type ?? propsType;
  const placeholder = data?.placeholder ?? propsPlaceholder;
  const required = data?.required ?? propsRequired;
  const wrapperClassName = data?.wrapperClassName ?? propsWrapperClassName;
  const className = data?.className ?? propsClassName;
  const inputProps = data?.inputProps ?? propsInputProps;

  // Extract label text if it's an object
  const labelText = typeof label === "string" ? label : label?.labelText;
  const labelHtmlFor = typeof label === "string" ? id : label?.htmlFor ?? id;

  return (
    <div className={cn("flex flex-col", wrapperClassName)}>
      <Label
        htmlFor={labelHtmlFor}
        className="mb-2.5 text-[16px] font-medium text-black"
      >
        {labelText}
        {required && <span className="text-[#C90000]">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        {...inputProps}
        className={cn(
          "h-12.5 px-4.5 py-3 rounded-xl border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus-visible:border-primary focus-visible:ring-0",
          className
        )}
      />
    </div>
  );
};

export default InputField;
