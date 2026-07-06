import { useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import SearchInputField from "@/shared/components/SearchInputField";
import DeleteDialog from "@/shared/components/DeleteDialog";

import LogisticsOverview from "./components/LogisticsOverview";
import ZoneAccordion from "./components/ZoneAccordion";
import DispatchPanel from "./components/DispatchPanel";
import DriverDutyCard from "./components/DriverDutyCard";
import DriversTable from "./components/DriverStable";
import AddDriverDialog from "./components/AddDriverDialog";
import SendNotificationDialog from "./components/SendNotificationDialog";

import { useLogistics } from "./hooks/useLogistics";
import type { Driver as BackendDriver } from "./store/logisticsTypes";
import type { Driver, DriverFormData, DriverStatus, VehicleType, Zone } from "./types";

// ---------------------------------------------------------------------------
// Status / vehicle-type mappers between backend (lowercase) and local (Title)
// ---------------------------------------------------------------------------

const mapStatus = (s: string | undefined): DriverStatus => {
  switch (s) {
    case "active":
      return "Active";
    case "busy":
      return "On-Route";
    case "offline":
    default:
      return "Off-Duty";
  }
};

const reverseMapStatus = (s: DriverStatus): BackendDriver["status"] => {
  switch (s) {
    case "Active":
      return "active";
    case "On-Route":
      return "busy";
    case "Off-Duty":
    default:
      return "offline";
  }
};

const mapVehicle = (v: string | undefined): VehicleType => {
  switch (v) {
    case "car":
      return "Car";
    case "bicycle":
      return "Motorcycle";
    case "motorcycle":
    default:
      return "Motorcycle";
  }
};

const reverseMapVehicle = (v: VehicleType): BackendDriver["vehicleType"] => {
  switch (v) {
    case "Car":
      return "car";
    case "Van":
      return "car";
    case "Motorcycle":
    default:
      return "motorcycle";
  }
};

/** Convert one backend driver to the local UI Driver shape. */
const toLocalDriver = (d: BackendDriver, idx: number): Driver => ({
  id: idx + 1,
  name: d.name,
  whatsappPhone: d.whatsappPhone ?? d.phone ?? "",
  vehicleType: mapVehicle(d.vehicleType),
  plateNumber: undefined,
  zones: d.zones ?? [],
  status: mapStatus(d.status),
  ordersToday: 0,
  salaryNow: 0,
  hourlyRate: 0,
  dutyTime: "00:00:00",
});

const LogisticsPage = () => {
  const { t } = useTranslation();

  const {
    drivers: hookDrivers,
    stats,
    getDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
  } = useLogistics();

  // Local UI state for drivers (seeded from store)
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // Zones remain local (no zones API in the logistics hook)
  const [zones, setZones] = useState<Zone[]>([]);

  // Map from local numeric id → backend _id string (for mutations)
  const idMap = useRef<Map<number, string>>(new Map());

  const [search, setSearch] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>();
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);
  const [notifyingDriver, setNotifyingDriver] = useState<Driver | null>(null);

  // Fetch drivers on mount
  useEffect(() => {
    getDrivers();
  }, [getDrivers]);

  // Sync local state whenever the store updates
  useEffect(() => {
    if (hookDrivers && hookDrivers.length > 0) {
      idMap.current.clear();
      const mapped: Driver[] = hookDrivers.map((d: BackendDriver, idx: number) => {
        const localId = idx + 1;
        idMap.current.set(localId, d._id);
        return toLocalDriver(d, idx);
      });
      setDrivers(mapped);
    }
  }, [hookDrivers]);

  // -------------------------------------------------------------------------
  // Overview stats from hook (falls back to derived values if hook not ready)
  // -------------------------------------------------------------------------
  const overview = useMemo(() => {
    const pendingOrders = stats
      ? stats.waitingOrders
      : zones.reduce(
          (sum, zone) => sum + zone.orders.filter((o) => !o.assignedDriverName).length,
          0,
        );
    const officialDrivers = stats
      ? stats.activeDrivers + stats.offlineDrivers + stats.busyDrivers
      : drivers.length;
    return {
      activeZones: zones.length,
      officialDrivers,
      pendingOrders,
    };
  }, [zones, drivers, stats]);

  // -------------------------------------------------------------------------
  // Zone / dispatch helpers (unchanged — zones are local-only UI data)
  // -------------------------------------------------------------------------
  const filteredZones = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return zones;
    return zones
      .map((zone) => ({
        ...zone,
        orders: zone.orders.filter(
          (order) =>
            order.reference.toLowerCase().includes(q) ||
            order.customer.toLowerCase().includes(q) ||
            (order.assignedDriverName ?? "").toLowerCase().includes(q),
        ),
      }))
      .filter(
        (zone) => zone.name.toLowerCase().includes(q) || zone.orders.length > 0,
      );
  }, [zones, search]);

  const selectedReferences = useMemo(() => {
    const refs: string[] = [];
    zones.forEach((zone) =>
      zone.orders.forEach((order) => {
        if (selectedOrderIds.has(order.id)) refs.push(order.reference);
      }),
    );
    return refs;
  }, [zones, selectedOrderIds]);

  const toggleOrder = (id: string) =>
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleZone = (zone: Zone) =>
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      const unassigned = zone.orders.filter((o) => !o.assignedDriverName);
      const allSelected = unassigned.every((o) => next.has(o.id));
      unassigned.forEach((o) => {
        if (allSelected) next.delete(o.id);
        else next.add(o.id);
      });
      return next;
    });

  const handleSend = () => {
    const driver = drivers.find((d) => String(d.id) === selectedDriverId);
    if (!driver) return;
    const firstName = driver.name.split(" ")[0];
    setZones((prev) =>
      prev.map((zone) => ({
        ...zone,
        orders: zone.orders.map((order) =>
          selectedOrderIds.has(order.id)
            ? { ...order, assignedDriverName: firstName }
            : order,
        ),
      })),
    );
    setSelectedOrderIds(new Set());
    setSelectedDriverId("");
  };

  const handleCancelDispatch = () => {
    setSelectedOrderIds(new Set());
    setSelectedDriverId("");
  };

  // -------------------------------------------------------------------------
  // Driver CRUD — delegate to hook actions
  // -------------------------------------------------------------------------
  const handleOpenAddDriver = () => {
    setEditingDriver(undefined);
    setIsAddDriverOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setIsAddDriverOpen(true);
  };

  const handleSaveDriver = (data: DriverFormData, id?: number) => {
    if (id !== undefined) {
      const backendId = idMap.current.get(id);
      if (backendId) {
        updateDriver(backendId, {
          name: data.name.trim(),
          whatsappPhone: data.whatsappPhone.trim(),
          vehicleType: reverseMapVehicle(data.vehicleType),
          zones: data.zones,
          status: reverseMapStatus(data.status),
        });
      }
    } else {
      createDriver({
        name: data.name.trim(),
        whatsappPhone: data.whatsappPhone.trim(),
        vehicleType: reverseMapVehicle(data.vehicleType),
        zones: data.zones,
        status: reverseMapStatus(data.status),
      });
    }
  };

  const handleChangeStatus = (driver: Driver, status: DriverStatus) => {
    const backendId = idMap.current.get(driver.id);
    if (backendId) {
      updateDriver(backendId, { status: reverseMapStatus(status) });
    }
    // Optimistic local update
    setDrivers((prev) =>
      prev.map((d) => (d.id === driver.id ? { ...d, status } : d)),
    );
  };

  const handleHourlyRateChange = (id: number, rate: number) =>
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, hourlyRate: rate } : d)),
    );

  const handleRemoveDriver = (driver: Driver) => {
    setIsAddDriverOpen(false);
    setEditingDriver(undefined);
    setDeletingDriver(driver);
  };

  const handleConfirmDelete = () => {
    if (!deletingDriver) return;
    const backendId = idMap.current.get(deletingDriver.id);
    if (backendId) {
      deleteDriver(backendId);
    }
    setDeletingDriver(null);
  };

  return (
    <>
      {isMenuOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Fleet Management")}
          description={t("Logistics & Dispatch")}
        />
        <DefaultButton
          data={{
            buttonText: t("Add Driver"),
            icon: <Plus className="size-4.5" />,
            onClick: handleOpenAddDriver,
          }}
        />
      </div>

      <LogisticsOverview
        activeZones={overview.activeZones}
        officialDrivers={overview.officialDrivers}
        pendingOrders={overview.pendingOrders}
      />

      <div className="mb-5">
        <SearchInputField
          value={search}
          onChange={setSearch}
          placeholder={t("Search by order number, driver, or zone...")}
        />
      </div>

      {/* Zones + dispatch */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        {filteredZones.length === 0 ? (
          <div className="rounded-[16px] border border-[#E5E5E5] bg-white px-6 py-10 text-center text-[14px] text-[#8B8B8B]">
            {t("No zones match your search.")}
          </div>
        ) : (
          <ZoneAccordion
            zones={filteredZones}
            selectedIds={selectedOrderIds}
            onToggleOrder={toggleOrder}
            onToggleZone={toggleZone}
          />
        )}
        <DispatchPanel
          selectedReferences={selectedReferences}
          drivers={drivers}
          selectedDriverId={selectedDriverId}
          onSelectDriver={setSelectedDriverId}
          onDriverMenuOpenChange={setIsMenuOpen}
          onSend={handleSend}
          onCancel={handleCancelDispatch}
        />
      </div>

      {/* Driver duty cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {drivers.map((driver) => (
          <DriverDutyCard
            key={driver.id}
            driver={driver}
            onHourlyRateChange={handleHourlyRateChange}
          />
        ))}
      </div>

      <DriversTable
        drivers={drivers}
        onEdit={handleEditDriver}
        onNotify={setNotifyingDriver}
        onChangeStatus={handleChangeStatus}
        onMenuOpenChange={setIsMenuOpen}
      />

      <AddDriverDialog
        open={isAddDriverOpen}
        driver={editingDriver}
        onOpenChange={setIsAddDriverOpen}
        onSave={handleSaveDriver}
        onRemove={handleRemoveDriver}
      />

      <SendNotificationDialog
        driver={notifyingDriver}
        onOpenChange={(open) => !open && setNotifyingDriver(null)}
        onSend={() => setNotifyingDriver(null)}
      />

      <DeleteDialog
        open={!!deletingDriver}
        onOpenChange={(open) => !open && setDeletingDriver(null)}
        data={{
          item: deletingDriver?.name ?? "",
          type: "driver",
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default LogisticsPage;
