import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import { api } from "@/config/api";

import TrackingOverview from "./components/TrackingOverview";
import RiderListPanel from "./components/RiderListPanel";
import RiderDetailPanel from "./components/RiderDetailPanel";
import StaticMapPlaceholder from "./components/StaticMapPlaceholder";

import type { Rider } from "./types";

const mapRider = (d: any, idx: number): Rider => ({
  id: d._id ?? idx,
  name: d.name ?? "—",
  phone: d.phone ?? d.whatsappPhone ?? "—",
  vehicleType: d.vehicleType === "car" ? "Car" : d.vehicleType === "van" ? "Van" : "Motorcycle",
  plateNumber: d.plateNumber ?? "—",
  status: d.status === "busy" ? "On-Route" : d.status === "active" ? "Active" : "Delivered",
  zone: (d.zones ?? [])[0] ?? "—",
  activeOrders: [],
  totalDelivered: d.totalDeliveries ?? 0,
  dutyTime: "—",
});

const DeliveryTrackingPage = () => {
  const { t } = useTranslation();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);

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
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadRiders(); }, [loadRiders]);

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
        <StaticMapPlaceholder />

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
