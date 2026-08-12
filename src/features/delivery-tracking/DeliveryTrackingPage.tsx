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
  location: d.location?.lat && d.location?.lng ? { lat: d.location.lat, lng: d.location.lng } : undefined,
});

const DeliveryTrackingPage = () => {
  const { t } = useTranslation();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
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

  // Live rider position updates — the backend already emits
  // driverLocationUpdated on every GPS ping (driverController.updateLocation),
  // but this screen never connected to the socket, so the map only ever
  // reflected whatever was true at the last manual/interval refresh.
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
      setSelectedRider((prev) =>
        prev && String(prev.id) === String(data.driverId)
          ? { ...prev, location: { lat: data.lat, lng: data.lng } }
          : prev,
      );
    };

    socket.on("driverLocationUpdated", handleLocationUpdate);
    return () => {
      socket.off("driverLocationUpdated", handleLocationUpdate);
    };
  }, []);

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
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Navigation className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Delivery Tracking")}
          description={`${t("Last updated")}: ${formatTime(lastUpdated)} • ${t("Refreshes every 30 seconds")}`}
        />
        <DefaultButton
          data={{
            buttonText: t("Refresh"),
            icon: <RefreshCw className={`size-[18px] ${loading ? "animate-spin" : ""}`} />,
            onClick: loadRiders,
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
          onSelectRider={setSelectedRider}
        />

        {selectedRider ? (
          <RiderDetailPanel rider={selectedRider} onBack={() => setSelectedRider(null)} />
        ) : (
          <RiderListPanel riders={riders} onSelectRider={setSelectedRider} />
        )}
      </div>
    </>
  );
};

export default DeliveryTrackingPage;
