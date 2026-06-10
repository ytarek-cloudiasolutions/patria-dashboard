import { Clock, RefreshCw } from "lucide-react";
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
import SectionCard from "./SectionCard";
import { ATTENDANCE_RECORDS } from "../data";
import type { AttendanceRecord, AttendanceStatus } from "../types";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  Ongoing: "border-[#059B5A] bg-[#E2F4ED] text-[#059B5A]",
  Completed: "border-[#004EF9] bg-[#EDF4FB] text-[#3574FF]",
};

const StatusBadge = ({ status }: { status: AttendanceStatus }) => {
  const { t } = useTranslation();
  return (
    <Badge
      className={cn(
        "h-6 min-w-24 rounded-full border px-3 py-0 text-[11px] font-semibold",
        STATUS_STYLES[status],
      )}
    >
      {t(status)}
    </Badge>
  );
};

const RefreshButton = () => (
  <button
    type="button"
    aria-label="Refresh"
    className="flex size-10 cursor-pointer items-center justify-center rounded-[8px] bg-primary text-white hover:bg-primary/90"
  >
    <RefreshCw className="size-4.5" />
  </button>
);

const AttendanceCardRow = ({ record }: { record: AttendanceRecord }) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-[14px] font-semibold text-[#333333]">{record.staff}</p>
        <StatusBadge status={record.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <div>
          <p className="mb-0.5 font-semibold uppercase tracking-wide text-[#8B8B8B]">
            {t("In")}
          </p>
          <p className="text-[#28293D]" dir="ltr">{record.inTime}</p>
        </div>
        <div>
          <p className="mb-0.5 font-semibold uppercase tracking-wide text-[#8B8B8B]">
            {t("Out")}
          </p>
          <p className="text-[#28293D]" dir="ltr">{record.outTime}</p>
        </div>
        <div>
          <p className="mb-0.5 font-semibold uppercase tracking-wide text-[#8B8B8B]">
            {t("Logged Hours")}
          </p>
          <p className="text-[#28293D]" dir="ltr">{record.loggedHours}</p>
        </div>
      </div>
    </div>
  );
};

const AttendanceSection = () => {
  const { t } = useTranslation();
  return (
    <SectionCard
      icon={<Clock size={32} />}
      title={t("Attendance Logs")}
      subtitle={t("Manage your account and platform preferences")}
      contentClassName="px-0 py-0 sm:px-0 sm:py-0"
      action={<RefreshButton />}
    >
      {/* Mobile cards */}
      <div className="flex flex-col gap-3 p-4 md:hidden">
        {ATTENDANCE_RECORDS.map((record) => (
          <AttendanceCardRow key={record.id} record={record} />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block **:data-[slot=table-container]:rounded-none **:data-[slot=table-container]:border-0">
        <Table className="border-0">
          <TableHeader className="bg-white [&_tr:hover]:bg-white">
            <TableRow className="relative after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-[#E5E5E5]">
              <TableHead className="ps-6 py-4 text-start">{t("STAFF MEMBER")}</TableHead>
              <TableHead className="px-6 py-4 text-center">{t("IN-DATE/TIME")}</TableHead>
              <TableHead className="px-6 py-4 text-center">{t("OUT-DATE/TIME")}</TableHead>
              <TableHead className="px-6 py-4 text-center">{t("LOGGED HOURS")}</TableHead>
              <TableHead className="pe-6 py-4 text-end">{t("STATUS")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ATTENDANCE_RECORDS.map((record) => (
              <TableRow key={record.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4 text-[14px] font-semibold text-[#333333]">
                  {record.staff}
                </TableCell>
                <TableCell className="px-6 py-4 text-[13px] font-medium text-[#000000] text-center" dir="ltr">
                  {record.inTime}
                </TableCell>
                <TableCell className="px-6 py-4 text-[13px] font-medium text-[#000000] text-center" dir="ltr">
                  {record.outTime}
                </TableCell>
                <TableCell className="px-6 py-4 text-[13px] font-medium text-[#28293D] text-center" dir="ltr">
                  {record.loggedHours}
                </TableCell>
                <TableCell className="pe-6 py-4">
                  <div className="flex justify-end">
                    <StatusBadge status={record.status} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
};

export default AttendanceSection;
