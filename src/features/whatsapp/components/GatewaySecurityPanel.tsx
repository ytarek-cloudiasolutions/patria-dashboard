import { ShieldCheck } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/components/ui/table";
import type { GatewaySecurity } from "../types";

interface GatewaySecurityPanelProps {
  data: GatewaySecurity;
}

const GatewaySecurityPanel = ({ data }: GatewaySecurityPanelProps) => {
  return (
    <div className="w-full min-w-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-5 py-4 w-full whitespace-normal">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-[#28293D]">
                  Gateway Security
                </span>
                <ShieldCheck size={18} className="text-[#6B6B6B]" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Session Isolation card */}
          <TableRow className="hover:bg-transparent border-b border-[#F3F3F3]">
            <TableCell className="px-5 py-4 whitespace-normal w-full">
              <div className="rounded-[10px] bg-[#EDEAE4] p-4">
                <p className="mb-1.5 text-[13px] font-semibold text-[#28293D] break-words">
                  {data.title}
                </p>
                <p className="text-[12px] leading-relaxed text-[#6B6B6B] break-words">
                  {data.description}
                </p>
              </div>
            </TableCell>
          </TableRow>

          {/* Compliance note */}
          <TableRow className="hover:bg-transparent">
            <TableCell className="px-5 py-4 whitespace-normal w-full">
              <p className="text-center text-[11px] text-[#6B6B6B] break-words">
                {data.complianceNote}
              </p>
              <p className="text-center text-[11px] font-semibold text-[#28293D]">
                Last audit: {data.lastAudit}
              </p>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default GatewaySecurityPanel;
