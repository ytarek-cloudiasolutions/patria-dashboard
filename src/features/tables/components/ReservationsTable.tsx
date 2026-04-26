import { useEffect, useRef, useState } from "react";
import {
  Armchair,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import ReservationStatusDropdown from "./ReservationStatusDropdown";
import type { Reservation, ReservationStatus } from "../types";
import DefaultButton from "@/shared/components/DefaultButton";

interface ReservationsTableProps {
  reservations: Reservation[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onStatusChange: (reservationId: string, status: ReservationStatus) => void;
  onDeleteReservation: (reservationId: string) => void;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];

const toYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseYmd = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatFieldDate = (value: string) => {
  const parsed = parseYmd(value);
  if (!parsed) return "";
  return parsed.toLocaleDateString("en-GB");
};

const buildCalendarDays = (viewDate: Date) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - firstDayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return {
      date,
      inCurrentMonth: date.getMonth() === month,
    };
  });
};

interface ReservationDatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

const ReservationDatePicker = ({
  value,
  onChange,
}: ReservationDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [viewDate, setViewDate] = useState<Date>(parseYmd(value) ?? new Date());
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempValue(value);
    setViewDate(parseYmd(value) ?? new Date());
  }, [value]);

  useEffect(() => {
    if (!open || value) return;
    const today = new Date();
    setTempValue(toYmd(today));
    setViewDate(today);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  const selectedDate = parseYmd(tempValue);
  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const calendarDays = buildCalendarDays(viewDate);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-12 w-85.5 rounded-[12px] border border-[#D1D1D8] bg-white px-4 text-left text-[14px] font-medium text-[#2D2D3D] flex items-center justify-between"
      >
        <span className={value ? "text-[#2D2D3D]" : "text-[#8B8B8B]"}>
          {value ? formatFieldDate(value) : "dd/MM/YYYY"}
        </span>
        <CalendarDays className="size-5 text-[#000000]" />
      </button>

      {open && (
        <div className="absolute bottom-[calc(100%+8px)] right-0 z-[90] w-85.5 rounded-[16px] border border-[#E5E5E5] bg-white p-4 shadow-lg">
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[18px] font-semibold text-[#28293D]">
                {monthLabel}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setViewDate(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                    )
                  }
                  className="inline-flex size-8 items-center justify-center rounded-md hover:bg-[#F5F0EA]"
                >
                  <ChevronLeft className="size-5 text-[#000000]" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setViewDate(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                    )
                  }
                  className="inline-flex size-8 items-center justify-center rounded-md hover:bg-[#F5F0EA]"
                >
                  <ChevronRight className="size-5 text-[#000000]" />
                </button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7 text-center text-[14px] text-[#8B8B8B]">
              {WEEK_DAYS.map((day) => (
                <span key={day} className="py-1">
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
              {calendarDays.map(({ date, inCurrentMonth }) => {
                const dayValue = toYmd(date);
                const isSelected =
                  selectedDate && dayValue === toYmd(selectedDate);

                return (
                  <button
                    key={dayValue}
                    type="button"
                    onClick={() => setTempValue(dayValue)}
                    className={`mx-auto inline-flex size-9 items-center justify-center rounded-[10px] text-[16px] ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : inCurrentMonth
                        ? "text-[#23252A] hover:bg-[#F5F0EA]"
                        : "text-[#8B8B8B] hover:bg-[#F5F0EA]"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <DefaultButton
                data={{
                  buttonText: "Cancel",
                  type: "button",
                  variant: "outline",
                  onClick: () => {
                    setTempValue(value);
                    setOpen(false);
                  },
                  className:
                    "h-11 px-6 text-primary border-primary hover:bg-white hover:text-primary",
                }}
              />
              <DefaultButton
                data={{
                  buttonText: "Select",
                  type: "button",
                  onClick: () => {
                    onChange(tempValue);
                    setOpen(false);
                  },
                  className: "h-11 px-6",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getActionVisibility = (status: ReservationStatus) => {
  const showConfirm = status === "On Hold" || status === "Sitting";
  const showTableAction = status === "On Hold" || status === "Confirmed";
  const showDelete = status !== "Ended" && status !== "cancelled";

  return { showConfirm, showTableAction, showDelete };
};

const ReservationsTable = ({
  reservations,
  selectedDate,
  onDateChange,
  onStatusChange,
  onDeleteReservation,
}: ReservationsTableProps) => {
  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[#28293D] text-[20px] font-semibold leading-none">
          Today&apos;s Reservations
        </h2>
        <ReservationDatePicker value={selectedDate} onChange={onDateChange} />
      </div>

      <Table>
        <colgroup>
          <col style={{ width: "196.4px" }} />
          <col style={{ width: "196.4px" }} />
          <col style={{ width: "196.4px" }} />
          <col style={{ width: "196.4px" }} />
          <col style={{ width: "196.4px" }} />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead>CUSTOMER</TableHead>
            <TableHead>PEOPLE &amp; DATE</TableHead>
            <TableHead>TABLE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                No reservations match your current filter.
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((reservation) => {
              const { showConfirm, showTableAction, showDelete } =
                getActionVisibility(reservation.status);

              const hasActions = showConfirm || showTableAction || showDelete;

              return (
                <TableRow key={reservation.id}>
                  <TableCell className="py-4 text-[#28293D] text-[14px] font-medium">
                    <p className="font-semibold text-[#292939]">
                      {reservation.customerName}
                    </p>
                    <p className="mt-1 text-[12px] text-[#8B8B8B] font-medium">
                      {reservation.phone}
                    </p>
                  </TableCell>
                  <TableCell className="py-4 text-[#28293D] text-[14px] font-medium">
                    <p className="font-semibold text-[#2E2E3B]">
                      {reservation.people} People
                    </p>
                    <p className="mt-1 text-[12px] text-[#8B8B8B] font-medium">
                      {reservation.displayDate}
                    </p>
                  </TableCell>
                  <TableCell className="py-4 text-[#28293D] text-[14px] font-medium">
                    {reservation.tableNumber}
                  </TableCell>
                  <TableCell className="py-4">
                    <ReservationStatusDropdown
                      value={reservation.status}
                      onChange={(status) =>
                        onStatusChange(reservation.id, status)
                      }
                    />
                  </TableCell>
                  <TableCell className="py-4">
                    {hasActions ? (
                      <div className="flex items-center gap-2">
                        {showConfirm && (
                          <Badge
                            asChild
                            className="h-auto rounded-[6px] bg-[#EEF4FF] p-1 text-[#2F7BEA]"
                          >
                            <button
                              type="button"
                              aria-label={`Confirm reservation for ${reservation.customerName}`}
                            >
                              <Check size={13} />
                            </button>
                          </Badge>
                        )}

                        {showTableAction && (
                          <Badge
                            asChild
                            className="h-auto rounded-[6px] bg-[#EAF9F1] p-1 text-[#22B26F]"
                          >
                            <button
                              type="button"
                              aria-label={`Assign table for ${reservation.customerName}`}
                            >
                              <Armchair size={13} />
                            </button>
                          </Badge>
                        )}

                        {showDelete && (
                          <Badge
                            asChild
                            className="h-auto rounded-[6px] bg-[#FFF0F0] p-1 text-[#D23A3A]"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                onDeleteReservation(reservation.id)
                              }
                              aria-label={`Delete reservation for ${reservation.customerName}`}
                            >
                              <X size={13} />
                            </button>
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="ml-9 w-[18px] h-0.5 bg-[#8B8B8B] rounded-full" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReservationsTable;
