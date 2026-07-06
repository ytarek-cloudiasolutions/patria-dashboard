import { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronUp, DollarSign, Package } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { cn } from "@/lib/utils";
import type { Driver, DriverStatus } from "../types";

interface DriverDutyCardProps {
  driver: Driver;
  onHourlyRateChange: (id: number, rate: number) => void;
}

const STATUS_STYLES: Record<DriverStatus, string> = {
  Active: "border-[#059B5A] bg-white text-[#059B5A]",
  "On-Route": "border-[#3357B5] bg-white text-[#3357B5]",
  "Off-Duty": "border-[#CACBD4] bg-[#E5E5E5] text-[#28293D]",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const DriverDutyCard = ({ driver, onHourlyRateChange }: DriverDutyCardProps) => {
  const { t } = useTranslation();
  const [rate, setRate] = useState(driver.hourlyRate);

  useEffect(() => {
    setRate(driver.hourlyRate);
  }, [driver.hourlyRate]);

  return (
    <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-[14px] font-semibold text-white">
          {initials(driver.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] font-bold text-[#28293D]">
            {driver.name}
          </p>
          <p className="truncate text-[12px] text-[#8B8B8B]" dir="ltr">
            {driver.whatsappPhone}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex h-7 items-center rounded-full border px-3 text-[12px] font-semibold",
            STATUS_STYLES[driver.status],
          )}
        >
          {t(driver.status)}
        </span>
      </div>

      {/* Timer */}
      <div className="mt-4 flex h-20 items-center justify-center rounded-[12px] border-2 border-dashed border-[#624F1C] bg-[#F5F0EA4D]">
        <span className="text-[32px] font-bold tracking-wide text-primary" dir="ltr">
          {driver.dutyTime}
        </span>
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-start justify-between">
        <div>
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#8B8B8B]">
            <Package size={14} />
            {t("Orders")}
          </p>
          <p className="mt-1 text-[16px] font-bold text-[#28293D]">
            {driver.ordersToday}
          </p>
        </div>
        <div className="text-end">
          <p className="flex items-center justify-end gap-1.5 text-[12px] font-medium text-[#8B8B8B]">
            <DollarSign size={14} />
            {t("Salary Now")}
          </p>
          <p className="mt-1 text-[16px] font-bold text-[#28293D]" dir="ltr">
            EGP {driver.salaryNow.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="my-4 h-px bg-[#E5E5E5]" />

      {/* Hourly rate */}
      <p className="mb-2 text-[15px] font-bold text-[#28293D]">
        {t("Hourly Rate")}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex h-12 flex-1 items-center justify-between rounded-[8px] border border-primary px-4">
          <span className="text-[14px] text-[#28293D]" dir="ltr">
            {rate.toFixed(2)} EGP
          </span>
          <div className="flex flex-col">
            <button
              type="button"
              aria-label={t("Increase")}
              onClick={() => setRate((r) => r + 1)}
              className="cursor-pointer text-[#8B8B8B] hover:text-[#28293D]"
            >
              <ChevronUp className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label={t("Decrease")}
              onClick={() => setRate((r) => Math.max(0, r - 1))}
              className="cursor-pointer text-[#8B8B8B] hover:text-[#28293D]"
            >
              <ChevronDown className="size-3.5" />
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label={t("Save hourly rate")}
          onClick={() => onHourlyRateChange(driver.id, rate)}
          className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-[8px] bg-primary text-white hover:opacity-90"
        >
          <Check className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default DriverDutyCard;
