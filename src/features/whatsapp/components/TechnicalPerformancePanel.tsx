import { Info } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/components/ui/table";

import { cn } from "@/lib/utils";
import type { TechnicalPerformance } from "../types";

interface TechnicalPerformancePanelProps {
  data: TechnicalPerformance;
}

const queueStatusColor: Record<string, string> = {
  "Empty (Nominal)": "text-[#059B5A]",
  Processing: "text-[#B56C00]",
  Backlogged: "text-[#C90000]",
};

const encryptionColor: Record<string, string> = {
  "End-to-End": "text-[#7A6518]",
  Transport: "text-[#B56C00]",
  None: "text-[#C90000]",
};

const TechnicalPerformancePanel = ({
  data,
}: TechnicalPerformancePanelProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-5 py-4" colSpan={3}>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-[#28293D]">
                Technical Performance
              </span>
              <Info size={18} className="text-[#6B6B6B]" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell className="px-5 py-5">
            <p className="mb-1 text-[12px] text-[#6B6B6B]">Response Time</p>
            <p className="text-[18px] font-bold text-[#28293D]">
              {data.responseTime}
            </p>
          </TableCell>

          <TableCell className="px-5 py-5">
            <p className="mb-1 text-[12px] text-[#6B6B6B]">Queue Status</p>
            <p
              className={cn(
                "text-[15px] font-semibold",
                queueStatusColor[data.queueStatus] ?? "text-[#28293D]"
              )}
            >
              {data.queueStatus}
            </p>
          </TableCell>

          <TableCell className="px-5 py-5">
            <p className="mb-1 text-[12px] text-[#6B6B6B]">{data.operator}</p>
            <p
              className={cn(
                "text-[15px] font-semibold",
                encryptionColor[data.encryptionMode] ?? "text-[#28293D]"
              )}
            >
              {data.encryptionMode}
            </p>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TechnicalPerformancePanel;
