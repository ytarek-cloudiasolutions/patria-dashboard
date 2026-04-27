import {
  Activity,
  RefreshCw,
  Database,
  Globe,
  Server,
  Wifi,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { SystemStatus } from "../types";

interface Props {
  status: SystemStatus;
}

const StatCard = ({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) => (
  <div className={`flex flex-col items-center justify-center gap-2 rounded-[12px] border border-[#E5E5E5] p-4 text-center ${highlight ? "bg-[#F5F0EA]" : "bg-[#FAFAFA]"}`}>
    <div className="text-[#5C4A1E] opacity-70">{icon}</div>
    <p className="text-[18px] font-bold text-[#28293D]">{value}</p>
    <div>
      <p className="text-[11px] font-semibold text-[#5C4A1E] uppercase tracking-wider">{label}</p>
      {sub && <p className="text-[10px] text-[#8B8B8B] mt-0.5">{sub}</p>}
    </div>
  </div>
);

const SystemTab = ({ status }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <th colSpan={2} className="h-auto px-5 py-4 text-left bg-[#F5F0EA]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/60 p-2 rounded-[10px]">
                  <Activity className="size-4 text-[#5C4A1E]" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#28293D]">System Status</p>
                  <p className="text-[12px] text-[#8B8B8B] font-normal">Global Cluster Health</p>
                </div>
              </div>
              <button className="flex items-center justify-center w-9 h-9 rounded-[8px] bg-[#5C4A1E] hover:bg-[#3d3012] transition-colors cursor-pointer">
                <RefreshCw className="size-4 text-white" />
              </button>
            </div>
          </th>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Top 4 stat cards */}
        <TableRow className="hover:bg-transparent border-0">
          <TableCell colSpan={2} className="px-5 pt-6 pb-3">
            <div className="grid grid-cols-4 gap-3">
              <StatCard icon={<Database className="size-5" />} label="Storage Core" value={status.storageCore} sub="NODE ENGINE" />
              <StatCard icon={<Wifi className="size-5" />} label="Socket Sync" value={String(status.socketSync)} sub="REAL-TIME HOOKS" />
              <StatCard icon={<Server className="size-5" />} label="Database Layer" value={status.databaseLayer} sub="MONGO-DBI CLUSTER" />
              <StatCard icon={<Globe className="size-5" />} label="Environment" value={status.environment} sub="RUNTIME MODE" />
            </div>
          </TableCell>
        </TableRow>

        {/* Bottom 3 stat cards */}
        <TableRow className="hover:bg-transparent border-0">
          <TableCell colSpan={2} className="px-5 py-3 pb-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1 bg-[#F5F0EA] rounded-[12px] border border-[#E5E5E5] p-4">
                <p className="text-[11px] font-semibold text-[#5C4A1E] uppercase tracking-wider">System Uptime</p>
                <p className="text-[22px] font-bold text-[#28293D]">{status.systemUptime}</p>
                <p className="text-[11px] text-[#059B5A] font-medium">● Operational</p>
              </div>
              <div className="flex flex-col gap-1 bg-[#FAFAFA] rounded-[12px] border border-[#E5E5E5] p-4">
                <p className="text-[11px] font-semibold text-[#5C4A1E] uppercase tracking-wider">Backups Integrity</p>
                <p className="text-[22px] font-bold text-[#28293D]">{status.backupsIntegrity}</p>
                <p className="text-[11px] text-[#8B8B8B]">• Sync every 24h at 03:00</p>
              </div>
              <div className="flex flex-col gap-1 bg-[#FAFAFA] rounded-[12px] border border-[#E5E5E5] p-4">
                <p className="text-[11px] font-semibold text-[#5C4A1E] uppercase tracking-wider">Latency Index</p>
                <p className="text-[22px] font-bold text-[#28293D]">{status.latencyIndex}</p>
                <p className="text-[11px] text-[#8B8B8B]">• Average &lt; 50ms</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default SystemTab;