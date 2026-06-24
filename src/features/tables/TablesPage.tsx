import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, Loader2, Plus, X } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DatePicker from "@/shared/components/DatePicker";
import DeleteDialog from "@/shared/components/DeleteDialog";
import SearchInputField from "@/shared/components/SearchInputField";

import TablesTabs from "./components/TablesTabs";
import TableCard from "./components/TableCard";
import ReservationsTable from "./components/ReservationsTable";
import AddTableDialog from "./components/AddTableDialog";
import NewReservationDialog from "./components/NewReservationDialog";

import { useTables } from "./hooks/useTables";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Table, TableSection, ReservationStatus } from "./store/tableTypes";
import type {
  AddTableFormData,
  ReservationFormData,
} from "./types";

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const convertTo24Hour = (timeStr: string): string => {
  if (!timeStr) return "";
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return timeStr;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hours < 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  const hoursStr = String(hours).padStart(2, "0");
  return `${hoursStr}:${minutes}`;
};

const TablesPage = () => {
  const { t } = useTranslation();
  const {
    tables,
    isFetchingTables,
    togglingTableId,
    getTables,
    createTable,
    updateTableStatus,
    deleteTable: deleteTableAction,

    // Reservations
    reservations,
    togglingReservationId,
    isFetchingReservations,
    getReservations,
    createReservation,
    updateReservationStatus: updateReservationStatusAction,
    deleteReservation: deleteReservationAction,
  } = useTables();

  const [activeSection, setActiveSection] =
    useState<TableSection>("main_hall");
  const [search, setSearch] = useState("");
  const [reservationDate, setReservationDate] = useState(getTodayDateString);

  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [deletingTable, setDeletingTable] = useState<Table | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch tables and reservations on mount
  useEffect(() => {
    getTables();
  }, [getTables]);

  // Fetch reservations whenever the selected date changes
  useEffect(() => {
    if (reservationDate) {
      getReservations({ date: reservationDate });
    }
  }, [reservationDate, getReservations]);

  const sectionTables = useMemo(() => {
    const q = search.toLowerCase().trim();
    return tables.filter((t) => {
      if (t.section !== activeSection) return false;
      if (!q) return true;
      return (
        String(t.number).includes(q) ||
        t.section.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q)
      );
    });
  }, [tables, activeSection, search]);

  const filteredReservations = useMemo(() => {
    const q = search.toLowerCase().trim();

    return reservations.filter((r) => {
      if (!q) return true;

      return [
        r.customerName,
        r.phone,
        String(r.numberOfPeople),
        r.date,
        String(r.tableId?.number ?? ""),
        r.status,
      ].some((value) => value && value.toLowerCase().includes(q));
    });
  }, [reservations, search]);

  const reservationEmptyMessage =
    reservations.length === 0
      ? t("No reservations yet.")
      : search.trim()
        ? t("No reservations match your search.")
        : t("No reservations yet.");

  const tableOptions = useMemo(
    () =>
      tables.map((tbl) => ({
        value: tbl._id,
        label: `${t("Table")} ${tbl.number} (${tbl.capacity} ${t("ppl")})`,
      })),
    [tables, t],
  );

  const handleAddTable = (data: AddTableFormData) => {
    createTable({
      number: Number(data.number) || 0,
      capacity: Number(data.capacity) || 0,
      section: data.section,
    });
    setIsAddTableOpen(false);
  };

  const handleToggleStatus = (table: Table) => {
    const newStatus = table.status === "available" ? "occupied" : "available";
    updateTableStatus({ tableId: table._id, status: newStatus });
  };

  const handleConfirmDelete = () => {
    if (!deletingTable) return;
    deleteTableAction({ tableId: deletingTable._id });
    setDeletingTable(null);
  };

  const handleStatusChange = (id: string, status: ReservationStatus) => {
    const r = reservations.find((item) => item._id === id);
    if (!r) return;

    if (status === "cancelled") {
      deleteReservationAction({ reservationId: id });
    } else {
      updateReservationStatusAction({
        reservationId: id,
        status,
        previousStatus: r.status,
      });
    }
  };

  const handleAddReservation = (data: ReservationFormData) => {
    createReservation({
      customerName: data.name.trim(),
      phone: data.phone.trim(),
      customerEmail: data.email.trim() || undefined,
      date: data.date,
      time: convertTo24Hour(data.time),
      numberOfPeople: Number(data.people) || 0,
      tableId: data.table,
    });
  };

  return (
    <>
      {isDropdownOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Tables")}
          description={t("Manage and track table and reservation status")}
        />
        <div className="flex flex-wrap items-center gap-3">
          <DefaultButton
            data={{
              buttonText: t("New Reservation"),
              variant: "outline",
              icon: <CalendarPlus className="size-4.5" />,
              onClick: () => setIsReservationOpen(true),
              className:
                "border-transparent bg-[#F5F0EA] text-primary hover:bg-[#F5F0EA] hover:text-primary",
            }}
          />
          <DefaultButton
            data={{
              buttonText: t("Add New Table"),
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsAddTableOpen(true),
            }}
          />
        </div>
      </div>

      <div className="mb-5">
        <SearchInputField
          value={search}
          onChange={setSearch}
          placeholder={t("Search tables, reservations...")}
        />
      </div>

      <TablesTabs active={activeSection} onChange={setActiveSection} />

      {isFetchingTables ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {sectionTables.map((table) => (
            <TableCard
              key={table._id}
              table={table}
              isTogglingStatus={togglingTableId === table._id}
              onDelete={setDeletingTable}
              onToggleStatus={handleToggleStatus}
            />
          ))}
          {sectionTables.length === 0 && (
            <p className="col-span-full py-8 text-center text-[14px] text-[#8B8B8B]">
              {t("No tables in this section.")}
            </p>
          )}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[20px] font-bold text-[#28293D]">
          {t("Today's Reservations")}
        </h2>
        <div className="sm:w-70">
          <DatePicker
            value={reservationDate}
            onChange={setReservationDate}
            placeholder="06/04/2026"
            popoverPlacement="bottom-right"
            withBackdrop
          />
          {reservationDate && reservationDate !== getTodayDateString() && (
            <button
              type="button"
              aria-label={t("Clear reservation date filter")}
              onClick={() => setReservationDate(getTodayDateString())}
              className="mt-2 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[8px] px-2 text-[13px] font-medium text-[#8B8B8B] hover:bg-[#F5F0EA] hover:text-[#28293D]"
            >
              <X size={14} />
              {t("Clear date")}
            </button>
          )}
        </div>
      </div>

      {isFetchingReservations ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <ReservationsTable
          reservations={filteredReservations}
          emptyMessage={reservationEmptyMessage}
          togglingReservationId={togglingReservationId}
          onStatusChange={handleStatusChange}
          onDropdownOpenChange={setIsDropdownOpen}
        />
      )}

      <AddTableDialog
        open={isAddTableOpen}
        defaultSection={activeSection}
        onOpenChange={setIsAddTableOpen}
        onSave={handleAddTable}
      />

      <NewReservationDialog
        open={isReservationOpen}
        tableOptions={tableOptions}
        onOpenChange={setIsReservationOpen}
        onSave={handleAddReservation}
      />

      <DeleteDialog
        open={!!deletingTable}
        onOpenChange={(open) => !open && setDeletingTable(null)}
        data={{
          item: deletingTable ? String(deletingTable.number) : "",
          type: "table",
          typeBeforeName: true,
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default TablesPage;
