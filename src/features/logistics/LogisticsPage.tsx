import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, BarChart2 } from "lucide-react";
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

import { INITIAL_ZONES } from "./data";
import type { Driver, DriverFormData, DriverStatus, Zone } from "./types";
import { useLogistics } from "./hooks/useLogistics";

const mapApiDriver = (d: any): Driver => ({
  id: d._id as any,
  name: d.name || "",
  whatsappPhone: d.phone || d.whatsappPhone || "",
  vehicleType: d.vehicleType === "car" ? "Car" : d.vehicleType === "van" ? "Van" : "Motorcycle",
  plateNumber: d.plateNumber || "",
  zones: d.zones || [],
  status: d.status === "busy" ? "On-Route" : d.status === "active" ? "Active" : "Off-Duty",
  ordersToday: d.shiftDeliveriesCount || d.totalDelivered || 0,
  salaryNow: 0,
  hourlyRate: 21,
  dutyTime: d.dutyTime || "00:00:00",
});

const LogisticsPage = () => {
  const { t } = useTranslation();
  const { drivers: apiDrivers, getDrivers, createDriver, updateDriver, deleteDriver, loading } = useLogistics();
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [logisticsLoaded, setLogisticsLoaded] = useState(false);
  const logisticsStarted = useRef(loading.fetch);

  useEffect(() => {
    if (loading.fetch) {
      logisticsStarted.current = true;
    } else if (logisticsStarted.current) {
      setLogisticsLoaded(true);
    }
  }, [loading.fetch]);

  useEffect(() => { getDrivers(); }, [getDrivers]);
  useEffect(() => {
    if (apiDrivers && apiDrivers.length > 0) setDrivers(apiDrivers.map(mapApiDriver));
  }, [apiDrivers]);
  const [search, setSearch] = useState("");

  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>();
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);
  const [notifyingDriver, setNotifyingDriver] = useState<Driver | null>(null);

  const overview = useMemo(() => {
    const pendingOrders = zones.reduce(
      (sum, zone) =>
        sum + zone.orders.filter((o) => !o.assignedDriverName).length,
      0,
    );
    return {
      activeZones: zones.length,
      officialDrivers: drivers.length,
      pendingOrders,
    };
  }, [zones, drivers]);

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

  // --- Dispatch -------------------------------------------------------------

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

  // --- Drivers --------------------------------------------------------------

  const handleOpenAddDriver = () => {
    setEditingDriver(undefined);
    setIsAddDriverOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setIsAddDriverOpen(true);
  };

  const handleSaveDriver = (data: DriverFormData, id?: number) => {
    const payload = {
      name: data.name.trim(),
      phone: data.whatsappPhone.trim(),
      whatsappPhone: data.whatsappPhone.trim(),
      vehicleType: data.vehicleType.toLowerCase() as any,
      plateNumber: data.plateNumber.trim(),
      zones: data.zones,
      status: data.status === "On-Route" ? "busy" : data.status === "Active" ? "active" : "offline",
    };
    if (id !== undefined) {
      updateDriver(String(id), payload as any);
    } else {
      createDriver(payload as any);
    }
  };

  const handleChangeStatus = (driver: Driver, status: DriverStatus) =>
    setDrivers((prev) =>
      prev.map((d) => (d.id === driver.id ? { ...d, status } : d)),
    );

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
    deleteDriver(String(deletingDriver.id));
    setDeletingDriver(null);
  };

  const isLoading = !logisticsLoaded;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <BarChart2 className="size-16 animate-spin text-primary" />
      </div>
    );
  }

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
