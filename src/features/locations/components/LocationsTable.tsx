import { SquarePen, Trash2 } from "lucide-react";
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
import { useTranslation } from "@/shared/i18n/useTranslation";
import StatusBadge from "./StatusBadge";
import type { DeliveryZone } from "../types";

interface LocationsTableProps {
  zones: DeliveryZone[];
  onEdit: (zone: DeliveryZone) => void;
  onDelete: (zone: DeliveryZone) => void;
  onToggle: (zone: DeliveryZone, enabled: boolean) => void;
}

const formatEgp = (value: number) => `EGP ${value.toFixed(2)}`;

const PrimaryAmount = ({ value }: { value: number }) => {
  const [prefix, amount] = formatEgp(value).split(" ");
  return (
    <span className="text-[14px] text-[#28293D]" dir="ltr">
      {prefix} <span className="font-semibold text-[#28293D]">{amount}</span>
    </span>
  );
};

const ZoneActions = ({
  zone,
  onEdit,
  onDelete,
  onToggle,
}: {
  zone: DeliveryZone;
  onEdit: (z: DeliveryZone) => void;
  onDelete: (z: DeliveryZone) => void;
  onToggle: (z: DeliveryZone, enabled: boolean) => void;
}) => (
  <div className="flex items-center gap-3">
    <Switch
      checked={zone.status === "Active"}
      onCheckedChange={(checked) => onToggle(zone, checked)}
      aria-label={`Toggle ${zone.name}`}
    />
    <ActionButton
      data={{
        icon: <SquarePen size={16} />,
        iconColor: "text-[#000000]",
        ariaLabel: `Edit ${zone.name}`,
        onClick: () => onEdit(zone),
      }}
    />
    <ActionButton
      data={{
        icon: <Trash2 size={16} />,
        iconColor: "text-[#C90000]",
        ariaLabel: `Delete ${zone.name}`,
        onClick: () => onDelete(zone),
      }}
    />
  </div>
);

const LocationsTable = ({
  zones,
  onEdit,
  onDelete,
  onToggle,
}: LocationsTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list — hidden on md+ */}
      <div className="flex flex-col gap-3 md:hidden">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-[#28293D]">
                  {zone.name}
                </p>
                <div className="mt-1">
                  <StatusBadge status={zone.status} />
                </div>
              </div>
              <ZoneActions
                zone={zone}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Delivery Fee")}
                </p>
                <PrimaryAmount value={zone.deliveryFee} />
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Min. Order Amount")}
                </p>
                <PrimaryAmount value={zone.minOrderAmount} />
              </div>
            </div>
          </div>
        ))}

        {zones.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No delivery zones found.")}
          </p>
        )}
      </div>

      {/* Desktop table — hidden below md */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">{t("LOCATION NAME")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("DELIVERY FEE")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("MIN. ORDER AMOUNT")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("STATUS")}</TableHead>
              <TableHead className="pe-6 py-4 text-end">{t("ACTIONS")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {zones.map((zone) => (
              <TableRow key={zone.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#28293D]">
                  {zone.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <PrimaryAmount value={zone.deliveryFee} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <PrimaryAmount value={zone.minOrderAmount} />
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={zone.status} />
                </TableCell>
                <TableCell className="pe-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-end">
                    <ZoneActions
                      zone={zone}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggle={onToggle}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {zones.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  {t("No delivery zones found.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default LocationsTable;
