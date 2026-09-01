import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, BarChart2 } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import SearchInputField from "@/shared/components/SearchInputField";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { api } from "@/config/api";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";

import LogisticsOverview from "./components/LogisticsOverview";
import ZoneAccordion from "./components/ZoneAccordion";
import DispatchPanel from "./components/DispatchPanel";
import DriverDutyCard from "./components/DriverDutyCard";
import DriversTable from "./components/DriverStable";
import AddDriverDialog from "./components/AddDriverDialog";
import SendNotificationDialog from "./components/SendNotificationDialog";

import type { Driver, DriverFormData, DriverStatus, Zone, ZoneOrder, ZoneOrderStatus } from "./types";
import { useLogistics } from "./hooks/useLogistics";
import { dispatchOrder } from "./api/logisticsApi";

const mapApiDriver = (d: any): Driver => {
  const hourlyRate = d.hourlyRate || 0;
  // Backend now computes salaryNow itself (real elapsed hours since
  // shiftStartedAt × hourlyRate) so every consumer agrees on one number —
  // fall back to the same formula client-side only for older API
  // responses that predate that field.
  const shiftStartedAt = d.shiftStartedAt ? new Date(d.shiftStartedAt).getTime() : null;
  const hoursElapsed = shiftStartedAt ? Math.max(0, (Date.now() - shiftStartedAt) / 3600000) : 0;
  const salaryNow = d.salaryNow ?? Number((hourlyRate * hoursElapsed).toFixed(2));

  return {
    id: d._id || d.id,
    name: d.name || "",
    whatsappPhone: d.phone || d.whatsappPhone || "",
    vehicleType: d.vehicleType === "car" ? "Car" : d.vehicleType === "van" ? "Van" : "Motorcycle",
    plateNumber: d.plateNumber || "",
    zones: d.zones || [],
    status: d.status === "busy" ? "On-Route" : d.status === "active" ? "Active" : "Off-Duty",
    ordersToday: d.shiftDeliveriesCount || d.totalDelivered || (d.activeOrders ? d.activeOrders.length : 0),
    salaryNow,
    hourlyRate,
    dutyTime: d.dutyTime && d.dutyTime !== "—" ? d.dutyTime : "00:00:00",
  };
};

