import { useMemo, useState } from "react";
import { CalendarPlus, Plus, X } from "lucide-react";
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

import { INITIAL_RESERVATIONS, INITIAL_TABLES } from "./data";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type {
  AddTableFormData,
  Reservation,
  ReservationFormData,
  ReservationStatus,
  RestaurantTable,
  TableSection,
} from "./types";

const formatReservationDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return "";

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TablesPage = () => {
  const { t } = useTranslation();
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);
  const [reservations, setReservations] =
    useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [activeSection, setActiveSection] = useState<TableSection>("Main Hall");
  const [search, setSearch] = useState("");
  const [reservationDate, setReservationDate] = useState("");

  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [deletingTable, setDeletingTable] = useState<RestaurantTable | null>(
    null,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    const selectedDate = formatReservationDate(reservationDate);

    return reservations.filter((r) => {
      if (selectedDate && r.date !== selectedDate) return false;
      if (!q) return true;

      return [
        r.customer,
        r.phone,
        String(r.people),
        r.date,
        String(r.table),
        r.status,
      ].some((value) => value.toLowerCase().includes(q));
    });
  }, [reservations, reservationDate, search]);

  const reservationEmptyMessage =
    reservations.length === 0
      ? t("No reservations yet.")
      : reservationDate
        ? t("No reservations match your filters.")
        : search.trim()
          ? t("No reservations match your search.")
        : t("No reservations yet.");

  const tableOptions = useMemo(
    () =>
      tables.map((tbl) => ({
        value: String(tbl.id),
        label: `${t("Table")} ${tbl.number} — ${t(tbl.section)} (${tbl.capacity} ${t("ppl")})`,
      })),
    [tables, t],
  );

  const handleAddTable = (data: AddTableFormData) => {
    const newTable: RestaurantTable = {
      id: Date.now(),
      number: Number(data.number) || 0,
      capacity: Number(data.capacity) || 0,
      section: data.section,
      status: "Available",
    };
    setTables((prev) => [...prev, newTable]);
    setActiveSection(data.section);
  };

  const handleConfirmDelete = () => {
    if (!deletingTable) return;
    setTables((prev) => prev.filter((t) => t.id !== deletingTable.id));
    setDeletingTable(null);
  };

  const handleStatusChange = (id: number, status: ReservationStatus) =>
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );

  const handleAddReservation = (data: ReservationFormData) => {
    const table = tables.find((t) => String(t.id) === data.table);
    const newReservation: Reservation = {
      id: Date.now(),
      customer: data.name.trim(),
      phone: data.phone.trim(),
      people: Number(data.people) || 0,
      date: formatReservationDate(data.date) || "—",
      table: table?.number ?? 0,
      status: "On Hold",
    };
    setReservations((prev) => [newReservation, ...prev]);
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

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
        {sectionTables.map((table) => (
          <TableCard key={table.id} table={table} onDelete={setDeletingTable} />
        ))}
        {sectionTables.length === 0 && (
          <p className="col-span-full py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No tables in this section.")}
          </p>
        )}
      </div>

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
          {reservationDate && (
            <button
              type="button"
              aria-label={t("Clear reservation date filter")}
              onClick={() => setReservationDate("")}
              className="mt-2 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-[8px] px-2 text-[13px] font-medium text-[#8B8B8B] hover:bg-[#F5F0EA] hover:text-[#28293D]"
            >
              <X size={14} />
              {t("Clear date")}
            </button>
          )}
        </div>
      </div>

      <ReservationsTable
        reservations={filteredReservations}
        emptyMessage={reservationEmptyMessage}
        onStatusChange={handleStatusChange}
        onDropdownOpenChange={setIsDropdownOpen}
      />

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
