import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import LocationsTable from "../components/LocationsTable";
import AddZoneDialog from "../components/AddZoneDialog";
import EditZoneDialog from "../components/EditZoneDialog";
import type { Location, LocationStatus } from "../types";

const LocationsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [locations, setLocations] = useState<Location[]>([
    {
      id: "1",
      name: "Kafr Abdo",
      deliveryFee: 65.0,
      minOrderAmount: 250.0,
      status: "available",
    },
    {
      id: "2",
      name: "Semouha",
      deliveryFee: 50.0,
      minOrderAmount: 200.0,
      status: "available",
    },
    {
      id: "3",
      name: "Gleem",
      deliveryFee: 38.0,
      minOrderAmount: 150.0,
      status: "inactive",
    },
    {
      id: "4",
      name: "Sidi Gaber",
      deliveryFee: 45.0,
      minOrderAmount: 200.0,
      status: "available",
    },
    {
      id: "5",
      name: "Moharam Bek",
      deliveryFee: 35.0,
      minOrderAmount: 150.0,
      status: "available",
    },
    {
      id: "6",
      name: "Roushdy",
      deliveryFee: 55.0,
      minOrderAmount: 200.0,
      status: "available",
    },
    {
      id: "7",
      name: "Zahraa El Maadi",
      deliveryFee: 40.0,
      minOrderAmount: 100.0,
      status: "available",
    },
  ]);

  const handleStatusChange = (
    locationId: string,
    newStatus: LocationStatus
  ) => {
    setLocations((prevLocations) =>
      prevLocations.map((location) =>
        location.id === locationId
          ? { ...location, status: newStatus }
          : location
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
    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this location?")) {
      setLocations((prev) =>
        prev.filter((location) => location.id !== locationId)
      );
    }
  };

  const handleAddZone = () => {
    setIsDialogOpen(true);
  };

  const handleSaveZone = (newLocation: Omit<Location, "id">) => {
    const newId = String(locations.length + 1);
    setLocations((prev) => [
      ...prev,
      {
        id: newId,
        ...newLocation,
      },
    ]);
  };

  const handleEditZone = (updatedLocation: Location) => {
    setLocations((prev) =>
      prev.map((location) =>
        location.id === updatedLocation.id ? updatedLocation : location
      )
    );
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-bold text-[32px]">Delivery Zones</h1>
          <p className="font-normal text-[16px] text-gray-600">
            Manage delivery locations and fees
          </p>
        </div>
        <Button
          onClick={handleAddZone}
          className="text-white font-semibold px-7.5 py-4 h-14 rounded-[5px]"
        >
          <Plus size={20} />
          Add Zone
        </Button>
      </div>

      {/* Table */}
      <div>
        <LocationsTable
          locations={locations}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Add Zone Dialog */}
      <AddZoneDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveZone}
      />

      {/* Edit Zone Dialog */}
      <EditZoneDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        location={selectedLocation}
        onSave={handleEditZone}
      />
    </div>
  );
};

export default LocationsPage;