const LogisticsPage = () => {
  const { t } = useTranslation();
  const {
    drivers: apiDrivers,
    driversByZone,
    stats,
    getDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    loading,
  } = useLogistics();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [apiOrders, setApiOrders] = useState<any[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);

  const [logisticsLoaded, setLogisticsLoaded] = useState(false);
  const logisticsStarted = useRef(loading.fetch);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/orders", { params: { limit: 100, type: "Delivery" } });
      setApiOrders(res.data?.data || res.data?.orders || []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (loading.fetch) {
      logisticsStarted.current = true;
    } else if (logisticsStarted.current) {
      setLogisticsLoaded(true);
    }
  }, [loading.fetch]);

  useEffect(() => {
    getDrivers();
    fetchOrders();
  }, [getDrivers, fetchOrders]);

  useEffect(() => {
    if (apiDrivers) {
      setDrivers(apiDrivers.map(mapApiDriver));
    }
  }, [apiDrivers]);

  const zones: Zone[] = useMemo(() => {
    const zoneMap = new Map<string, ZoneOrder[]>();
    const processedOrderIds = new Set<string>();

    // 1. First process assigned driver active orders from driversByZone
    if (driversByZone && Array.isArray(driversByZone)) {
      driversByZone.forEach((dz: any) => {
        const zoneName = dz.zone || "Kafr Abdo";
        if (!zoneMap.has(zoneName)) {
          zoneMap.set(zoneName, []);
        }

        if (Array.isArray(dz.drivers)) {
          dz.drivers.forEach((driver: any) => {
            const activeList = driver.activeOrders || (driver.currentOrderId ? [driver.currentOrderId] : []);
            if (Array.isArray(activeList)) {
              activeList.forEach((o: any) => {
                const orderId = String(o._id || o.id || "");
                if (!orderId || processedOrderIds.has(orderId)) return;

                const rawStatus = (o.status || "").toLowerCase().trim();
                if (rawStatus === "completed" || rawStatus === "delivered" || rawStatus === "cancelled") return;

                processedOrderIds.add(orderId);
                const ref = o.orderNumber || o.orderId
                  ? `#${o.orderNumber || o.orderId}`
                  : `#ORD-${orderId.slice(-6).toUpperCase()}`;
                const customer =
                  typeof o.customer === "string"
                    ? o.customer
                    : o.customer?.name || o.customerId?.name || "Customer";
                const address = o.address || o.customer?.address || "No address provided";
                const amount = o.amount || o.total || o.totalAmount || 0;

                zoneMap.get(zoneName)!.push({
                  id: orderId,
                  reference: ref,
                  customer,
                  address,
                  amount,
                  status: "On-Route",
                  assignedDriverName: driver.name,
                });
              });
            }
          });
        }
      });
    }

    // 2. Process unassigned / pending API orders
    apiOrders.forEach((o: any) => {
      const orderId = String(o._id || o.id || "");
      if (processedOrderIds.has(orderId)) return;

      const orderType = String(o.type || "").toLowerCase().trim();
      if (orderType && orderType !== "delivery") return;

      const rawStatus = (o.status || "").toLowerCase().trim();
      if (rawStatus === "completed" || rawStatus === "delivered" || rawStatus === "cancelled") return;

      processedOrderIds.add(orderId);

      const zoneName = o.zone || "Kafr Abdo";
      if (!zoneMap.has(zoneName)) {
        zoneMap.set(zoneName, []);
      }

      const ref = o.orderId || o.orderNumber
        ? `#${o.orderId || o.orderNumber}`
        : `#ORD-${orderId.slice(-6).toUpperCase()}`;
      const customer =
        o.customerId?.name || o.customer?.name || o.customerName || "Walk-in Customer";
      const address = o.customer?.address || o.address || "No address provided";
      const amount = o.totalAmount || o.total || 0;

      let statusStr: ZoneOrderStatus = "Waiting";
      if (rawStatus === "cancelled") {
        statusStr = "Cancelled";
      } else if (rawStatus === "processing" || rawStatus === "preparing") {
        statusStr = "Processing";
      } else if (
        rawStatus === "on-route" ||
        rawStatus === "on_the_way" ||
        rawStatus === "on-the-way" ||
        rawStatus === "on_route"
      ) {
        statusStr = "On-Route";
      } else if (rawStatus === "ready") {
        statusStr = "Ready";
      } else {
        statusStr = "Waiting";
      }

      const assignedDriverName = o.driver
        ? typeof o.driver === "string"
          ? o.driver
          : o.driver.name
        : undefined;

      zoneMap.get(zoneName)!.push({
        id: orderId,
        reference: ref,
        customer,
        address,
        amount,
        status: statusStr,
        assignedDriverName,
      });
    });

    return Array.from(zoneMap.entries()).map(([name, zoneOrders]) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      orders: zoneOrders,
    }));
  }, [driversByZone, apiOrders]);

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
    const pendingOrders =
      stats?.waitingOrders ??
      zones.reduce(
        (sum, zone) =>
          sum + zone.orders.filter((o) => !o.assignedDriverName).length,
        0,
      );
    return {
      activeZones: zones.length,
      officialDrivers: drivers.length,
      pendingOrders,
    };
  }, [zones, drivers, stats]);

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

  const selectedZoneNames = useMemo(() => {
    if (selectedOrderIds.size === 0) return [];
    const zoneNames = new Set<string>();
    zones.forEach((zone) => {
      zone.orders.forEach((order) => {
        if (selectedOrderIds.has(order.id)) {
          zoneNames.add(zone.name);
        }
      });
    });
    return Array.from(zoneNames);
  }, [zones, selectedOrderIds]);

  useEffect(() => {
    if (selectedDriverId && selectedZoneNames.length > 0) {
      const selectedDriver = drivers.find((d) => String(d.id) === String(selectedDriverId));
      if (selectedDriver && selectedDriver.zones) {
        const driverZonesLower = selectedDriver.zones.map((z) => z.toLowerCase().trim());
        const isCompatible = selectedZoneNames.some((sz) =>
          driverZonesLower.includes(sz.toLowerCase().trim())
        );
        if (!isCompatible) {
          setSelectedDriverId("");
        }
      }
    }
  }, [selectedZoneNames, selectedDriverId, drivers]);

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

  const handleSend = async () => {
    if (!selectedDriverId || selectedOrderIds.size === 0) return;
    setIsDispatching(true);
    try {
      const orderIds = Array.from(selectedOrderIds);
      await Promise.all(
        orderIds.map((orderId) => dispatchOrder(selectedDriverId, orderId)),
      );
      showSuccessToast(t("Order(s) dispatched successfully"));
      setSelectedOrderIds(new Set());
      setSelectedDriverId("");
      getDrivers();
      fetchOrders();
    } catch {
      showErrorToast(t("Failed to dispatch order(s)"));
    } finally {
      setIsDispatching(false);
    }
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

  const handleSaveDriver = (data: DriverFormData, id?: number | string) => {
    const payload: any = {
      name: data.name.trim(),
      phone: data.whatsappPhone.trim(),
      whatsappPhone: data.whatsappPhone.trim(),
      vehicleType: data.vehicleType.toLowerCase() as any,
      plateNumber: data.plateNumber.trim(),
      hourlyRate: Number(data.hourlyRate) || 0,
      zones: data.zones,
      status:
        data.status === "On-Route"
          ? "busy"
          : data.status === "Active"
          ? "active"
          : "offline",
    };
    if (data.password && data.password.trim()) {
      payload.password = data.password.trim();
    }
    if (id !== undefined) {
      updateDriver(String(id), payload as any);
    } else {
      createDriver(payload as any);
    }
  };

  const handleChangeStatus = (driver: Driver, status: DriverStatus) => {
    const apiStatus =
      status === "On-Route" ? "busy" : status === "Active" ? "active" : "offline";
    updateDriver(String(driver.id), { status: apiStatus });
  };

  const handleHourlyRateChange = (id: number | string, rate: number) => {
    // Previously local-state only — the checkmark button looked like it
    // saved, but the rate was never persisted, so it silently reverted to
    // whatever the backend had on the next drivers refetch.
    setDrivers((prev) =>
      prev.map((d) => (d.id === id ? { ...d, hourlyRate: rate } : d)),
    );
    updateDriver(String(id), { hourlyRate: rate });
  };

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
          selectedZoneNames={selectedZoneNames}
          drivers={drivers}
          selectedDriverId={selectedDriverId}
          onSelectDriver={setSelectedDriverId}
          onDriverMenuOpenChange={setIsMenuOpen}
          onSend={handleSend}
          onCancel={handleCancelDispatch}
          isDispatching={isDispatching}
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
