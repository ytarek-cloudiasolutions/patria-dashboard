import { cn } from "@/lib/utils";

export type StatTone = "neutral" | "green" | "primary" | "warning";

const COLOR_STYLES: Record<StatTone, string> = {
  neutral: "text-black",
  green: "text-[#059B5A]",
  primary: "text-[#8F6900]",
  warning: "text-[#C7861E]",
};

interface StatCardProps {
  label: string;
  value: string;
  tone?: StatTone;
}

const StatCard = ({ label, value, tone = "neutral" }: StatCardProps) => (
  <div className="flex h-[115px] flex-col items-center justify-center gap-2 rounded-[16px] border border-[#E5E5E5] bg-white p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.10)]">
    <span className={cn("text-[10px] font-semibold tracking-[0.20px]", COLOR_STYLES[tone])}>
      {label}
    </span>
    <span className={cn("text-[14px] font-semibold tracking-[0.28px]", COLOR_STYLES[tone])}>
      {value}
    </span>
  </div>
);

export default StatCard;
