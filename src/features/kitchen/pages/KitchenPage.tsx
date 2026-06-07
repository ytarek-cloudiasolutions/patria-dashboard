import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteDialog from "@/shared/components/DeleteDialog";
import KitchenCard from "../components/KitchenCard";
import { KITCHENS } from "../data";
import HeaderLayout from "@/layouts/HeaderLayout";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Kitchen } from "../types";

const KitchenPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedKitchen, setSelectedKitchen] = useState<Kitchen | null>(null);

  const handleDelete = (kitchen: Kitchen) => {
    setSelectedKitchen(kitchen);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteOpen(false);
    setSelectedKitchen(null);
  };

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <HeaderLayout
          title={t("Kitchens")}
          description={t("Manage kitchen stations and oversee live operations")}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-7.5 xl:grid-cols-3">
        {KITCHENS.map((kitchen) => (
          <KitchenCard
            key={kitchen.id}
            kitchen={kitchen}
            onOpenKitchen={(kitchenId) => navigate(`/kitchen/${kitchenId}`)}
            onDeleteKitchen={handleDelete}
          />
        ))}
      </div>

      {selectedKitchen && (
        <DeleteDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          data={{ item: selectedKitchen.name, type: "kitchen" }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </section>
  );
};

export default KitchenPage;
