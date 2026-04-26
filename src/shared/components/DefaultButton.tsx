import type { ButtonProps } from "../types/button.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const DefaultButton = ({ data }: { data: ButtonProps }) => {
  return (
    <Button
      type={data.type ?? "button"}
      variant={data.variant}
      size={data.size}
      onClick={data.onClick}
      className={cn(
        "flex gap-3 h-14 px-7.5 rounded-[5px] text-[#FFFFFF] text-[16px] font-semibold cursor-pointer",
        data.className
      )}
    >
      {data.icon}
      {data.buttonText}
    </Button>
  );
};

export default DefaultButton;
