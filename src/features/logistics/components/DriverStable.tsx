import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Switch } from "@/shared/components/ui/switch";
import ActionButton from "@/shared/components/ActionButton";

import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import type { Driver } from "../types";

interface DriversTableProps {
  drivers: Driver[];
  onToggleStatus: (id: number) => void;
  onEdit: (driver: Driver) => void;
  onDelete: (id: number) => void;
  onWhatsapp: (driver: Driver) => void;
}

const DriversTable = ({
  drivers,
  onToggleStatus,
  onEdit,
  onDelete,
  onWhatsapp,
}: DriversTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="px-4">DRIVER NAME</TableHead>
          <TableHead className="px-4">WHATSAPP PHONE</TableHead>
          <TableHead className="px-4">VEHICLE TYPE</TableHead>
          <TableHead className="px-4">ZONES</TableHead>
          <TableHead className="px-4">STATUS</TableHead>
          <TableHead className="px-4">ACTION</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {drivers.map((driver) => (
          <TableRow key={driver.id}>
            <TableCell className="px-4 font-semibold text-[#28293D]">
              {driver.name}
            </TableCell>
            <TableCell className="px-4 text-[#28293D]">
              {driver.phone}
            </TableCell>
            <TableCell className="px-4 text-[#28293D]">
              {driver.vehicle}
            </TableCell>
            <TableCell className="px-4 text-[#28293D]">
              {driver.zones.length > 0 ? driver.zones.join(", ") : "—"}
            </TableCell>
            <TableCell className="px-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="text-[12px] font-semibold"
                  style={{
                    color: driver.status === "Active" ? "#059B5A" : "#888888",
                  }}
                >
                  {driver.status}
                </span>
                <Switch
                  checked={driver.status === "Active"}
                  onCheckedChange={() => onToggleStatus(driver.id)}
                />
              </div>
            </TableCell>
            <TableCell className="px-4">
              <div className="flex items-center gap-2">
                <ActionButton
                  data={{
                    icon: <MessageCircle size={16} />,
                    iconColor: "text-[#25D366]",
                    onClick: () => onWhatsapp(driver),
                  }}
                />
                <ActionButton
                  data={{
                    icon: <Pencil size={16} />,
                    iconColor: "text-[#7A6518]",
                    onClick: () => onEdit(driver),
                  }}
                />
                <ActionButton
                  data={{
                    icon: <Trash2 size={16} />,
                    iconColor: "text-[#C90000]",
                    onClick: () => onDelete(driver.id),
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DriversTable;
