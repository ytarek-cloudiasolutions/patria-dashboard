import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showSuccessToast } from "@/shared/utils/toast";
import KitchenCard from "../components/KitchenCard";
import KitchenDialog, { type KitchenFormData } from "../components/KitchenDialog";
import { getKitchenStations, type KitchenStation } from "../api/kitchenApi";
import type { Kitchen, KitchenIcon } from "../types";
const KITCHEN_STATIONS = [
  {
    id: "barista",
    name: "Barista",
    description: "Coffee & beverages station",
    color: "#F0A22E",
    bg: "#FE9A001A",
  },
  {
    id: "pastry",
    name: "Pastry & Bakery",
    description: "Pastries and baked goods station",
    color: "#A855F7",
    bg: "#F3E9FA",
  },
  {
    id: "hot_food",
    name: "Hot Food",
    description: "Hot meals kitchen station",
    color: "#E45562",
    bg: "#FEECEC",
  },
];

const STATION_ICON: Record<string, KitchenIcon> = {
  barista: "coffee",
  pastry: "bakery",
  hot_food: "kitchen_hat",
};

const KitchenPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stationData, setStationData] = useState<Record<string, KitchenStation>>({});
  const [customKitchens, setCustomKitchens] = useState<Kitchen[]>([]);
  const [overrides, setOverrides] = useState<Record<string, Partial<Kitchen>>>({});
  const [deletingKitchen, setDeletingKitchen] = useState<{ id: string; name: string } | null>(null);
  const [deletedKitchens, setDeletedKitchens] = useState<Set<string>>(new Set());
  const [isKitchenDialogOpen, setIsKitchenDialogOpen] = useState(false);
  const [editingKitchen, setEditingKitchen] = useState<Kitchen | null>(null);

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

  const baseKitchens: Kitchen[] = KITCHEN_STATIONS.map((station) => {
    const live = stationData[station.id];
    const name = live?.name || station.name;
    const printerByStation: Record<string, string> = {
      hot_food: "main_kitchen",
      barista: "barista",
      pastry: "pastry",
    };
    return {
      id: station.id,
      name,
      description: live?.description || station.description,
      status: live?.status ?? "Active",
      color: station.color,
      icon: STATION_ICON[station.id] ?? "kitchen_hat",
      activeOrders: live?.activeOrders ?? 0,
      requests: live?.requests ?? 0,
      detailActiveOrders: 0,
      lowStock: 0,
      printer: printerByStation[station.id] ?? "main_kitchen",
    };
  });

  const kitchens = [...baseKitchens, ...customKitchens]
    .map((kitchen) => ({ ...kitchen, ...(overrides[kitchen.id] ?? {}) }))
    .filter((kitchen) => !deletedKitchens.has(kitchen.id));

  const usedColors = kitchens
    .filter((kitchen) => kitchen.id !== editingKitchen?.id)
    .map((kitchen) => kitchen.color);

  const handleSaveKitchen = (data: KitchenFormData) => {
    if (editingKitchen) {
      setOverrides((prev) => ({
        ...prev,
        [editingKitchen.id]: {
          ...prev[editingKitchen.id],
          name: data.name,
          printer: data.printer,
          color: data.color,
          icon: data.icon,
        },
      }));
      showSuccessToast(t("Kitchen updated"));
    } else {
      setCustomKitchens((prev) => [
        ...prev,
        {
          id: `custom-${Date.now()}`,
          name: data.name,
          printer: data.printer,
          color: data.color,
          description: "Operational kitchen station",
          status: "Active",
          icon: data.icon,
          activeOrders: 0,
          requests: 0,
          detailActiveOrders: 0,
          lowStock: 0,
        },
      ]);
      showSuccessToast(t("Kitchen added"));
    }
    setEditingKitchen(null);
  };

  return (
    <section className="animate-in fade-in-50 duration-300">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <HeaderLayout
          title={t("Kitchens")}
          description={t("Manage kitchen stations and oversee live operations")}
        />
        <DefaultButton
          data={{
            buttonText: t("New Kitchen"),
            icon: <Plus className="size-4.5 transition-transform duration-200 group-hover:rotate-90" />,
            className: "group transition-all duration-200 hover:shadow-xs active:scale-[0.98]",
            onClick: () => {
              setEditingKitchen(null);
              setIsKitchenDialogOpen(true);
            },
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-[30px] md:grid-cols-2 lg:gap-7.5 xl:grid-cols-3">
        {kitchens.map((kitchen) => (
          <KitchenCard
            key={kitchen.id}
            kitchen={kitchen}
            onOpenKitchen={(id) => navigate(`/kitchen/${id}`)}
            onEditKitchen={(selected) => {
              setEditingKitchen(selected);
              setIsKitchenDialogOpen(true);
            }}
            onDeleteKitchen={(selected) => setDeletingKitchen(selected)}
          />
        ))}
      </div>

      <KitchenDialog
        open={isKitchenDialogOpen}
        onOpenChange={setIsKitchenDialogOpen}
        editingKitchen={editingKitchen}
        unavailableColors={usedColors}
        onSave={handleSaveKitchen}
      />

      <DeleteDialog
        open={!!deletingKitchen}
        onOpenChange={(open) => !open && setDeletingKitchen(null)}
        data={{ item: deletingKitchen?.name ?? "", type: "kitchen" }}
        onConfirm={() => {
          if (!deletingKitchen) return;
          setDeletedKitchens((prev) => new Set(prev).add(deletingKitchen.id));
          showSuccessToast(t("Kitchen deleted"));
          setDeletingKitchen(null);
        }}
      />
    </section>
  );
};

export default KitchenPage;
