import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { showSuccessToast, showErrorToast } from "@/shared/utils/toast";
import KitchenCard from "../components/KitchenCard";
import KitchenDialog, { type KitchenFormData } from "../components/KitchenDialog";
import { getKitchens, createKitchen, updateKitchen, deleteKitchen } from "../api/kitchenApi";
import type { Kitchen } from "../types";

const getErrorMessage = (err: unknown): string | undefined =>
  (err as { response?: { data?: { message?: string } } })?.response?.data?.message;

const KitchenPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingKitchen, setDeletingKitchen] = useState<Kitchen | null>(null);
  const [isKitchenDialogOpen, setIsKitchenDialogOpen] = useState(false);
  const [editingKitchen, setEditingKitchen] = useState<Kitchen | null>(null);

  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        const data = await getKitchens();
        setKitchens(data);
      } catch (err) {
        console.error("Failed to fetch kitchens", err);
        showErrorToast(t("Failed to load kitchens"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchKitchens();
  }, [t]);

  const usedColors = kitchens
    .filter((kitchen) => kitchen.id !== editingKitchen?.id)
    .map((kitchen) => kitchen.color);

  const handleSaveKitchen = async (data: KitchenFormData) => {
    try {
      if (editingKitchen) {
        const updated = await updateKitchen(editingKitchen.id, data);
        setKitchens((prev) =>
          prev.map((kitchen) => (kitchen.id === updated.id ? updated : kitchen)),
        );
        showSuccessToast(t("Kitchen updated"));
      } else {
        const created = await createKitchen(data);
        setKitchens((prev) => [...prev, created]);
        showSuccessToast(t("Kitchen added"));
      }
      setEditingKitchen(null);
    } catch (err) {
      showErrorToast(getErrorMessage(err) || t("Failed to save kitchen"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingKitchen) return;
    try {
      await deleteKitchen(deletingKitchen.id);
      setKitchens((prev) => prev.filter((kitchen) => kitchen.id !== deletingKitchen.id));
      showSuccessToast(t("Kitchen deleted"));
      setDeletingKitchen(null);
    } catch (err) {
      showErrorToast(getErrorMessage(err) || t("Failed to delete kitchen"));
    }
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

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
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
      )}

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
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
};

export default KitchenPage;
