import { Armchair, CalendarDays, Check, X } from "lucide-react";
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
import { Input } from "@/shared/components/ui/input";

interface ReservationsTableProps {
  reservations: Reservation[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onStatusChange: (reservationId: string, status: ReservationStatus) => void;
}

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
}: ReservationsTableProps) => {
  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[40px] leading-none font-semibold text-[#2C2C3E]">
          Today&apos;s Reservations
        </h2>
        <Input
          type="date"
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
          className="h-12 w-85.5 rounded-[12px] border border-[#D1D1D8] bg-white text-[14px] font-medium text-[#2D2D3D] outline-none"
        />
      </div>

      <Table className="table-fixed">
        <colgroup>
          <col className="w-[31%]" />
          <col className="w-[23%]" />
          <col className="w-[12%]" />
          <col className="w-[20%]" />
          <col className="w-[14%]" />
        </colgroup>
        <TableHeader>
          <TableRow className="h-11">
            <TableHead className="pl-6 pr-4 text-[13px] font-semibold text-[#4B4B5B]">
              Customer
            </TableHead>
            <TableHead className="pl-4 pr-7 text-[13px] font-semibold text-[#4B4B5B]">
              PEOPLE &amp; DATE
            </TableHead>
            <TableHead className="px-7 text-[13px] font-semibold text-[#4B4B5B]">
              TABLE
            </TableHead>
            <TableHead className="px-7 text-[13px] font-semibold text-[#4B4B5B]">
              Status
            </TableHead>
            <TableHead className="pl-7 pr-6 text-[13px] font-semibold text-[#4B4B5B]">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&_tr:hover]:bg-white">
          {reservations.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-[#8A8A99]"
              >
                No reservations match your current filter.
              </TableCell>
            </TableRow>
          ) : (
            reservations.map((reservation) => {
              const { showConfirm, showTableAction, showDelete } =
                getActionVisibility(reservation.status);

              const hasActions = showConfirm || showTableAction || showDelete;

              return (
                <TableRow key={reservation.id} className="h-16">
                  <TableCell className="pl-6 pr-4 align-middle">
                    <p className="text-[13px] font-semibold text-[#292939]">
                      {reservation.customerName}
                    </p>
                    <p className="mt-1 text-[11px] text-[#9A9AA6]">
                      {reservation.phone}
                    </p>
                  </TableCell>

                  <TableCell className="pl-4 pr-7 align-middle">
                    <p className="text-[13px] font-semibold text-[#2E2E3B]">
                      {reservation.people} People
                    </p>
                    <p className="mt-1 text-[11px] text-[#9A9AA6]">
                      {reservation.displayDate}
                    </p>
                  </TableCell>

                  <TableCell className="px-7 align-middle text-[13px] font-medium text-[#2E2E3B]">
                    {reservation.tableNumber}
                  </TableCell>

                  <TableCell className="px-7 align-middle">
                    <ReservationStatusDropdown
                      value={reservation.status}
                      onChange={(status) =>
                        onStatusChange(reservation.id, status)
                      }
                    />
                  </TableCell>

                  <TableCell className="pl-7 pr-6 align-middle">
                    {hasActions ? (
                      <div className="flex items-center gap-1.5">
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
                              aria-label={`Delete reservation for ${reservation.customerName}`}
                            >
                              <X size={13} />
                            </button>
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-[#8E8E9B]">-</span>
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
