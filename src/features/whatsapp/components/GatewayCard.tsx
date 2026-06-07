import type { ReactNode } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";

interface GatewayCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

const GatewayCard = ({
  title,
  icon,
  children,
  className,
  contentClassName,
}: GatewayCardProps) => (
  <Card
    className={cn(
      "gap-0 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm",
      className,
    )}
  >
    <div className="flex items-center justify-between bg-[#F5F0EA] px-5 py-4 sm:px-6">
      <h3 className="text-[15px] font-bold text-[#333333] sm:text-[16px]">
        {title}
      </h3>
      <span className="text-[#28293D]">{icon}</span>
    </div>
    <CardContent
      className={cn("flex-1 px-5 py-5 sm:px-6 sm:py-6", contentClassName)}
    >
      {children}
    </CardContent>
  </Card>
);

export default GatewayCard;
