import { Card, CardContent } from "@/shared/components/ui/card";
import {
  ArrowUp,
  Box,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { InventoryMetric, InventoryOverviewCardsProps } from "../types";

const iconMap: Record<InventoryMetric["icon"], LucideIcon> = {
  package: Box,
  alert: Info,
  triangle: TriangleAlert,
  "arrow-up": ArrowUp,
};

const InventoryOverviewCards = ({ metrics }: InventoryOverviewCardsProps) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = iconMap[metric.icon];

        return (
          <Card
            key={metric.id}
            className="rounded-[16px] border border-[#E5E5E5] py-0"
            style={{
              backgroundColor: metric.cardColor,
              boxShadow:
                "0px 1px 2px -1px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent className="flex h-25 items-center gap-4.5 px-3">
              <div style={{ color: metric.iconColor }}>
                <Icon className="size-8" />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[12px]  font-semibold text-[#28293D]">
                  {metric.title}
                </p>
                <p
                  className="text-[32px] leading-none font-semibold"
                  style={{ color: metric.valueColor }}
                >
                  {metric.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default InventoryOverviewCards;
