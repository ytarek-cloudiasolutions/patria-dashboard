import { RefreshCw, ShieldCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import SectionCard from "./SectionCard";
import { AUDIT_LOGS } from "../data";
import type { AuditLog, MutationType } from "../types";

const MUTATION_STYLES: Record<MutationType, string> = {
  Update: "border-[#C7861E] bg-[#FFF5DC] text-[#C7861E]",
  Create: "border-[#059B5A] bg-[#E2F4ED] text-[#059B5A]",
  Delete: "border-[#C90000] bg-[#FFF0F0] text-[#C90000]",
};

const Timestamp = ({ value }: { value: string }) => {
  const [date, time] = value.split(", ");
  return (
    <div className="leading-tight">
      <p>
        {date}
        {time ? "," : ""}
      </p>
      {time && <p>{time}</p>}
    </div>
  );
};

const MutationBadge = ({ mutation }: { mutation: MutationType }) => (
  <Badge
    className={cn(
      "h-6 min-w-20 rounded-full border px-3 py-0 text-[11px] font-semibold",
      MUTATION_STYLES[mutation],
    )}
  >
    {mutation}
  </Badge>
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

const AuditCardRow = ({ log }: { log: AuditLog }) => (
  <div className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4">
    <div className="mb-2 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-[#333333]">{log.admin}</p>
        <p className="text-[12px] text-[#8B8B8B]">{log.timestamp}</p>
      </div>
      <MutationBadge mutation={log.mutation} />
    </div>
    <p className="truncate font-mono text-[12px] text-[#28293D]">
      {log.resource}
    </p>
    <p className="mt-1 font-mono text-[11px] text-[#8B8B8B]">{log.originIp}</p>
  </div>
);

const AuditLogsSection = () => (
  <SectionCard
    icon={<ShieldCheck size={32} />}
    title="Audit Governance"
    subtitle="Cryptographically sealed administrator activity"
    contentClassName="px-0 py-0 sm:px-0 sm:py-0"
    action={<RefreshButton />}
  >
    {/* Mobile cards */}
    <div className="flex flex-col gap-3 p-4 md:hidden">
      {AUDIT_LOGS.map((log) => (
        <AuditCardRow key={log.id} log={log} />
      ))}
    </div>

    {/* Desktop table */}
    <div className="hidden md:block **:data-[slot=table-container]:rounded-none **:data-[slot=table-container]:border-0">
      <Table className="border-0">
        <TableHeader className="bg-white [&_tr:hover]:bg-white">
          <TableRow className="relative after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-[#E5E5E5]">
            <TableHead className="px-6 py-4">EVENT TIMESTAMP</TableHead>
            <TableHead className="px-6 py-4">ADMIN ENTITY</TableHead>
            <TableHead className="px-6 py-4">MUTATION TYPE</TableHead>
            <TableHead className="px-6 py-4">TARGET RESOURCE</TableHead>
            <TableHead className="px-6 py-4">ORIGIN IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {AUDIT_LOGS.map((log) => (
            <TableRow key={log.id} className="hover:bg-[#FAFAF8]">
              <TableCell className="px-6 py-4 text-[13px] font-medium text-[#000000] text-center">
                <Timestamp value={log.timestamp} />
              </TableCell>
              <TableCell className="px-6 py-4 text-[14px] font-semibold text-[#333333]">
                {log.admin}
              </TableCell>
              <TableCell className="px-6 py-4">
                <MutationBadge mutation={log.mutation} />
              </TableCell>
              <TableCell className="px-6 py-4 font-mono text-[12px] text-[#28293D]">
                {log.resource}
              </TableCell>
              <TableCell className="px-6 py-4 font-mono text-[12px] text-[#8B8B8B]">
                {log.originIp}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </SectionCard>
);

export default AuditLogsSection;
