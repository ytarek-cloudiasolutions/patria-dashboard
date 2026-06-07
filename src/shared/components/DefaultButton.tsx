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
      form={data.form}
      className={cn(
        // base responsive layout
        "flex items-center justify-center gap-2 sm:gap-3",
        "h-12 sm:h-14",
        !data.className?.includes("p-") &&
          !data.className?.includes("px-") &&
          "px-4 sm:px-7.5",
        "rounded-[5px]",
        "font-semibold",
        "text-sm sm:text-[16px]",
        "cursor-pointer",

        // allow overrides
        data.className,
      )}
    >
      {data.icon && (
        <span className="flex items-center justify-center">{data.icon}</span>
      )}

      <span className="whitespace-nowrap">{data.buttonText}</span>
    </Button>
  );
};

export default DefaultButton;
