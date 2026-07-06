import { Bell, ChevronDown, SquarePen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import ActionButton from "@/shared/components/ActionButton";
import WhatsAppIcon from "@/assets/icons/whatsapp.svg";
import { DRIVER_STATUS_OPTIONS } from "../data";
import type { Driver, DriverStatus } from "../types";

const STATUS_STYLES: Record<DriverStatus, string> = {
  Active: "border-[#059B5A] bg-white text-[#059B5A]",
  "On-Route": "border-[#3357B5] bg-white text-[#3357B5]",
  "Off-Duty": "border-[#CACBD4] bg-[#E5E5E5] text-[#28293D]",
};

const openWhatsApp = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  window.open(`https://wa.me/${digits}`, "_blank", "noopener,noreferrer");
};

interface DriversTableProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onNotify: (driver: Driver) => void;
  onChangeStatus: (driver: Driver, status: DriverStatus) => void;
  onMenuOpenChange?: (open: boolean) => void;
}

const StatusDropdown = ({
  driver,
  onChangeStatus,
  onMenuOpenChange,
}: {
  driver: Driver;
  onChangeStatus: (d: Driver, s: DriverStatus) => void;
  onMenuOpenChange?: (open: boolean) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-1.5">
      <DropdownMenu onOpenChange={onMenuOpenChange}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5"
          >
            <span
              className={cn(
                "inline-flex h-7 min-w-20 items-center justify-center rounded-full border px-3 text-[12px] font-semibold",
                STATUS_STYLES[driver.status],
              )}
            >
              {t(driver.status)}
            </span>
            <ChevronDown className="size-4 text-[#28293D]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="z-70 rounded-[12px] p-2">
          {DRIVER_STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => onChangeStatus(driver, option.value as DriverStatus)}
              className={cn(
                "cursor-pointer rounded-[8px] px-3 py-2 text-[13px] font-medium",
                option.value === driver.status
                  ? "bg-primary text-white data-highlighted:bg-primary data-highlighted:text-white"
                  : "text-[#28293D] data-highlighted:bg-[#F5F0EA]",
              )}
            >
              {t(option.label)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const DriverActions = ({
  driver,
  onEdit,
  onNotify,
}: {
  driver: Driver;
  onEdit: (d: Driver) => void;
  onNotify: (d: Driver) => void;
}) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => openWhatsApp(driver.whatsappPhone)}
      aria-label={`Message ${driver.name} on WhatsApp`}
      className="flex cursor-pointer items-center justify-center"
    >
      <img src={WhatsAppIcon} alt="" className="size-5" />
    </button>
    <ActionButton
      data={{
        icon: <Bell size={16} />,
        iconColor: "text-[#28293D]",
        ariaLabel: `Send notification to ${driver.name}`,
        onClick: () => onNotify(driver),
      }}
    />
    <ActionButton
      data={{
        icon: <SquarePen size={16} />,
        iconColor: "text-[#000000]",
        ariaLabel: `Edit ${driver.name}`,
        onClick: () => onEdit(driver),
      }}
    />
  </div>
);

const DriversTable = ({
  drivers,
  onEdit,
  onNotify,
  onChangeStatus,
  onMenuOpenChange,
}: DriversTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Mobile card list */}
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
              <DriverActions driver={driver} onEdit={onEdit} onNotify={onNotify} />
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
            <StatusDropdown
              driver={driver}
              onChangeStatus={onChangeStatus}
              onMenuOpenChange={onMenuOpenChange}
            />
          </div>
        ))}
        {drivers.length === 0 && (
          <p className="py-8 text-center text-[14px] text-[#8B8B8B]">
            {t("No drivers yet.")}
          </p>
        )}
      </div>

      {/* Desktop table */}
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
                  <StatusDropdown
                    driver={driver}
                    onChangeStatus={onChangeStatus}
                    onMenuOpenChange={onMenuOpenChange}
                  />
                </TableCell>
                <TableCell className="pe-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-end">
                    <DriverActions
                      driver={driver}
                      onEdit={onEdit}
                      onNotify={onNotify}
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
