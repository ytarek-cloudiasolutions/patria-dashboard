import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative inline-flex h-[18.22px] w-14 items-center rounded-[6.75px] p-0.5 transition-all ring-2 ring-[#059B5A33]",
        "data-[state=checked]:bg-[#059B5A] data-[state=unchecked]:bg-[#CACBD4] data-[state=unchecked]:ring-[#8B8B8B1A]",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "h-[12.14px] w-[12.14px] rounded-full bg-white shadow transition-transform",
          "translate-x-0 data-[state=checked]:translate-x-9.5"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
