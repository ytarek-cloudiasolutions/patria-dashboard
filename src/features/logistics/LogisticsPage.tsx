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
import { normalizeWhatsAppPhone } from "./utils";
import SendNotificationDialog from "./components/SendNotificationDialog";

import type { Driver, DriverFormData, DriverStatus, Zone, ZoneOrder, ZoneOrderStatus } from "./types";
import { useLogistics } from "./hooks/useLogistics";
import { useLocations } from "@/features/locations/hooks/useLocations";
import type { DeliveryZone, ZonePoint } from "@/features/locations/types";
import { dispatchOrder } from "./api/logisticsApi";
import { getSocket } from "@/shared/lib/socket";

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

const isPointInPolygon = (lat: number, lng: number, polygon: ZonePoint[]): boolean => {
  if (!Array.isArray(polygon) || polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;
    const intersect =
      yi > lng !== yj > lng &&
      lat < ((xj - xi) * (lng - yi)) / (yj - yi || Number.EPSILON) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const resolveOrderZoneName = (
  o: any,
  locations: DeliveryZone[],
  knownZoneNames: string[],
): string => {
  const locationById = new Map<string, string>();
  const locationByName = new Map<string, string>();

  locations.forEach((loc) => {
    const id = String(loc._id || loc.id || "").trim();
    const name = (loc.name || "").trim();
    if (!name) return;
    if (id) locationById.set(id, name);
    locationByName.set(name.toLowerCase(), name);
    if (loc.nameAr?.trim()) {
      locationByName.set(loc.nameAr.trim().toLowerCase(), name);
    }
  });

  knownZoneNames.forEach((zName) => {
    const trimmed = zName.trim();
    if (trimmed && !locationByName.has(trimmed.toLowerCase())) {
      locationByName.set(trimmed.toLowerCase(), trimmed);
    }
  });

  const extractValues = (val: any): string[] => {
    if (!val) return [];
    if (typeof val === "string") return [val.trim()];
    if (typeof val === "object") {
      return [val.name, val.nameAr, val._id, val.id, val.zone, val.area]
        .filter((v): v is string => typeof v === "string" && Boolean(v.trim()))
        .map((v) => v.trim());
    }
    return [];
  };

  const candidates = [
    ...extractValues(o.zone),
    ...extractValues(o.region),
    ...extractValues(o.customer?.zone),
    ...extractValues(o.customer?.region),
    ...extractValues(o.customerId?.zone),
    ...extractValues(o.customerId?.region),
  ];

  const addresses = [
    ...(Array.isArray(o.customer?.addresses) ? o.customer.addresses : []),
    ...(Array.isArray(o.customerId?.addresses) ? o.customerId.addresses : []),
  ];
  addresses.forEach((addr: any) => {
    if (!addr) return;
    candidates.push(
      ...extractValues(addr.zone),
      ...extractValues(addr.area),
      ...extractValues(addr.region),
      ...extractValues(addr.zoneId),
      ...extractValues(addr.locationId),
    );
  });

  for (const raw of candidates) {
    if (!raw) continue;
    if (locationById.has(raw)) return locationById.get(raw)!;
    const byName = locationByName.get(raw.toLowerCase());
    if (byName) return byName;
    if (!OBJECT_ID_REGEX.test(raw)) return raw;
  }

  // Check if customer address text mentions a known zone name
  const addressText = String(o.customer?.address || o.address || "").toLowerCase();
  if (addressText) {
    for (const [lowerName, canonicalName] of locationByName.entries()) {
      if (lowerName && addressText.includes(lowerName)) {
        return canonicalName;
      }
    }
  }

  // Check customer coordinates against location polygons or centers
  const coords = o.customerLocation || o.customer?.location;
  const lat = Number(coords?.lat);
  const lng = Number(coords?.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
    for (const loc of locations) {
      if (loc.polygon && loc.polygon.length >= 3 && isPointInPolygon(lat, lng, loc.polygon)) {
        return loc.name;
      }
    }

    let closestLoc: DeliveryZone | null = null;
    let minDistanceSq = Infinity;
    for (const loc of locations) {
      if (typeof loc.centerLat === "number" && typeof loc.centerLng === "number") {
        const dLat = lat - loc.centerLat;
        const dLng = lng - loc.centerLng;
        const distSq = dLat * dLat + dLng * dLng;
        if (distSq < minDistanceSq) {
          minDistanceSq = distSq;
          closestLoc = loc;
        }
      }
    }
    if (closestLoc?.name) return closestLoc.name;
  }

  // Match by deliveryFee if unique/present in locations
  const fee = Number(o.deliveryFee);
  if (Number.isFinite(fee) && fee > 0) {
    const matchedByFee = locations.find((loc) => Number(loc.deliveryFee) === fee);
    if (matchedByFee?.name) return matchedByFee.name;
  }

  return "";
};

const mapApiDriver = (d: any): Driver => {
  const hourlyRate = d.hourlyRate ?? 0;
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
    whatsappPhone: d.whatsappPhone || d.phone || "",
    vehicleType: d.vehicleType === "car" ? "Car" : d.vehicleType === "van" ? "Van" : "Motorcycle",
    plateNumber: d.plateNumber || "",
    zones: d.zones || [],
    status:
      d.status === "busy"
        ? "On-Route"
        : d.status === "active" || d.isOnShift
          ? "Active"
          : "Off-Duty",
    ordersToday:
      d.totalDelivered ??
      d.shiftDeliveriesCount ??
      (d.activeOrders ? d.activeOrders.length : 0),
    salaryNow,
    hourlyRate,
    dutyTime: d.dutyTime && d.dutyTime !== "—" ? d.dutyTime : "00:00:00",
    shiftStartedAt: d.shiftStartedAt || null,
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
  const { locations, getLocations } = useLocations();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [apiOrders, setApiOrders] = useState<any[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);

  const [logisticsLoaded, setLogisticsLoaded] = useState(false);
  const logisticsStarted = useRef(loading.fetch);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/orders", { params: { limit: 100 } });
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
    getLocations();
    // Drivers were only ever fetched once on mount, with no polling — a
    // driver who started/ended their shift, or whose duty time simply kept
    // ticking, after this page loaded stayed frozen at whatever the
    // snapshot showed until something else (e.g. an unrelated edit)
    // happened to trigger a refetch. Poll periodically so status/duty time
    // actually reflect what's happening on the rider app in real time.
    const interval = setInterval(() => {
      getDrivers();
      fetchOrders();
    }, 20000);
    return () => clearInterval(interval);
  }, [getDrivers, fetchOrders, getLocations]);

  // Real-time socket event listeners for instant updates on orders and driver statuses
  useEffect(() => {
    const socket = getSocket();

    let ordersTimer: ReturnType<typeof setTimeout> | null = null;
    let driversTimer: ReturnType<typeof setTimeout> | null = null;

    const debouncedFetchOrders = () => {
      if (ordersTimer) clearTimeout(ordersTimer);
      ordersTimer = setTimeout(() => {
        fetchOrders();
      }, 300);
    };

    const debouncedGetDrivers = () => {
      if (driversTimer) clearTimeout(driversTimer);
      driversTimer = setTimeout(() => {
        getDrivers();
      }, 300);
    };

    const handleFullRefresh = () => {
      debouncedFetchOrders();
      debouncedGetDrivers();
    };

    socket.on("connect", handleFullRefresh);
    socket.on("newOrder", handleFullRefresh);
    socket.on("orderUpdated", handleFullRefresh);
    socket.on("orderDiscountUpdated", debouncedFetchOrders);
    socket.on("driverUpdated", debouncedGetDrivers);
    socket.on("driverStatusUpdated", debouncedGetDrivers);
    socket.on("driverStatusChanged", debouncedGetDrivers);
    socket.on("shiftStarted", debouncedGetDrivers);
    socket.on("shiftEnded", debouncedGetDrivers);

    return () => {
      if (ordersTimer) clearTimeout(ordersTimer);
      if (driversTimer) clearTimeout(driversTimer);
      socket.off("connect", handleFullRefresh);
      socket.off("newOrder", handleFullRefresh);
      socket.off("orderUpdated", handleFullRefresh);
      socket.off("orderDiscountUpdated", debouncedFetchOrders);
      socket.off("driverUpdated", debouncedGetDrivers);
      socket.off("driverStatusUpdated", debouncedGetDrivers);
      socket.off("driverStatusChanged", debouncedGetDrivers);
      socket.off("shiftStarted", debouncedGetDrivers);
      socket.off("shiftEnded", debouncedGetDrivers);
    };
  }, [fetchOrders, getDrivers]);

  useEffect(() => {
    if (apiDrivers) {
      setDrivers(apiDrivers.map(mapApiDriver));
    }
  }, [apiDrivers]);

  const zones: Zone[] = useMemo(() => {
    const zoneMap = new Map<string, ZoneOrder[]>();
    const processedOrderIds = new Set<string>();

    const driverById = new Map<string, string>();
    const orderAssignedDriverMap = new Map<string, string>();
    const knownZoneNames: string[] = [];

    (apiDrivers || []).forEach((d: any) => {
      const dId = String(d._id || d.id || "");
      const dName = d.name || "";
      if (dId && dName) driverById.set(dId, dName);
      if (Array.isArray(d.zones)) {
        d.zones.forEach((z: string) => {
          if (z) knownZoneNames.push(z);
        });
      }
      const currentId =
        typeof d.currentOrderId === "object"
          ? String(d.currentOrderId?._id || d.currentOrderId?.id || "")
          : String(d.currentOrderId || "");
      if (currentId && dName) {
        orderAssignedDriverMap.set(currentId, dName);
      }
      if (Array.isArray(d.activeOrders)) {
        d.activeOrders.forEach((ao: any) => {
          const aoId = typeof ao === "object" ? String(ao?._id || ao?.id || "") : String(ao || "");
          if (aoId && dName) {
            orderAssignedDriverMap.set(aoId, dName);
          }
        });
      }
    });

    if (Array.isArray(driversByZone)) {
      driversByZone.forEach((dz: any) => {
        if (dz?.zone) knownZoneNames.push(dz.zone);
      });
    }

    const resolveDriverName = (o: any, orderId: string): string | undefined => {
      const rawAssigned = o.assignedDriver ?? o.driver;
      if (rawAssigned) {
        if (typeof rawAssigned === "object") {
          const name = rawAssigned.name;
          if (name) return name;
          const id = String(rawAssigned._id || rawAssigned.id || "");
          if (id && driverById.has(id)) return driverById.get(id);
        } else if (typeof rawAssigned === "string") {
          const trimmed = rawAssigned.trim();
          if (driverById.has(trimmed)) return driverById.get(trimmed);
          if (!OBJECT_ID_REGEX.test(trimmed)) return trimmed;
        }
      }
      return orderAssignedDriverMap.get(orderId);
    };

    // Collect all candidate orders from apiOrders and any full order objects in driver.activeOrders
    const allRawOrders: any[] = [...apiOrders];
    (apiDrivers || []).forEach((d: any) => {
      if (Array.isArray(d.activeOrders)) {
        d.activeOrders.forEach((ao: any) => {
          if (ao && typeof ao === "object" && (ao._id || ao.id)) {
            allRawOrders.push(ao);
          }
        });
      }
    });

    allRawOrders.forEach((o: any) => {
      const orderId = String(o._id || o.id || "");
      if (!orderId || processedOrderIds.has(orderId)) return;

      const orderType = String(o.type || "").toLowerCase().trim();
      if (orderType && orderType !== "delivery") return;

      const rawStatus = (o.status || "").toLowerCase().trim();
      const rawDeliveryStatus = (o.deliveryStatus || "").toLowerCase().trim();
      if (
        rawStatus === "completed" ||
        rawStatus === "delivered" ||
        rawStatus === "cancelled" ||
        rawDeliveryStatus === "delivered"
      ) {
        return;
      }

      const zoneName = resolveOrderZoneName(o, locations, knownZoneNames);
      if (!zoneName) return;

      processedOrderIds.add(orderId);

      if (!zoneMap.has(zoneName)) {
        zoneMap.set(zoneName, []);
      }

      const rawRef = String(o.orderId || o.orderNumber || "").trim();
      const ref = rawRef
        ? rawRef.startsWith("#")
          ? rawRef
          : `#${rawRef}`
        : `#ORD-${orderId.slice(-6).toUpperCase()}`;
      const customer =
        typeof o.customer === "string"
          ? o.customer
          : o.customerId?.name || o.customer?.name || o.customerName || "Walk-in Customer";
      const address = o.customer?.address || o.address || "No address provided";
      const amount = o.totalAmount ?? o.total ?? o.amount ?? 0;

      const assignedDriverName = resolveDriverName(o, orderId);

      let statusStr: ZoneOrderStatus = "Waiting";
      if (rawStatus === "cancelled") {
        statusStr = "Cancelled";
      } else if (
        assignedDriverName ||
        rawDeliveryStatus === "picking up" ||
        rawDeliveryStatus === "on-route" ||
        rawDeliveryStatus === "on_the_way" ||
        rawStatus === "on-route" ||
        rawStatus === "on_the_way" ||
        rawStatus === "on-the-way" ||
        rawStatus === "on_route"
      ) {
        statusStr = "On-Route";
      } else if (rawStatus === "ready") {
        statusStr = "Ready";
      } else if (
        rawStatus === "processing" ||
        rawStatus === "preparing" ||
        rawStatus === "confirmed"
      ) {
        statusStr = "Processing";
      } else {
        statusStr = "Waiting";
      }

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

    return Array.from(zoneMap.entries())
      .filter(([, zoneOrders]) => zoneOrders.length > 0)
      .map(([name, zoneOrders]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        orders: zoneOrders,
      }));
  }, [apiDrivers, driversByZone, apiOrders, locations]);

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
    if (selectedDriverId) {
      const selectedDriver = drivers.find((d) => String(d.id) === String(selectedDriverId));
      if (!selectedDriver || (selectedDriver.status !== "Active" && selectedDriver.status !== "On-Route")) {
        setSelectedDriverId("");
      }
    }
  }, [selectedDriverId, drivers]);

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
      const orderZoneMap = new Map<string, string>();
      zones.forEach((zone) => {
        zone.orders.forEach((order) => {
          orderZoneMap.set(order.id, zone.name);
        });
      });
      const orderIds = Array.from(selectedOrderIds);
      const results = await Promise.all(
        orderIds.map((orderId) =>
          dispatchOrder(selectedDriverId, orderId, orderZoneMap.get(orderId)),
        ),
      );
      const updatedOrdersById = new Map<string, any>();
      results.forEach((res) => {
        const updatedOrder = res?.order;
        const uId = String(updatedOrder?._id || updatedOrder?.id || "");
        if (uId) updatedOrdersById.set(uId, updatedOrder);
      });
      if (updatedOrdersById.size > 0) {
        setApiOrders((prev) =>
          prev.map((o) => {
            const oId = String(o._id || o.id || "");
            return updatedOrdersById.get(oId) ?? o;
          }),
        );
      }
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
    const normalizedPhone = normalizeWhatsAppPhone(data.whatsappPhone);
    const payload: any = {
      name: data.name.trim(),
      phone: normalizedPhone,
      whatsappPhone: normalizedPhone,
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
      <div className="flex min-h-[60vh] w-full items-center justify-center animate-in fade-in-50 duration-300">
        <BarChart2 className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="animate-in fade-in-50 duration-300">
      {isMenuOpen && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-black/40 transition-opacity animate-in fade-in-0 duration-200" />
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Fleet Management")}
          description={t("Logistics & Dispatch")}
        />
        <DefaultButton
          data={{
            buttonText: t("Add Driver"),
            icon: <Plus className="size-4.5 transition-transform duration-200 group-hover:rotate-90" />,
            onClick: handleOpenAddDriver,
            className: "transition-all duration-150 active:scale-[0.98]",
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
          availableZoneNames={zones.map((z) => z.name)}
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
    </section>
  );
};

export default LogisticsPage;
