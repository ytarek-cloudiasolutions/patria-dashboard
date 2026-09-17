import { useEffect, useRef, useState } from "react";
import { Plus, MapPin } from "lucide-react";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import DeleteDialog from "@/shared/components/DeleteDialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import LocationsTable from "./components/LocationsTable";
import AddZoneDialog from "./components/AddZoneDialog";
import type { DeliveryZone, ZoneFormData, ZonePoint } from "./types";
import type { CreateLocationRequest } from "./store/locationTypes";
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

  const [locationsLoaded, setLocationsLoaded] = useState(false);
  const locationsStarted = useRef(isFetchingLocations);

  useEffect(() => {
    if (isFetchingLocations) {
      locationsStarted.current = true;
    } else if (locationsStarted.current) {
      setLocationsLoaded(true);
    }
  }, [isFetchingLocations]);

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
    // 1. Prepare clean polygon coordinates as { lat, lng } objects
    const rawPolygon = Array.isArray(data.polygon) ? data.polygon : [];
    const polygon: ZonePoint[] = rawPolygon
      .map((p) => ({
        lat: Number(Number(p.lat).toFixed(6)),
        lng: Number(Number(p.lng).toFixed(6)),
      }))
      .filter((p) => !isNaN(p.lat) && !isNaN(p.lng));

    const hasPolygon = polygon.length >= 3;

    // 2. Ensure centerLat and centerLng are numbers
    let centerLat =
      typeof data.centerLat === "number" && !isNaN(data.centerLat)
        ? Number(data.centerLat.toFixed(6))
        : undefined;
    let centerLng =
      typeof data.centerLng === "number" && !isNaN(data.centerLng)
        ? Number(data.centerLng.toFixed(6))
        : undefined;

    if (centerLat === undefined || centerLng === undefined) {
      if (polygon.length > 0) {
        const sum = polygon.reduce(
          (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
          { lat: 0, lng: 0 },
        );
        centerLat = Number((sum.lat / polygon.length).toFixed(6));
        centerLng = Number((sum.lng / polygon.length).toFixed(6));
      } else {
        centerLat = 31.2001;
        centerLng = 29.9187;
      }
    }

    // 3. Build payload strictly according to Swagger schema
    const payload: CreateLocationRequest = {
      name: data.name.trim(),
      deliveryFee: Number(data.deliveryFee) || 0,
      minOrderAmount: Number(data.minOrderAmount) || 0,
      isActive: data.status === "Active",
      centerLat,
      centerLng,
      polygon,
      // There is no need to send radiusKm when a polygon is provided
      ...(hasPolygon
        ? {}
        : data.radiusKm
        ? { radiusKm: Number(data.radiusKm) || 5 }
        : {}),
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

  const isLoading = !locationsLoaded;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <MapPin className="size-16 animate-spin text-primary" />
      </div>
    );
  }

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
