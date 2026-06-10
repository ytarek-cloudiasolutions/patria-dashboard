import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import GatewayCard from "./GatewayCard";
import type { PerformanceMetric, PerformanceTone } from "../types";

interface TechnicalPerformanceCardProps {
  metrics: PerformanceMetric[];
}

const TONE_STYLES: Record<PerformanceTone, string> = {
  neutral: "text-[#000000]",
  positive: "text-[#059B5A]",
  highlight: "text-[#9524E4]",
};

const TechnicalPerformanceCard = ({
  metrics,
}: TechnicalPerformanceCardProps) => {
  const { t } = useTranslation();
  return (
    <GatewayCard
      title={t("Technical Performance")}
      icon={<Info size={20} className="text-[#28293D]" />}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex flex-col gap-1.5">
            <p className="text-[14px] font-semibold text-[#333333]">
              {t(metric.label)}
            </p>
            <p
  
              className={cn(
                "text-[15px] font-semibold",
                TONE_STYLES[metric.tone],
              )}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </GatewayCard>
  );
};

export default TechnicalPerformanceCard;
