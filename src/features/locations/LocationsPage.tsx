import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import LocationsTable from "./components/LocationsTable";
import AddZoneDialog from "./components/AddZoneDialog";
import type { DeliveryZone, ZoneFormData } from "./types";
import { useLocations } from "./hooks/useLocations";

const LocationsPage = () => {
  const { t } = useTranslation();
  const {
    createLocation,
    deleteLocation,
    getLocations,
    isCreatingLocation,
    isDeletingLocation,
    isFetchingLocations,
    isTogglingLocation,
    isUpdatingLocation,
    locations,
    toggleLocationStatus,
    updateLocation,
  } = useLocations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | undefined>();
  const [deletingZone, setDeletingZone] = useState<DeliveryZone | null>(null);

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  const handleOpenAdd = () => {
    setEditingZone(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setIsFormOpen(true);
  };

  const handleToggle = (zone: DeliveryZone, enabled: boolean) => {
    toggleLocationStatus({
      locationId: zone.id,
      isActive: enabled,
    });
  };

  const handleSave = (data: ZoneFormData, id?: string) => {
    const payload = {
      name: data.name.trim(),
      deliveryFee: Number(data.deliveryFee),
      minOrderAmount: Number(data.minOrderAmount),
      isActive: data.status === "Active",
    };

    if (id) {
      updateLocation({
        locationId: id,
        data: payload,
      });
    } else {
      createLocation(payload);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingZone) return;
    deleteLocation({ locationId: deletingZone.id });
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
            disabled: isFetchingLocations || isCreatingLocation,
          }}
        />
      </div>

      <LocationsTable
        zones={locations}
        isLoading={isFetchingLocations}
        isMutating={isTogglingLocation || isDeletingLocation}
        onEdit={handleEdit}
        onDelete={setDeletingZone}
        onToggle={handleToggle}
      />

      <AddZoneDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingZone={editingZone}
        isSaving={isCreatingLocation || isUpdatingLocation}
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
