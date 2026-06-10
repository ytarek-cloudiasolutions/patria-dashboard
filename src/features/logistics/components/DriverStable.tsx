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
import { useTranslation } from "@/shared/i18n/useTranslation";
import ActionButton from "@/shared/components/ActionButton";
import WhatsAppIcon from "@/assets/icons/whatsapp.svg";
import type { Driver } from "../types";

const openWhatsApp = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  window.open(`https://wa.me/${digits}`, "_blank", "noopener,noreferrer");
};

const StatusToggle = ({
  driver,
  onToggleStatus,
}: {
  driver: Driver;
  onToggleStatus: (d: Driver, enabled: boolean) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] font-semibold">{t(driver.status)}</span>
      <Switch
        checked={driver.status === "Active"}
        onCheckedChange={(checked) => onToggleStatus(driver, checked)}
        aria-label={`Toggle ${driver.name}`}
      />
    </div>
  );
};

const WhatsAppButton = ({ driver }: { driver: Driver }) => (
  <button
    type="button"
    onClick={() => openWhatsApp(driver.whatsappPhone)}
    aria-label={`Message ${driver.name} on WhatsApp`}
    className="flex cursor-pointer items-center justify-center"
  >
    <img src={WhatsAppIcon} alt="" className="size-5" />
  </button>
);

interface DriversTableProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
  onToggleStatus: (driver: Driver, enabled: boolean) => void;
}

const DriverActions = ({
  driver,
  onEdit,
  onDelete,
}: {
  driver: Driver;
  onEdit: (d: Driver) => void;
  onDelete: (d: Driver) => void;
}) => (
  <div className="flex items-center gap-3">
    <WhatsAppButton driver={driver} />
    <ActionButton
      data={{
        icon: <SquarePen size={16} />,
        iconColor: "text-[#000000]",
        ariaLabel: `Edit ${driver.name}`,
        onClick: () => onEdit(driver),
      }}
    />
    <ActionButton
      data={{
        icon: <Trash2 size={16} />,
        iconColor: "text-[#C90000]",
        ariaLabel: `Delete ${driver.name}`,
        onClick: () => onDelete(driver),
      }}
    />
  </div>
);

const DriversTable = ({
  drivers,
  onEdit,
  onDelete,
  onToggleStatus,
}: DriversTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list — hidden on md+ */}
      <div className="flex flex-col gap-3 md:hidden">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="rounded-2xl border border-[#E5E5E5] bg-white px-4 py-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-[#28293D]">
                  {driver.name}
                </p>
                <p className="text-[12px] text-[#6B6B6B]">
                  <bdi>{driver.whatsappPhone}</bdi>
                </p>
              </div>
              <DriverActions
                driver={driver}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Vehicle Type")}
                </p>
                <p className="text-[#28293D]">{t(driver.vehicleType)}</p>
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                  {t("Zones")}
                </p>
                <p className="text-[#28293D]">{driver.zones.join(", ")}</p>
              </div>
            </div>

            <StatusToggle driver={driver} onToggleStatus={onToggleStatus} />
          </div>
        ))}

        {drivers.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No drivers yet.")}
          </p>
        )}
      </div>

      {/* Desktop table — hidden below md */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 py-4 text-start">{t("DRIVER NAME")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("WHATSAPP PHONE")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("VEHICLE TYPE")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("ZONES")}</TableHead>
              <TableHead className="px-6 py-4 text-start">{t("STATUS")}</TableHead>
              <TableHead className="pe-6 py-4 text-end">{t("ACTION")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id} className="hover:bg-[#FAFAF8]">
                <TableCell className="ps-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#28293D]">
                  {driver.name}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                  <bdi>{driver.whatsappPhone}</bdi>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                  {t(driver.vehicleType)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[14px] text-[#28293D]">
                  {driver.zones.join(", ")}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <StatusToggle
                    driver={driver}
                    onToggleStatus={onToggleStatus}
                  />
                </TableCell>
                <TableCell className="pe-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-end">
                    <DriverActions
                      driver={driver}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {drivers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-[14px] text-[#8B8B8B]"
                >
                  {t("No drivers yet.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default DriversTable;
