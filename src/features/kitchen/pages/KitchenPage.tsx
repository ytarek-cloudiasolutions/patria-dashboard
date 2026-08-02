import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";
import KitchenCard from "../components/KitchenCard";
import { getKitchenStations, type KitchenStation } from "../api/kitchenApi";

const KITCHEN_STATIONS = [
  {
    id: "barista",
    name: "Barista",
    description: "Coffee & beverages station",
    color: "#F9A825",
    bg: "#FE9A001A",
  },
  {
    id: "pastry",
    name: "Pastry & Bakery",
    description: "Pastries and baked goods station",
    color: "#A856F7",
    bg: "#F3E9FA",
  },
  {
    id: "hot_food",
    name: "Hot Food",
    description: "Hot meals kitchen station",
    color: "#E53935",
    bg: "#FEECEC",
  },
];

const KitchenPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stationData, setStationData] = useState<Record<string, KitchenStation>>({});

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stations = await getKitchenStations();
        setStationData(
          Object.fromEntries(stations.map((s) => [s.kitchenType, s])),
        );
      } catch (err) {
        console.error("Failed to fetch kitchen stations", err);
      }
    };
    fetchStations();
  }, []);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <HeaderLayout
          title={t("Kitchens")}
          description={t("Manage kitchen stations and oversee live operations")}
        />
      </div>

      <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:gap-7.5 xl:grid-cols-3">
        {KITCHEN_STATIONS.map((station) => {
          const live = stationData[station.id];
          const kitchenObj = {
            id: station.id,
            name: live?.name || station.name,
            description: live?.description || station.description,
            status: live?.status ?? "Active",
            color: station.color,
            icon: (station.id === "hot_food" ? "hot_food" : station.id) as any,
            activeOrders: live?.activeOrders ?? 0,
            requests: live?.requests ?? 0,
            detailActiveOrders: 0,
            lowStock: 0,
          };
          return (
            <KitchenCard
              key={station.id}
              kitchen={kitchenObj}
              onOpenKitchen={(id) => navigate(`/kitchen/${id}`)}
              onDeleteKitchen={() => {}}
            />
          );
        })}
      </div>
    </section>
  );
};

export default KitchenPage;
