import { Activity, Database, Globe, HardDrive, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionCard from "./SectionCard";
import { SYSTEM_METRICS, SYSTEM_STATS } from "../data";
import type { SystemMetric, SystemMetricTone, SystemStat } from "../types";

const TONE_STYLES: Record<SystemMetricTone, { tile: string; icon: string }> = {
  primary: { tile: "bg-[#F5F0EA]", icon: "text-primary" },
  green: { tile: "bg-[#E2F4ED]", icon: "text-[#059B5A]" },
  amber: { tile: "bg-[#FFF7E6]", icon: "text-[#C7861E]" },
  blue: { tile: "bg-[#DBEAFE]", icon: "text-[#2563EB]" },
};

const METRIC_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  storage: HardDrive,
  socket: RefreshCw,
  database: Database,
  environment: Globe,
};

const MetricCard = ({ metric }: { metric: SystemMetric }) => {
  const tone = TONE_STYLES[metric.tone];
  const Icon = METRIC_ICONS[metric.id] ?? Activity;
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-[14px] border border-[#E5E5E5] bg-white px-4 py-5 text-center">
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-2xl",
          tone.tile,
        )}
      >
        <Icon size={20} className={tone.icon} />
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
          {metric.label}
        </p>
        <p className="text-[20px] font-bold text-[#333333]">{metric.value}</p>
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#8B8B8B]">
          {metric.sublabel}
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ stat }: { stat: SystemStat }) => (
  <div className="flex flex-col gap-2 rounded-[14px] border border-[#E5E5E5] bg-[#FAFAF7] px-4 py-4">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
      {stat.label}
    </p>
    <p
      className={cn(
        "text-[18px] font-bold",
        stat.tone === "green" ? "text-[#059B5A]" : "text-[#333333]",
      )}
    >
      {stat.value}
    </p>
    <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#8B8B8B]">
      <span
        className={cn(
          "size-2 rounded-full",
          stat.tone === "green" ? "bg-[#059B5A]" : "bg-[#8B8B8B]",
        )}
      />
      {stat.caption}
    </span>
  </div>
);

const RefreshButton = () => (
  <button
    type="button"
    aria-label="Refresh"
    className="flex size-10 cursor-pointer items-center justify-center rounded-[8px] bg-primary text-white hover:bg-primary/90"
  >
    <RefreshCw className="size-4.5" />
  </button>
);

const SystemSection = () => (
  <SectionCard
    icon={<Activity size={32} />}
    title="System Status"
    subtitle="Global Cluster Health"
    action={<RefreshButton />}
    contentClassName="flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6"
  >
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SYSTEM_METRICS.map((metric) => (
        <MetricCard key={metric.id} metric={metric} />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {SYSTEM_STATS.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  </SectionCard>
);

export default SystemSection;
