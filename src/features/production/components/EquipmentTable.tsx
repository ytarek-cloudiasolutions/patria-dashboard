import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { EquipmentRecord, EquipmentStatus, EquipmentTask } from "../types";

interface EquipmentTableProps {
  records: EquipmentRecord[];
}

const STATUS_STYLES: Record<EquipmentStatus, string> = {
  Healthy: "bg-[#E2F4ED] text-[#059B5A] border-current",
  Poor: "bg-[#FFF0F0] text-[#C90000] border-current",
  Maintenance: "bg-[#FFF5DC] text-[#B56C00] border-current",
};

const TaskBadge = ({ task }: { task: EquipmentTask }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-6 rounded-full border px-3 py-0 text-[11px] font-semibold border-[#595959] bg-[#E5E5E5] text-[#23252A]",
        task,
      )}
    >
      {t(task)}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: EquipmentStatus }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-6 min-w-24 rounded-full border px-3 py-0 text-[12px] font-semibold",
        STATUS_STYLES[status],
      )}
    >
      {t(status)}
    </Badge>
  );
};

const formatEgp = (value: number) =>
  `EGP ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const EquipmentTable = ({ records }: EquipmentTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 md:hidden">
        {records.map((record) => (
          <div
            key={record.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <p className="text-[14px] font-semibold text-[#28293D]">
                {record.machine}
              </p>
              <StatusBadge status={record.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Task")}
                </p>
                <TaskBadge task={record.task} />
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Operator")}
                </p>
                <p className="text-[#28293D]">{record.operator}</p>
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Deadline")}
                </p>
                <p className="text-[#28293D]" dir="ltr">{record.deadline}</p>
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Cost")}
                </p>
                <p className="font-semibold text-[#28293D]" dir="ltr">
                  {formatEgp(record.cost)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {records.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No equipment records yet.")}
          </p>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">{t("MACHINE")}</TableHead>
              <TableHead className="px-6 py-4 text-center">{t("TASK")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("OPERATOR")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("DEADLINE")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("COST")}</TableHead>
              <TableHead className="pe-6 py-4 text-end">{t("STATUS")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4 whitespace-nowrap text-[14px] font-semibold text-[#28293D]">
                  {record.machine}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                  <TaskBadge task={record.task} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-[#28293D]">
                  {record.operator}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-[13px] text-black" >
                  {record.deadline}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] font-semibold text-[#28293D]" >
                  {formatEgp(record.cost)}
                </TableCell>
                <TableCell className="pe-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-end">
                    <StatusBadge status={record.status} />
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {records.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  {t("No equipment records yet.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default EquipmentTable;
