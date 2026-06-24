import { Check, Armchair, CalendarX, X, Loader2 } from "lucide-react";
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
  togglingReservationId: string | null;
  onStatusChange: (id: string, status: ReservationStatus) => void;
  onDropdownOpenChange: (open: boolean) => void;
}

type ActionKey = "confirm" | "seat" | "cancel";

const STATUS_ACTIONS: Record<ReservationStatus, ActionKey[]> = {
  on_hold: ["confirm", "seat", "cancel"],
  sitting: ["confirm", "cancel"],
  confirmed: ["seat", "cancel"],
  cancelled: [],
  ended: [],
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

const formatDisplayDate = (isoString: string) => {
  if (!isoString) return "";
  const datePart = isoString.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) return isoString;

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const RowActions = ({
  reservation,
  isLoading,
  onStatusChange,
}: {
  reservation: Reservation;
  isLoading: boolean;
  onStatusChange: (id: string, status: ReservationStatus) => void;
}) => {
  const actions = STATUS_ACTIONS[reservation.status] ?? [];
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
            disabled={isLoading}
            aria-label={`${label} reservation for ${reservation.customerName}`}
            onClick={() =>
              onStatusChange(
                reservation._id,
                key === "cancel"
                  ? "cancelled"
                  : key === "seat"
                    ? "sitting"
                    : "confirmed",
              )
            }
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-[10px] transition-opacity",
              bg,
              color,
              isLoading && "pointer-events-none opacity-50",
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
  togglingReservationId,
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
          reservations.map((r) => {
            const isRowLoading = togglingReservationId === r._id;
            return (
              <div
                key={r._id}
                className={cn(
                  "rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4 transition-opacity",
                  isRowLoading && "opacity-80",
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[#28293D]">
                      {r.customerName}
                    </p>
                    <p className="text-[12px] text-[#8B8B8B]" dir="ltr">
                      {r.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isRowLoading && (
                      <Loader2 size={14} className="animate-spin text-[#8B8B8B]" />
                    )}
                    <ReservationStatusBadge status={r.status} />
                  </div>
                </div>
                <div className="mb-3 grid grid-cols-3 gap-3 text-[12px]">
                  <div>
                    <p className="mb-0.5 font-semibold uppercase tracking-wide text-[#8B8B8B]">
                      {t("People")}
                    </p>
                    <p className="text-[#28293D]" dir="ltr">
                      {r.numberOfPeople} {t("People")}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0.5 font-semibold uppercase tracking-wide text-[#8B8B8B]">
                      {t("Date")}
                    </p>
                    <p className="text-[#28293D]" dir="ltr">
                      {formatDisplayDate(r.date)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0.5 font-semibold uppercase tracking-wide text-[#8B8B8B]">
                      {t("TABLE")}
                    </p>
                    <p className="text-[#28293D]">{r.tableId?.number ?? ""}</p>
                  </div>
                </div>
                <RowActions
                  reservation={r}
                  isLoading={isRowLoading}
                  onStatusChange={onStatusChange}
                />
              </div>
            );
          })
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
              reservations.map((r) => {
                const isRowLoading = togglingReservationId === r._id;
                return (
                  <TableRow
                    key={r._id}
                    className={cn(
                      "hover:bg-[#FAFAF8] transition-opacity",
                      isRowLoading && "opacity-80",
                    )}
                  >
                    <TableCell className="px-6 py-4">
                      <p
                        className="text-[14px] font-semibold text-[#28293D]"
                        dir="ltr"
                      >
                        {r.customerName}
                      </p>
                      <p className="text-[12px] text-[#8B8B8B]" dir="ltr">
                        {r.phone}
                      </p>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <p className="text-[14px] text-[#28293D]" dir="ltr">
                        {r.numberOfPeople} {t("People")}
                      </p>
                      <p className="text-[12px] text-[#8B8B8B]" dir="ltr">
                        {formatDisplayDate(r.date)}
                      </p>
                    </TableCell>
                    <TableCell
                      className="px-6 py-4 text-[14px] text-[#28293D]"
                      dir="ltr"
                    >
                      {r.tableId?.number ?? ""}
                    </TableCell>
                    <TableCell className="px-6 py-4" dir="ltr">
                      <ReservationStatusSelect
                        status={r.status}
                        isLoading={isRowLoading}
                        onChange={(status) => onStatusChange(r._id, status)}
                        onOpenChange={onDropdownOpenChange}
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4" dir="ltr">
                      <RowActions
                        reservation={r}
                        isLoading={isRowLoading}
                        onStatusChange={onStatusChange}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ReservationsTable;
