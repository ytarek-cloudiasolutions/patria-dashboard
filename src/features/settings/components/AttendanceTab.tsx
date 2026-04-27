import { Clock, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { AttendanceLog } from "../types";

interface Props {
  logs: AttendanceLog[];
}

const AttendanceTab = ({ logs }: Props) => {
  return (
    <div className="bg-white rounded-[16px] border border-[#E5E5E5] overflow-hidden">
      {/* Colored header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#F5F0EA]">
        <div className="flex items-center gap-3">
          <div className="bg-white/60 p-2 rounded-[10px]">
            <Clock className="size-4 text-[#5C4A1E]" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#28293D]">
              Attendance Logs
            </p>
            <p className="text-[12px] text-[#8B8B8B] font-normal">
              Manage your account and platform preferences
            </p>
          </div>
        </div>
        <button className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-[#5C4A1E] hover:bg-[#3d3012] transition-colors cursor-pointer">
          <RefreshCw className="size-4 text-white" />
        </button>
      </div>

      {/* Table with its own clean header */}
      <Table>
        <TableHeader className="bg-white">
          <TableRow>
            <TableHead className="pl-6">STAFF MEMBER</TableHead>
            <TableHead>IN-DATE/TIME</TableHead>
            <TableHead>OUT-DATE/TIME</TableHead>
            <TableHead>LOGGED HOURS</TableHead>
            <TableHead>STATUS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="border-b border-[#F5F5F5]">
              <TableCell className="pl-6 py-3 text-[13px] font-medium text-[#28293D]">
                {log.staffMember}
              </TableCell>
              <TableCell className="text-[12px] text-[#28293D]">
                {log.inDateTime}
              </TableCell>
              <TableCell className="text-[12px] text-[#8B8B8B]">
                {log.outDateTime}
              </TableCell>
              <TableCell className="text-[12px] text-[#8B8B8B]">
                {log.loggedHours}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border ${
                    log.status === "Ongoing"
                      ? "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]"
                      : "bg-white text-[#5C4A1E] border-[#5C4A1E]"
                  }`}
                >
                  {log.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTab;
