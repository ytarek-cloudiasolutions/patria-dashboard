import { cn } from "@/lib/utils";

export type StatTone = "neutral" | "green" | "red" | "gold";

const VALUE_TONE: Record<StatTone, string> = {
  neutral: "text-[#28293D]",
  green: "text-[#059B5A]",
  red: "text-[#C90000]",
  gold: "text-[#B56C00]",
};

interface StatCardProps {
  label: string;
  value: string;
  tone?: StatTone;
}

const StatCard = ({ label, value, tone = "neutral" }: StatCardProps) => (
  <div className="rounded-[12px] border border-[#E5E5E5] bg-white px-4 py-4 text-center">
    <p
      className={cn(
        "text-[12px] font-semibold",
        tone === "neutral" ? "text-[#8B8B8B]" : VALUE_TONE[tone],
      )}
    >
      {label}
    </p>
    <p className={cn("mt-2 text-[16px] font-bold", VALUE_TONE[tone])}>{value}</p>
  </div>
);

export default StatCard;
