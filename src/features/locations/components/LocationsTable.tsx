import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import StatusBadge from "./StatusBadge";
import type { Location, LocationStatus } from "../types";
import { Switch } from "@/shared/components/ui/switch";

interface LocationsTableProps {
  locations: Location[];
  onStatusChange: (locationId: string, newStatus: LocationStatus) => void;
  onEdit: (locationId: string) => void;
  onDelete: (locationId: string) => void;
}

const LocationsTable = ({
  locations,
  onStatusChange,
  onEdit,
  onDelete,
}: LocationsTableProps) => {
  const handleToggle = (location: Location) => {
    const newStatus: LocationStatus =
      location.status === "available" ? "inactive" : "available";
    onStatusChange(location.id, newStatus);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold text-[13px] pl-6">
            LOCATION NAME
          </TableHead>
          <TableHead className="font-semibold text-[13px]">
            DELIVERY FEE
          </TableHead>
          <TableHead className="font-semibold text-[13px]">
            MIN, ORDER AMOUNT
          </TableHead>
          <TableHead className="font-semibold text-[13px]">STATUS</TableHead>
          <TableHead className="font-semibold text-[13px]">ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-gray-500 py-8">
              No locations found
            </TableCell>
          </TableRow>
        ) : (
          locations.map((location) => (
            <TableRow key={location.id}>
              <TableCell className="font-medium text-[14px] pl-6">
                {location.name}
              </TableCell>
              <TableCell className="font-medium text-[14px]">
                EGP {location.deliveryFee.toFixed(2)}
              </TableCell>
              <TableCell className="font-medium text-[14px]">
                EGP {location.minOrderAmount.toFixed(2)}
              </TableCell>
              <TableCell>
                <StatusBadge status={location.status} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={location.status === "available"}
                    onCheckedChange={() => handleToggle(location)}
                  />
                  <button
                    onClick={() => onEdit(location.id)}
                    className="inline-flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Edit location"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(location.id)}
                    className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete location"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default LocationsTable;
