import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Navigation } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { api } from "@/config/api";
import { getSocket } from "@/shared/lib/socket";

import TrackingOverview from "./components/TrackingOverview";
import RiderListPanel from "./components/RiderListPanel";
import RiderDetailPanel from "./components/RiderDetailPanel";
import GoogleMap from "./components/GoogleMap";

import type { Rider } from "./types";

const parseLocation = (d: any): { lat: number; lng: number } | undefined => {
  const loc = d.location ?? d.currentLocation ?? d.coords ?? d.lastLocation;
  if (loc) {
    if (typeof loc.lat === "number" && typeof loc.lng === "number") {
      return { lat: loc.lat, lng: loc.lng };
    }
    if (typeof loc.latitude === "number" && typeof loc.longitude === "number") {
      return { lat: loc.latitude, lng: loc.longitude };
    }
    if (loc.lat != null && loc.lng != null && !isNaN(Number(loc.lat)) && !isNaN(Number(loc.lng))) {
      return { lat: Number(loc.lat), lng: Number(loc.lng) };
    }
    if (Array.isArray(loc.coordinates) && loc.coordinates.length >= 2) {
      const p0 = Number(loc.coordinates[0]);
      const p1 = Number(loc.coordinates[1]);
      if (!isNaN(p0) && !isNaN(p1)) {
        if (p0 >= 30 && p0 <= 32 && p1 >= 29 && p1 <= 31) {
          return { lat: p0, lng: p1 };
        }
        return { lat: p1, lng: p0 };
      }
    }
  }
  if (d.lat != null && d.lng != null && !isNaN(Number(d.lat)) && !isNaN(Number(d.lng))) {
    return { lat: Number(d.lat), lng: Number(d.lng) };
  }
  return undefined;
};

const mapRider = (d: any, idx: number): Rider => ({
  id: d._id ?? idx,
  name: d.name ?? "—",
  phone: d.phone ?? d.whatsappPhone ?? "—",
  vehicleType:
    d.vehicleType === "car" ? "Car"
    : d.vehicleType === "van" ? "Van"
    : "Motorcycle",
  plateNumber: d.plateNumber || "—",
  status:
    d.status === "busy" ? "On-Route"
    : d.status === "active" ? "Active"
    : "Delivered",
  zone: (d.zones ?? [])[0] ?? "—",
  activeOrders: d.activeOrders ?? [],
  totalDelivered: d.totalDelivered ?? d.shiftDeliveriesCount ?? 0,
  dutyTime: d.dutyTime ?? "—",
  location: parseLocation(d),
});

const DeliveryTrackingPage = () => {
  const { t } = useTranslation();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  // Derived, not its own state — the open rider/order detail panel used to
  // hold a snapshot Rider object taken at selection time. Every live-update
  // path below (socket events, the 30s poll) refreshes `riders`, but that
  // snapshot was never resynced from it, so an open panel kept showing
  // stale order status/steps until the user manually backed out and
  // reselected the rider. Deriving it from `riders` on every render means
  // it can never go stale.
  const selectedRider = useMemo(
    () => riders.find((r) => String(r.id) === String(selectedRiderId)) ?? null,
    [riders, selectedRiderId],
  );
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadRiders = useCallback(() => {
    setLoading(true);
    api
      .get("/logistics/drivers")
      .then((res) => {
        const raw: any[] = res.data?.drivers ?? [];
        setRiders(raw.map(mapRider));
        setLastUpdated(new Date());
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
        setHasLoaded(true);
      });
  }, []);

  useEffect(() => { loadRiders(); }, [loadRiders]);

  // The page claimed "Refreshes every 30 seconds" but nothing actually
  // polled — only the manual Refresh button ever re-fetched.
  useEffect(() => {
    const interval = window.setInterval(loadRiders, 30000);
    return () => window.clearInterval(interval);
  }, [loadRiders]);

  // Live rider position and status updates — listens to GPS pings, status changes,
  // order assignments, and socket reconnections.
  useEffect(() => {
    const socket = getSocket();
    const handleLocationUpdate = (data: { driverId: string; lat: number; lng: number }) => {
      setRiders((prev) =>
        prev.map((r) =>
          String(r.id) === String(data.driverId)
            ? { ...r, location: { lat: data.lat, lng: data.lng } }
            : r,
        ),
      );
      // selectedRider is derived from `riders` above, so patching it here
      // too would be redundant.
    };

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const handleRidersRefresh = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadRiders();
      }, 300);
    };

    socket.on("driverLocationUpdated", handleLocationUpdate);
    socket.on("connect", handleRidersRefresh);
    socket.on("driverUpdated", handleRidersRefresh);
    socket.on("driverStatusUpdated", handleRidersRefresh);
    socket.on("orderUpdated", handleRidersRefresh);
    socket.on("newOrder", handleRidersRefresh);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      socket.off("driverLocationUpdated", handleLocationUpdate);
      socket.off("connect", handleRidersRefresh);
      socket.off("driverUpdated", handleRidersRefresh);
      socket.off("driverStatusUpdated", handleRidersRefresh);
      socket.off("orderUpdated", handleRidersRefresh);
      socket.off("newOrder", handleRidersRefresh);
    };
  }, [loadRiders]);

  const overview = useMemo(() => {
    const activeRiders = riders.filter((r) => r.status !== "Delivered").length;
    const onRoute = riders.filter((r) => r.status === "On-Route").length;
    const activeOrders = riders.reduce((sum, r) => sum + r.activeOrders.length, 0);
    return { activeRiders, onRoute, activeOrders };
  }, [riders]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  if (!hasLoaded) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center animate-in fade-in-50 duration-300">
        <Navigation className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="animate-in fade-in-50 duration-300">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Delivery Tracking")}
          description={`${t("Last updated")}: ${formatTime(lastUpdated)} • ${t("Refreshes every 30 seconds")}`}
        />
        <DefaultButton
          data={{
            buttonText: t("Refresh"),
            icon: <RefreshCw className={`size-[18px] transition-transform duration-500 ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />,
            onClick: loadRiders,
            className: "transition-all duration-150 active:scale-[0.98]",
          }}
        />
      </div>

      <TrackingOverview
        activeRiders={overview.activeRiders}
        onRoute={overview.onRoute}
        activeOrders={overview.activeOrders}
      />

      <div className="grid h-[calc(100vh-340px)] min-h-[500px] grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_440px]">
        <GoogleMap
          riders={riders}
          selectedRider={selectedRider}
          onSelectRider={(r) => setSelectedRiderId(r.id != null ? String(r.id) : null)}
        />

        {selectedRider ? (
          <RiderDetailPanel rider={selectedRider} onBack={() => setSelectedRiderId(null)} />
        ) : (
          <RiderListPanel riders={riders} onSelectRider={(r) => setSelectedRiderId(r.id != null ? String(r.id) : null)} />
        )}
      </div>
    </section>
  );
};

export default DeliveryTrackingPage;
