import { useMemo, useState } from "react";
import AddTableDialog from "../components/AddTableDialog";
import NewReservationDialog from "../components/NewReservationDialog";
import ReservationsTable from "../components/ReservationsTable";
import SectionTabs from "../components/SectionTabs";
import TableCardsBoard from "../components/TableCardsBoard";
import TablesToolbar from "../components/TablesToolbar";
import { INITIAL_RESERVATIONS, INITIAL_TABLES } from "../data";
import type {
  DiningTable,
  Reservation,
  ReservationStatus,
  TableSection,
} from "../types";

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
    setTables((prev) => prev.filter((table) => table.id !== tableId));
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
    <div>
      <TablesToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenAddTable={() => setIsAddTableDialogOpen(true)}
        onOpenNewReservation={() => setIsReservationDialogOpen(true)}
      />

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
      />

      <AddTableDialog
        open={isAddTableDialogOpen}
        onOpenChange={setIsAddTableDialogOpen}
        onSubmit={handleAddTable}
      />

      <NewReservationDialog
        open={isReservationDialogOpen}
        onOpenChange={setIsReservationDialogOpen}
        tables={tables}
        onSubmit={handleAddReservation}
      />
    </div>
  );
};

export default TablesPage;
