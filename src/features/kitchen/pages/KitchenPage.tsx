import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";
import KitchenCard from "../components/KitchenCard";
import { getKitchenOrders } from "../api/kitchenApi";

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
  const [activeOrdersCount, setActiveOrdersCount] = useState<Record<string, number>>({
    barista: 0,
    pastry: 0,
    hot_food: 0,
  });

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        const [baristaRes, pastryRes, hotFoodRes] = await Promise.all([
          getKitchenOrders("barista"),
          getKitchenOrders("pastry"),
          getKitchenOrders("hot_food"),
        ]);
        setActiveOrdersCount({
          barista: baristaRes.orders?.length ?? 0,
          pastry: pastryRes.orders?.length ?? 0,
          hot_food: hotFoodRes.orders?.length ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch active orders count", err);
      }
    };
    fetchActiveOrders();
  }, []);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <HeaderLayout
          title={t("Kitchens")}
          description={t("Manage kitchen stations and oversee live operations")}
        />
        <button
          type="button"
          className="flex h-14 shrink-0 cursor-pointer items-center gap-3 rounded-[5px] bg-primary px-[30px] py-4 text-[16px] font-semibold text-white transition hover:opacity-90"
        >
          <Plus className="size-[18px]" />
          {t("New Kitchen")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:gap-7.5 xl:grid-cols-3">
        {KITCHEN_STATIONS.map((station) => {
          const kitchenObj = {
            id: station.id,
            name: station.name,
            description: station.description,
            status: "active" as const,
            color: station.color,
            icon: (station.id === "hot_food" ? "hot_food" : station.id) as any,
            activeOrders: activeOrdersCount[station.id] ?? 0,
            requests: 0, // Requests count set to 0 for now as requested
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
