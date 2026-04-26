import { Pencil, SquarePen, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import StatusBadge from "./StatusBadge";
import type { LocationProps, LocationStatus } from "../types";
import { Switch } from "@/shared/components/ui/switch";
import ActionButton from "@/shared/components/ActionButton";

interface LocationsTableProps {
  locations: LocationProps[];
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
  const handleToggle = (location: LocationProps) => {
    const newStatus: LocationStatus =
      location.status === "available" ? "inactive" : "available";
    onStatusChange(location.id, newStatus);
  };

  return (
    <Table>
      <colgroup>
        <col style={{ width: "196.4px" }} />
        <col style={{ width: "196.4px" }} />
        <col style={{ width: "196.4px" }} />
        <col style={{ width: "196.4px" }} />
        <col style={{ width: "196.4px" }} />
      </colgroup>
      <TableHeader>
        <TableRow>
          <TableHead>LOCATION NAME</TableHead>
          <TableHead>DELIVERY FEE</TableHead>
          <TableHead>MIN, ORDER AMOUNT</TableHead>
          <TableHead>STATUS</TableHead>
          <TableHead>ACTIONS</TableHead>
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
              <TableCell className="text-[#28293D] text-[14px] font-medium py-4">
                {location.name}
              </TableCell>
              <TableCell className="text-[#28293D] text-[14px] font-medium py-4">
                EGP{" "}
                <span className="font-semibold">
                  {location.deliveryFee.toFixed(2)}
                </span>
              </TableCell>
              <TableCell className="text-[#28293D] text-[14px] font-medium py-4">
                EGP{" "}
                <span className="font-semibold">
                  {location.minOrderAmount.toFixed(2)}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <StatusBadge status={location.status} />
              </TableCell>
              <TableCell className='py-4'>
                <div className="flex items-center gap-4.5">
                  <Switch
                    checked={location.status === "available"}
                    onCheckedChange={() => handleToggle(location)}
                  />
                  <ActionButton
                    data={{
                      icon: <SquarePen className="size-4.5" />,
                      iconColor: "text-[#000000]",
                      ariaLabel: "Edit location",
                      onClick: () => onEdit(location.id),
                    }}
                  />
                  <ActionButton
                    data={{
                      icon: <Trash2 className="size-4.5" />,
                      iconColor: "text-[#C90000]",
                      ariaLabel: "Delete location",
                      onClick: () => onDelete(location.id),
                    }}
                  />
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
