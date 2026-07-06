import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";

import TrackingOverview from "./components/TrackingOverview";
import RiderListPanel from "./components/RiderListPanel";
import RiderDetailPanel from "./components/RiderDetailPanel";
import StaticMapPlaceholder from "./components/StaticMapPlaceholder";

import { INITIAL_RIDERS } from "./data";
import type { Rider } from "./types";

const DeliveryTrackingPage = () => {
  const { t } = useTranslation();
  const [riders] = useState<Rider[]>(INITIAL_RIDERS);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const overview = useMemo(() => {
    const activeRiders = riders.filter((r) => r.status !== "Delivered").length;
    const onRoute = riders.filter((r) => r.status === "On-Route").length;
    const activeOrders = riders.reduce(
      (sum, r) => sum + r.activeOrders.length,
      0,
    );
    return { activeRiders, onRoute, activeOrders };
  }, [riders]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const handleSelectRider = (rider: Rider) => {
    setSelectedRider(rider);
  };

  const handleBackToList = () => {
    setSelectedRider(null);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Delivery Tracking")}
          description={`${t("Last updated")}: ${formatTime(lastUpdated)} • ${t("Refreshes every 30 seconds")}`}
        />
        <DefaultButton
          data={{
            buttonText: t("Refresh"),
            icon: <RefreshCw className="size-[18px]" />,
            onClick: handleRefresh,
          }}
        />
      </div>

      {/* Overview cards */}
      <TrackingOverview
        activeRiders={overview.activeRiders}
        onRoute={overview.onRoute}
        activeOrders={overview.activeOrders}
      />

      {/* Content: Map + Sidebar */}
      <div className="grid h-[calc(100vh-340px)] min-h-[500px] grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_440px]">
        {/* Left: Static map */}
        <StaticMapPlaceholder />

        {/* Right: Riders list or detail */}
        {selectedRider ? (
          <RiderDetailPanel rider={selectedRider} onBack={handleBackToList} />
        ) : (
          <RiderListPanel
            riders={riders}
            onSelectRider={handleSelectRider}
          />
        )}
      </div>
    </>
  );
};

export default DeliveryTrackingPage;
