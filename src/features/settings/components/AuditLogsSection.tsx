import { useCallback, useEffect, useState } from "react";
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
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import SectionCard from "./SectionCard";

type MutationType = "Create" | "Update" | "Delete";

interface ApiAuditLog {
  _id: string;
  action: string;
  actorName: string;
  targetType: string;
  targetLabel: string;
  details: string;
  createdAt: string;
}

const MUTATION_STYLES: Record<MutationType, string> = {
  Update: "border-[#C7861E] bg-[#FFF5DC] text-[#C7861E]",
  Create: "border-[#059B5A] bg-[#E2F4ED] text-[#059B5A]",
  Delete: "border-[#C90000] bg-[#C90000] text-white",
};

const mutationTypeFor = (action: string): MutationType => {
  if (action.includes("created") || action.includes("unblocked")) return "Create";
  if (action.includes("deleted") || action.includes("blocked")) return "Delete";
  return "Update";
};

const Timestamp = ({ value }: { value: string }) => {
  const d = new Date(value);
  return (
    <div className="leading-tight">
      <p>{d.toLocaleDateString()}</p>
      <p>{d.toLocaleTimeString()}</p>
    </div>
  );
};

const MutationBadge = ({ mutation }: { mutation: MutationType }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-6 min-w-20 rounded-[30px] border px-3 py-0 text-[11px] font-semibold justify-center",
        MUTATION_STYLES[mutation],
      )}
    >
      {t(mutation)}
    </Badge>
  );
};

const AuditCardRow = ({ log }: { log: ApiAuditLog }) => {
  const mutation = mutationTypeFor(log.action);
  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#333333]">{log.actorName}</p>
          <p className="text-[12px] text-[#8B8B8B]">{new Date(log.createdAt).toLocaleString()}</p>
        </div>
        <MutationBadge mutation={mutation} />
      </div>
      <p className="truncate font-mono text-[12px] text-[#28293D]">
        {log.targetType}: {log.targetLabel}
      </p>
      {log.details && <p className="mt-1 font-mono text-[11px] text-[#8B8B8B]">{log.details}</p>}
    </div>
  );
};

const AuditLogsSection = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<ApiAuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/system/audit-logs", { params: { limit: 50 } })
      .then(({ data }) => setLogs(data?.data ?? []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const RefreshButton = () => (
    <button
      type="button"
      aria-label="Refresh"
      onClick={load}
      className="flex size-10 cursor-pointer items-center justify-center rounded-[8px] bg-primary text-white hover:bg-primary/90"
    >
      <RefreshCw className={cn("size-4.5", loading && "animate-spin")} />
    </button>
  );

  return (
    <SectionCard
      icon={<ShieldCheck size={32} />}
      title={t("Audit Log")}
      subtitle={t("Sensitive administrative actions — user, role, discount, customer, and inventory changes")}
      contentClassName="px-0 py-0 sm:px-0 sm:py-0"
      action={<RefreshButton />}
    >
      {!loading && logs.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-[#8B8B8B]">
          {t("No sensitive actions recorded yet")}
        </p>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="flex flex-col gap-3 p-4 md:hidden">
            {logs.map((log) => (
              <AuditCardRow key={log._id} log={log} />
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block **:data-[slot=table-container]:rounded-none **:data-[slot=table-container]:border-0">
            <Table className="border-0">
              <TableHeader className="bg-white [&_tr:hover]:bg-white">
                <TableRow className="relative after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-[#E5E5E5]">
                  <TableHead className="ps-6 py-4 text-start">{t("EVENT TIMESTAMP")}</TableHead>
                  <TableHead className="px-6 py-4">{t("ADMIN")}</TableHead>
                  <TableHead className="px-6 py-4">{t("TYPE")}</TableHead>
                  <TableHead className="px-6 py-4">{t("TARGET")}</TableHead>
                  <TableHead className="pe-6 py-4 text-end">{t("DETAILS")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id} className="hover:bg-[#FAFAF8]">
                    <TableCell className="ps-6 py-4 text-[13px] font-medium text-[#000000]" dir="ltr">
                      <Timestamp value={log.createdAt} />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-[14px] font-semibold text-[#333333]">
                      {log.actorName}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <MutationBadge mutation={mutationTypeFor(log.action)} />
                    </TableCell>
                    <TableCell className="px-6 py-4 font-mono text-[12px] text-[#28293D]" dir="ltr">
                      {log.targetType}: {log.targetLabel}
                    </TableCell>
                    <TableCell className="pe-6 py-4 font-mono text-[12px] text-[#8B8B8B] text-end" dir="ltr">
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </SectionCard>
  );
};

export default AuditLogsSection;
