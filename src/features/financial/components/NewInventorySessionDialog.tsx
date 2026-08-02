import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { useTranslation } from "@/shared/i18n/useTranslation";

const FORM_ID = "new-inventory-session-form";

interface NewInventorySessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSession?: (warehouse: string) => void;
}

const WAREHOUSE_OPTIONS = [
  { value: "Main Kitchen", label: "Main Kitchen" },
  { value: "Front Counter", label: "Front Counter" },
  { value: "Central Store", label: "Central Store" },
  { value: "Pastry Station", label: "Pastry Station" },
];

const NewInventorySessionDialog = ({
  open,
  onOpenChange,
  onCreateSession,
}: NewInventorySessionDialogProps) => {
  const { t } = useTranslation();
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedWarehouse("");
      setError("");
      setIsDropdownOpen(false);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarehouse) {
      setError(t("Please select a warehouse"));
      return;
    }
    onCreateSession?.(selectedWarehouse);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-160"
      >
        {isDropdownOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("New Inventory Session")}
            </DialogTitle>
          </div>

          {/* Form Content */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <Label className="mb-2.5 text-[16px] font-medium text-black">
                  {t("Warehouse")}<span className="text-[#C90000]">*</span>
                </Label>
                <DropdownSelect
                  options={WAREHOUSE_OPTIONS.map((w) => ({
                    ...w,
                    label: t(w.label),
                  }))}
                  selected={selectedWarehouse}
                  onSelect={(val) => {
                    setSelectedWarehouse(val);
                    setError("");
                  }}
                  onOpenChange={setIsDropdownOpen}
                  placeholder={t("Select a Warehouse")}
                  align="start"
                  className="w-full md:!w-full"
                  contentClassName="w-[var(--radix-dropdown-menu-trigger-width)] md:!w-[var(--radix-dropdown-menu-trigger-width)]"
                />
                {error && (
                  <p className="mt-1 text-[13px] text-[#C90000]">{error}</p>
                )}
              </div>

              {/* Information Note */}
              <div className="flex items-center gap-3 rounded-[12px] bg-[#E5E5E5] p-3 text-[#28293D]">
                <Info className="size-4 shrink-0 text-black" />
                <span className="text-[12px] font-medium text-[#28293D]">
                  {t("The current system quantities for all items will be loaded automatically.")}
                </span>
              </div>
            </div>
          </form>

          {/* Sticky Footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                disabled={!selectedWarehouse}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {t("Create new inventory session")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewInventorySessionDialog;
