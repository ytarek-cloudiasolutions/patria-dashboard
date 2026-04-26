import { useMemo, useState } from "react";
import { CalendarDays, Plus, Search } from "lucide-react";
import AddTableDialog from "../components/AddTableDialog";
import NewReservationDialog from "../components/NewReservationDialog";
import AddTableForm from "../components/AddTableForm";
import NewReservationForm from "../components/NewReservationForm";
import ReservationsTable from "../components/ReservationsTable";
import SectionTabs from "../components/SectionTabs";
import TableCardsBoard from "../components/TableCardsBoard";
import { INITIAL_RESERVATIONS, INITIAL_TABLES } from "../data";
import type {
  DiningTable,
  Reservation,
  ReservationStatus,
  TableSection,
} from "../types";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { Input } from "@/shared/components/ui/input";

const formatDisplayDate = (value: string) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TablesPage = () => {
  const [tables, setTables] = useState<DiningTable[]>(INITIAL_TABLES);
  const [reservations, setReservations] =
    useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [activeSection, setActiveSection] = useState<TableSection>("Main Hall");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("2026-03-15");
  const [isAddTableDialogOpen, setIsAddTableDialogOpen] = useState(false);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<DiningTable | null>(null);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<"table" | "reservation">(
    "table"
  );

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchesSection = table.section === activeSection;

      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        table.tableNumber.toString().includes(normalizedSearchTerm) ||
        table.section.toLowerCase().includes(normalizedSearchTerm) ||
        table.status.toLowerCase().includes(normalizedSearchTerm);

      return matchesSection && matchesSearch;
    });
  }, [activeSection, normalizedSearchTerm, tables]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesDate =
        selectedDate.length === 0 ||
        reservation.reservationDate === selectedDate;

      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        reservation.customerName.toLowerCase().includes(normalizedSearchTerm) ||
        reservation.phone.toLowerCase().includes(normalizedSearchTerm) ||
        reservation.tableNumber.toString().includes(normalizedSearchTerm) ||
        reservation.status.toLowerCase().includes(normalizedSearchTerm);

      return matchesDate && matchesSearch;
    });
  }, [normalizedSearchTerm, reservations, selectedDate]);

  const handleAddTable = (payload: {
    tableNumber: number;
    capacity: number;
    section: TableSection;
  }) => {
    const nextTable: DiningTable = {
      id: String(Date.now()),
      tableNumber: payload.tableNumber,
      capacity: payload.capacity,
      section: payload.section,
      status: "Available",
    };

    setTables((prev) => [...prev, nextTable]);
    setActiveSection(payload.section);
  };

  const handleDeleteTable = (tableId: string) => {
    const table = tables.find((item) => item.id === tableId);
    if (!table) return;
    setDeleteTarget("table");
    setSelectedReservation(null);
    setSelectedTable(table);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteReservation = (reservationId: string) => {
    const reservation = reservations.find((item) => item.id === reservationId);
    if (!reservation) return;
    setDeleteTarget("reservation");
    setSelectedTable(null);
    setSelectedReservation(reservation);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteTable = () => {
    if (deleteTarget === "table" && selectedTable) {
      setTables((prev) => prev.filter((table) => table.id !== selectedTable.id));
    }
    if (deleteTarget === "reservation" && selectedReservation) {
      setReservations((prev) =>
        prev.filter((reservation) => reservation.id !== selectedReservation.id)
      );
    }
    setIsDeleteDialogOpen(false);
    setSelectedTable(null);
    setSelectedReservation(null);
  };

  const handleTableStatusToggle = (tableId: string) => {
    setTables((prev) =>
      prev.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        return {
          ...table,
          status: table.status === "Available" ? "Unavailable" : "Available",
        };
      }),
    );
  };

  const handleReservationStatusChange = (
    reservationId: string,
    status: ReservationStatus,
  ) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId
          ? { ...reservation, status }
          : reservation,
      ),
    );
  };

  const handleAddReservation = (payload: {
    customerName: string;
    phone: string;
    people: number;
    date: string;
    time: string;
    tableNumber: number;
  }) => {
    const reservationDateTime = `${payload.date}T${payload.time}`;

    const nextReservation: Reservation = {
      id: String(Date.now()),
      customerName: payload.customerName,
      phone: payload.phone,
      people: payload.people,
      reservationDate: payload.date,
      displayDate: formatDisplayDate(reservationDateTime),
      tableNumber: payload.tableNumber,
      status: "On Hold",
    };

    setReservations((prev) => [nextReservation, ...prev]);
    setSelectedDate(payload.date);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-start justify-between">
        <HeaderLayout
          title="Tables"
          description="Manage and track table and reservation status"
        />
        <div className="flex flex-wrap items-center gap-4">
          <DefaultButton
            data={{
              buttonText: "New Reservation",
              icon: <CalendarDays className="size-4.5" />,
              variant: "outline",
              className:
                "text-primary border-[#F5F0EA] bg-[#F5F0EA] hover:text-primary hover:bg-[#F5F0EA]",
              onClick: () => setIsReservationDialogOpen(true),
            }}
          />
          <DefaultButton
            data={{
              buttonText: "Add New Table",
              icon: <Plus className="size-4.5" />,
              onClick: () => setIsAddTableDialogOpen(true),
            }}
          />
        </div>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-[#8B8B8B]"
        />
        <Input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search tables, reservations..."
          className="h-11 rounded-[8px] border-[#CACBD4] bg-white pl-10 text-[14px] placeholder:text-[#8B8B8B] focus-visible:ring-0"
        />
      </div>

      <SectionTabs
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <TableCardsBoard
        tables={filteredTables}
        onDelete={handleDeleteTable}
        onStatusToggle={handleTableStatusToggle}
      />

      <ReservationsTable
        reservations={filteredReservations}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onStatusChange={handleReservationStatusChange}
        onDeleteReservation={handleDeleteReservation}
      />

      <AddTableDialog
        open={isAddTableDialogOpen}
        onOpenChange={setIsAddTableDialogOpen}
        title="Add New Table"
      >
        <AddTableForm
          onSave={(payload) => {
            handleAddTable(payload);
            setIsAddTableDialogOpen(false);
          }}
          onCancel={() => setIsAddTableDialogOpen(false)}
        />
      </AddTableDialog>

      <NewReservationDialog
        open={isReservationDialogOpen}
        onOpenChange={setIsReservationDialogOpen}
        title="New Reservation"
      >
        <NewReservationForm
          tables={tables}
          onSave={(payload) => {
            handleAddReservation(payload);
            setIsReservationDialogOpen(false);
          }}
          onCancel={() => setIsReservationDialogOpen(false)}
        />
      </NewReservationDialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        data={{
          item:
            deleteTarget === "table"
              ? `Table ${selectedTable?.tableNumber ?? ""}`
              : selectedReservation?.customerName ?? "",
          type: deleteTarget,
        }}
        onConfirm={handleConfirmDeleteTable}
      />
    </div>
  );
};

export default TablesPage;
