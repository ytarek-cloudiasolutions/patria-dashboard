import type { FormHeaderProps } from "../types";

const FormHeader = ({ title, subtitle }: FormHeaderProps) => {
  return (
    <div className="flex flex-col mb-22.5">
      <span className="font-bold text-[32px]">{title}</span>
      <span className="font-normal text-[16px]">{subtitle}</span>
    </div>
  );
};

export default FormHeader;
