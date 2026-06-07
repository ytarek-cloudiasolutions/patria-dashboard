import { TrendingDown, TrendingUp } from "lucide-react";

import OverviewCard from "@/shared/components/OverviewCard";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { DashboardMetric } from "../types";

interface DashboardMetricsProps {
  metrics: DashboardMetric[];
}

const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4 xl:gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const TrendIcon =
          metric.trend?.tone === "negative" ? TrendingDown : TrendingUp;

        return (
          <OverviewCard
            key={metric.id}
            data={{
              title: t(metric.title),
              value: metric.value,
              icon: <Icon className="size-5" />,
              iconColor: metric.iconColor,
              badgeColor: metric.badgeColor,
              trend: metric.trend
                ? {
                    value: (
                      <>
                        <TrendIcon className="mx-0.75 size-3" />
                        {metric.trend.value}
                      </>
                    ),
                    tone: metric.trend.tone,
                  }
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
