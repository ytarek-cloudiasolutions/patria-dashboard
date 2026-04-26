import { useState } from "react";
import { Plus } from "lucide-react";
import LocationsTable from "../components/LocationsTable";
import AddZoneDialog from "../components/AddZoneDialog";
import DeleteDialog from "@/shared/components/DeleteDialog";
import type { LocationProps, LocationStatus } from "../types";
import { MOCK_LOCATIONS } from "../data";
import HeaderLayout from "@/layouts/HeaderLayout";
import DefaultButton from "@/shared/components/DefaultButton";
import ZoneForm from "../components/AddZoneForm";

const LocationsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationProps | null>(null);
  const [locations, setLocations] = useState<LocationProps[]>(MOCK_LOCATIONS);

  const handleStatusChange = (
    locationId: string,
    newStatus: LocationStatus
  ) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === locationId ? { ...loc, status: newStatus } : loc
      )
    );
  };

  const handleEdit = (locationId: string) => {
    const location = locations.find((loc) => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = (locationId: string) => {
    const location = locations.find((loc) => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedLocation) return;
    setLocations((prev) =>
      prev.filter((loc) => loc.id !== selectedLocation.id)
    );
    setIsDeleteDialogOpen(false);
    setSelectedLocation(null);
  };

  const handleSaveZone = (newLocation: Omit<LocationProps, "id">) => {
    const newId = String(locations.length + 1);
    setLocations((prev) => [...prev, { id: newId, ...newLocation }]);
    setIsAddDialogOpen(false);
  };

  const handleEditZone = (updated: Omit<LocationProps, "id">) => {
    if (!selectedLocation) return;
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === selectedLocation.id
          ? { id: selectedLocation.id, ...updated }
          : loc
      )
    );
    setIsEditDialogOpen(false);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <HeaderLayout
          title="Delivery Zones"
          description="Manage delivery locations and fees"
        />
        <DefaultButton
          data={{
            buttonText: "Add Zone",
            icon: <Plus className="size-4.5" />,
            onClick: () => setIsAddDialogOpen(true),
          }}
        />
      </div>

      {/* Table */}
      <LocationsTable
        locations={locations}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Add Zone Dialog */}
      <AddZoneDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Add New Zone"
      >
        <ZoneForm
          onSave={handleSaveZone}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </AddZoneDialog>

      {/* Edit Zone Dialog */}
      <AddZoneDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Zone"
      >
        <ZoneForm
          key={selectedLocation?.id}
          initialData={selectedLocation ?? undefined}
          onSave={handleEditZone}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      </AddZoneDialog>

      {/* Delete Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        data={{
          item: selectedLocation?.name ?? "",
          type: "delivery zone",
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default LocationsPage;
