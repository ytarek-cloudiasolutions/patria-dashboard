import { Check, Armchair, CalendarX, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Reservation, ReservationStatus } from "../types";
import ReservationStatusBadge from "./ReservationStatusBadge";
import ReservationStatusSelect from "./ReservationStatusSelect";

interface ReservationsTableProps {
  reservations: Reservation[];
  emptyMessage: string;
  onStatusChange: (id: number, status: ReservationStatus) => void;
  onDropdownOpenChange: (open: boolean) => void;
}

type ActionKey = "confirm" | "seat" | "cancel";

const STATUS_ACTIONS: Record<ReservationStatus, ActionKey[]> = {
  "On Hold": ["confirm", "seat", "cancel"],
  Sitting: ["confirm", "cancel"],
  Confirmed: ["seat", "cancel"],
  cancelled: [],
  Ended: [],
};

const ACTION_META: Record<
  ActionKey,
  {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
    bg: string;
    label: string;
  }
> = {
  confirm: {
    icon: Check,
    color: "text-[#3574FF]",
    bg: "bg-[#EDF4FB]",
    label: "Confirm",
  },
  seat: {
    icon: Armchair,
    color: "text-[#059B5A]",
    bg: "bg-[#E2F4ED]",
    label: "Seat",
  },
  cancel: {
    icon: X,
    color: "text-[#C90000]",
    bg: "bg-[#FFF0F0]",
    label: "Cancel",
  },
};

const RowActions = ({
  reservation,
  onStatusChange,
}: {
  reservation: Reservation;
  onStatusChange: (id: number, status: ReservationStatus) => void;
}) => {
  const actions = STATUS_ACTIONS[reservation.status];
  if (actions.length === 0) {
    return <span className="text-[14px] text-[#8B8B8B]">—</span>;
  }
  return (
    <div className="flex items-center gap-3">
      {actions.map((key) => {
        const { icon: Icon, color, bg, label } = ACTION_META[key];
        return (
          <button
            key={key}
            type="button"
            aria-label={`${label} reservation for ${reservation.customer}`}
            onClick={() =>
              onStatusChange(
                reservation.id,
                key === "cancel"
                  ? "cancelled"
                  : key === "seat"
                    ? "Sitting"
                    : "Confirmed",
              )
            }
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-[10px]",
              bg,
              color,
            )}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
};

const ReservationsTable = ({
  reservations,
  emptyMessage,
  onStatusChange,
  onDropdownOpenChange,
}: ReservationsTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#D8D8D8] bg-white px-4 py-10 text-center">
            <CalendarX size={22} className="text-[#8B8B8B]" />
            <p className="text-[14px] font-medium text-[#8B8B8B]">
              {emptyMessage}
            </p>
          </div>
        ) : (
          reservations.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[#28293D]">
                    {r.customer}
                  </p>
                  <p className="text-[12px] text-[#8B8B8B]" dir="ltr">
                    {r.phone}
                  </p>
                </div>
                <ReservationStatusBadge status={r.status} />
              </div>
              <div className="mb-3 grid grid-cols-3 gap-3 text-[12px]">
                <div>
                  <p className="mb-0.5 font-semibold uppercase tracking-wide text-[#8B8B8B]">
                    {t("People")}
                  </p>
                  <p className="text-[#28293D]" dir="ltr">
                    {r.people} {t("People")}
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 font-semibold uppercase tracking-wide text-[#8B8B8B]">
                    {t("Date")}
                  </p>
                  <p className="text-[#28293D]" dir="ltr">
                    {r.date}
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 font-semibold uppercase tracking-wide text-[#8B8B8B]">
                    {t("TABLE")}
                  </p>
                  <p className="text-[#28293D]">{r.table}</p>
                </div>
              </div>
              <RowActions reservation={r} onStatusChange={onStatusChange} />
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table className="min-w-175">
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">{t("CUSTOMER")}</TableHead>
              <TableHead className="px-6 py-4 ">{t("PEOPLE & DATE")}</TableHead>
              <TableHead className="px-6 py-4 ">{t("TABLE")}</TableHead>
              <TableHead className="px-6 py-4">{t("Status")}</TableHead>
              <TableHead className="px-6 py-4">{t("ACTIONS")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-12">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <CalendarX size={24} className="text-[#8B8B8B]" />
                    <p className="text-[14px] font-medium text-[#8B8B8B]">
                      {emptyMessage}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((r) => (
                <TableRow key={r.id} className="hover:bg-[#FAFAF8]">
                  <TableCell className="px-6 py-4">
                    <p
                      className="text-[14px] font-semibold text-[#28293D]"
                      dir="ltr"
                    >
                      {r.customer}
                    </p>
                    <p className="text-[12px] text-[#8B8B8B]" dir="ltr">
                      {r.phone}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p className="text-[14px] text-[#28293D]" dir="ltr">
                      {r.people} {t("People")}
                    </p>
                    <p className="text-[12px] text-[#8B8B8B]" dir="ltr">
                      {r.date}
                    </p>
                  </TableCell>
                  <TableCell
                    className="px-6 py-4 text-[14px] text-[#28293D]"
                    dir="ltr"
                  >
                    {r.table}
                  </TableCell>
                  <TableCell className="px-6 py-4" dir="ltr">
                    <ReservationStatusSelect
                      status={r.status}
                      onChange={(status) => onStatusChange(r.id, status)}
                      onOpenChange={onDropdownOpenChange}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4" dir="ltr">
                    <RowActions
                      reservation={r}
                      onStatusChange={onStatusChange}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ReservationsTable;
