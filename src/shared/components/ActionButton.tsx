import { cn } from "@/lib/utils";
import type { ActionButtonProps } from "../types/actionButton.types";

const ActionButton = ({ data }: { data: ActionButtonProps }) => {
  return (
    <button
      onClick={data.onClick}
      className={cn(
        "flex justify-center items-center cursor-pointer rounded-lg",
        data.iconColor,
        data.className,
      )}
      aria-label={data.ariaLabel ?? "Action"}
    >
      {data.icon}
    </button>
  );
};

export default ActionButton;
