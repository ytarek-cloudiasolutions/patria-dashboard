import type { ReactNode } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

const SectionCard = ({
  icon,
  title,
  subtitle,
  action,
  children,
  className,
  contentClassName,
}: SectionCardProps) => (
  <Card
    className={cn(
      "h-full gap-0 overflow-hidden rounded-[16px] border border-[#CACBD4] bg-white py-0 ring-0 shadow-lg",
      className,
    )}
  >
    <div className="flex items-center justify-between gap-3 bg-[#F5F0EA] px-5 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center text-[#28293D]">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-[16px] font-bold text-[#333333] sm:text-[17px]">
            {title}
          </h3>
          {subtitle && (
            <p className="truncate text-[12px] text-[#595959] sm:text-[13px]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
    <CardContent
      className={cn("flex-1 px-5 py-5 sm:px-6 sm:py-6", contentClassName)}
    >
      {children}
    </CardContent>
  </Card>
);

export default SectionCard;
