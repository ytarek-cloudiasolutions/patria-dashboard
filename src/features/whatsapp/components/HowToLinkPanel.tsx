import { Smartphone } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/components/ui/table";
import type { HowToLinkStep } from "../types";

interface HowToLinkPanelProps {
  steps: HowToLinkStep[];
}

const HowToLinkPanel = ({ steps }: HowToLinkPanelProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-5 py-4" colSpan={2}>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold text-[#28293D]">
                How to link?
              </span>
              <Smartphone size={18} className="text-[#6B6B6B]" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {steps.map(({ step, description }) => (
          <TableRow
            key={step}
            className="hover:bg-transparent border-b border-[#F3F3F3] last:border-0"
          >
            <TableCell className="w-10 pl-5 pr-2 py-3 align-top">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5C4A0E] text-[11px] font-bold text-white">
                {step}
              </span>
            </TableCell>
            <TableCell className="pr-5 py-3 text-[13px] leading-snug text-[#28293D] whitespace-normal">
              {description}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HowToLinkPanel;
