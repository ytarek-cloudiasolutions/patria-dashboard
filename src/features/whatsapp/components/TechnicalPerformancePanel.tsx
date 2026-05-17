import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TechnicalPerformance } from "../types";

interface TechnicalPerformancePanelProps {
  data: TechnicalPerformance;
}

const queueStatusColor: Record<string, string> = {
  "Empty (Nominal)": "text-[#00A85A]",
  Processing: "text-[#B56C00]",
  Backlogged: "text-[#C90000]",
};

const encryptionColor: Record<string, string> = {
  "End-to-End": "text-[#9A00FF]",
  Transport: "text-[#B56C00]",
  None: "text-[#C90000]",
};

const TechnicalPerformancePanel = ({
  data,
}: TechnicalPerformancePanelProps) => {
  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E1E1E5] bg-white">
      <div className="flex h-[55px] items-center justify-between bg-[#F5F0EA] px-[20px]">
        <h2 className="text-[20px] font-bold text-[#333333]">
          Technical Performance
        </h2>
        <Info className="size-7 text-[#000000]" strokeWidth={1.9} />
      </div>

      <div className="grid gap-7 px-[38px] py-[37px] md:grid-cols-3">
        <div>
          <p className="text-[16px] font-medium text-[#333333]">
            Response Time
          </p>
          <p className="mt-[8px] text-[21px] font-medium leading-none text-[#000000]">
            {data.responseTime}
          </p>
        </div>
        <div>
          <p className="text-[16px] font-medium text-[#333333]">
            Queue Status
          </p>
          <p
            className={cn(
              "mt-[8px] text-[21px] font-bold leading-none",
              queueStatusColor[data.queueStatus] ?? "text-[#000000]"
            )}
          >
            {data.queueStatus}
          </p>
        </div>
        <div>
          <p className="text-[16px] font-medium text-[#333333]">
            {data.operator}
          </p>
          <p
            className={cn(
              "mt-[8px] text-[21px] font-bold leading-none",
              encryptionColor[data.encryptionMode] ?? "text-[#000000]"
            )}
          >
            {data.encryptionMode}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechnicalPerformancePanel;
