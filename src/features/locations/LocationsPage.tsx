import { useState } from "react";
import { Plus } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import LocationsTable from "./components/LocationsTable";
import AddZoneDialog from "./components/AddZoneDialog";
import { INITIAL_ZONES } from "./data";
import type { DeliveryZone, ZoneFormData } from "./types";

const LocationsPage = () => {
  const { t } = useTranslation();
  const [zones, setZones] = useState<DeliveryZone[]>(INITIAL_ZONES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | undefined>();
  const [deletingZone, setDeletingZone] = useState<DeliveryZone | null>(null);

  const handleOpenAdd = () => {
    setEditingZone(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setIsFormOpen(true);
  };

  const handleToggle = (zone: DeliveryZone, enabled: boolean) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === zone.id
          ? { ...z, status: enabled ? "Active" : "Inactive" }
          : z,
      ),
    );
  };

  const handleSave = (data: ZoneFormData, id?: number) => {
    if (id !== undefined) {
      setZones((prev) =>
        prev.map((z) =>
          z.id === id
            ? {
                ...z,
                name: data.name.trim(),
                deliveryFee: Number(data.deliveryFee),
                minOrderAmount: Number(data.minOrderAmount),
                status: data.status,
              }
            : z,
        ),
      );
    } else {
      const newZone: DeliveryZone = {
        id: Date.now(),
        name: data.name.trim(),
        deliveryFee: Number(data.deliveryFee),
        minOrderAmount: Number(data.minOrderAmount),
        status: data.status,
      };
      setZones((prev) => [newZone, ...prev]);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingZone) return;
    setZones((prev) => prev.filter((z) => z.id !== deletingZone.id));
    setDeletingZone(null);
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <HeaderLayout
          title={t("Delivery Zones")}
          description={t("Manage delivery locations and fees")}
        />
        <DefaultButton
          data={{
            buttonText: t("Add Zone"),
            icon: <Plus className="size-4.5" />,
            onClick: handleOpenAdd,
          }}
        />
      </div>

      <LocationsTable
        zones={zones}
        onEdit={handleEdit}
        onDelete={setDeletingZone}
        onToggle={handleToggle}
      />

      <AddZoneDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingZone={editingZone}
        onSave={handleSave}
      />

      <DeleteDialog
        open={!!deletingZone}
        onOpenChange={(open) => !open && setDeletingZone(null)}
        data={{
          item: deletingZone?.name ?? "",
          type: "delivery zone",
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default LocationsPage;
