import { ShieldCheck, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { AuditLog, MutationType } from "../types";

interface Props {
  logs: AuditLog[];
}

const MUTATION_STYLES: Record<MutationType, string> = {
  Update: "bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]",
  Create: "bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0]",
  Delete: "bg-[#FFF0F0] text-[#C90000] border border-[#FECACA]",
};

const AuditLogsTab = ({ logs }: Props) => {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E5E5] overflow-hidden">
      {/* Colored banner header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#F5F0EA]">
        <div className="flex items-center gap-3">
          <div className="bg-white/60 p-2 rounded-[10px]">
            <ShieldCheck className="size-4 text-[#5C4A1E]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#28293D]">
              Audit Governance
            </p>
            <p className="text-[12px] text-[#8B8B8B] font-normal">
              Cryptographically sealed administrator activity
            </p>
          </div>
        </div>
        <button className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-[#5C4A1E] hover:bg-[#3d3012] transition-colors cursor-pointer">
          <RefreshCw className="size-4 text-white" />
        </button>
      </div>

      {/* Table */}
      <Table>
        <TableHeader className="bg-white">
          <TableRow>
            <TableHead className="pl-6">EVENT TIMESTAMP</TableHead>
            <TableHead>ADMIN ENTITY</TableHead>
            <TableHead>MUTATION TYPE</TableHead>
            <TableHead>TARGET RESOURCE</TableHead>
            <TableHead>ORIGIN IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="border-b border-[#F5F5F5]">
              <TableCell className="pl-6 py-3 text-[12px] text-[#28293D]">
                {log.eventTimestamp}
              </TableCell>
              <TableCell className="text-[12px] font-medium text-[#28293D]">
                {log.adminEntity}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${MUTATION_STYLES[log.mutationType]}`}
                >
                  {log.mutationType}
                </span>
              </TableCell>
              <TableCell className="text-[11px] text-[#8B8B8B] font-mono max-w-[180px] truncate">
                {log.targetResource}
              </TableCell>
              <TableCell className="text-[11px] text-[#8B8B8B] font-mono">
                {log.originIP}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditLogsTab;
