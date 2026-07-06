import { Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Separator } from "@/shared/components/ui/separator";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { Driver } from "../types";

interface DispatchPanelProps {
  selectedReferences: string[];
  drivers: Driver[];
  selectedDriverId: string;
  onSelectDriver: (id: string) => void;
  onDriverMenuOpenChange: (open: boolean) => void;
  onSend: () => void;
  onCancel: () => void;
}

const DispatchPanel = ({
  selectedReferences,
  drivers,
  selectedDriverId,
  onSelectDriver,
  onDriverMenuOpenChange,
  onSend,
  onCancel,
}: DispatchPanelProps) => {
  const { t } = useTranslation();
  const count = selectedReferences.length;
  const driverOptions = drivers.map((d) => ({
    value: String(d.id),
    label: d.name,
  }));

  return (
    <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-5 sm:p-6">
      <h3 className="text-[20px] font-bold text-[#28293D]">
        {t("Dispatch Driver")}
      </h3>
      <p className="mt-1 text-[14px] text-[#8B8B8B]">
        {t("Orders selected")} ({count})
      </p>

      <div className="mt-5 rounded-[12px] border-2 border-dashed border-[#624F1C] bg-[#F5F0EA4D] p-4">
        <p className="mb-3 text-[14px] font-bold text-[#28293D]">
          {t("Orders Selected")}
        </p>
        {count === 0 ? (
          <p className="py-4 text-center text-[13px] text-[#8B8B8B]">
            {t("Select orders from the zones to dispatch.")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {selectedReferences.map((ref) => (
              <span
                key={ref}
                className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white px-2 text-[12px] font-medium text-[#28293D]"
                dir="ltr"
              >
                {ref}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[15px] font-bold text-[#28293D]">
          {t("Select Driver")}
        </p>
        <DropdownSelect
          options={driverOptions}
          selected={selectedDriverId}
          onSelect={onSelectDriver}
          onOpenChange={onDriverMenuOpenChange}
          placeholder={t("--- Select Driver ---")}
          align="start"
          className="md:w-full"
          contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
        />
      </div>

      <Separator className="my-5 bg-[#E5E5E5]" />

      <Button
        type="button"
        disabled={count === 0 || !selectedDriverId}
        onClick={onSend}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] text-[14px] font-semibold text-white disabled:opacity-50"
      >
        <Send className="size-4" />
        {t("Send")} {count} {count === 1 ? t("Order") : t("Orders")}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="mt-3 h-12 w-full cursor-pointer rounded-[8px] border-primary text-[14px] font-semibold text-primary hover:bg-[#FBF6EE] hover:text-primary"
      >
        {t("Cancel")}
      </Button>
    </div>
  );
};

export default DispatchPanel;
