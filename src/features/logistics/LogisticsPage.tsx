import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import SearchInputField from "@/shared/components/SearchInputField";
import DeleteDialog from "@/shared/components/DeleteDialog";

import LogisticsOverview from "./components/LogisticsOverview";
import ZoneCard from "./components/ZoneCard";
import DriversTable from "./components/DriversTable";
import AddDriverDialog from "./components/AddDriverDialog";
import DispatchDialog from "./components/DispatchDialog";

import { INITIAL_DRIVERS, INITIAL_ZONES } from "./data";
import type { Driver, DriverFormData, Zone } from "./types";

const LogisticsPage = () => {
  const { t } = useTranslation();
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [search, setSearch] = useState("");

  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>();
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);

  const [dispatchZone, setDispatchZone] = useState<Zone | null>(null);

  const overview = useMemo(() => {
    const pendingOrders = zones.reduce(
      (sum, zone) =>
        sum + zone.orders.filter((o) => o.status === "Pending").length,
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
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                name: data.name.trim(),
                whatsappPhone: data.whatsappPhone.trim(),
                vehicleType: data.vehicleType,
                status: data.status,
              }
            : d,
        ),
      );
    } else {
      const newDriver: Driver = {
        id: Date.now(),
        name: data.name.trim(),
        whatsappPhone: data.whatsappPhone.trim(),
        vehicleType: data.vehicleType,
        status: data.status,
        zones: [],
      };
      setDrivers((prev) => [...prev, newDriver]);
    }
  };

  const handleToggleStatus = (driver: Driver, enabled: boolean) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driver.id
          ? { ...d, status: enabled ? "Active" : "Inactive" }
          : d,
      ),
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingDriver) return;
    setDrivers((prev) => prev.filter((d) => d.id !== deletingDriver.id));
    setDeletingDriver(null);
  };

  const handleDispatch = (zoneId: string, driverId: number) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;

    setZones((prev) =>
      prev.map((zone) =>
        zone.id === zoneId
          ? {
              ...zone,
              orders: zone.orders.map((order) =>
                order.status === "Pending"
                  ? {
                      ...order,
                      status: "Assigned",
                      assignedDriverId: driver.id,
                      assignedDriverName: driver.name.split(" ")[0],
                    }
                  : order,
              ),
            }
          : zone,
      ),
    );

    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId && !d.zones.includes(zoneId)
          ? {
              ...d,
              zones: Array.from(
                new Set([
                  ...d.zones,
                  zones.find((z) => z.id === zoneId)?.name ?? "",
                ]),
              ).filter(Boolean),
            }
          : d,
      ),
    );
  };

  return (
    <>
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

      {filteredZones.length === 0 ? (
        <div className="mb-6 rounded-[16px] border border-[#E5E5E5] bg-white px-6 py-10 text-center text-[14px] text-[#8B8B8B]">
          {t("No zones match your search.")}
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredZones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              onDispatch={setDispatchZone}
            />
          ))}
        </div>
      )}

      <DriversTable
        drivers={drivers}
        onEdit={handleEditDriver}
        onDelete={setDeletingDriver}
        onToggleStatus={handleToggleStatus}
      />

      <AddDriverDialog
        open={isAddDriverOpen}
        driver={editingDriver}
        onOpenChange={setIsAddDriverOpen}
        onSave={handleSaveDriver}
      />

      <DispatchDialog
        open={!!dispatchZone}
        zone={dispatchZone}
        drivers={drivers}
        onOpenChange={(open) => !open && setDispatchZone(null)}
        onConfirm={handleDispatch}
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
