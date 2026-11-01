import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import AccentColorPicker from "@/features/shifts/components/AccentColorPicker";
import { KITCHEN_ICONS, type KitchenIconId } from "../icons";
import KitchenIconTile from "./KitchenIconTile";
import KitchenIconPickerDialog from "./KitchenIconPickerDialog";
import { openSystemPrintDialog } from "../utils/printReceipt";
import type { Kitchen } from "../types";

const FORM_ID = "kitchen-form";

const COLOR_PRESETS = [
  "#2DD4BF",
  "#F4B183",
  "#3B82F6",
  "#E45562",
  "#F0A22E",
  "#A855F7",
];

const DEFAULT_COLOR = "#8F6900";

const PRINTER_NAME_MAP: Record<string, string> = {
  main_kitchen: "Main Kitchen Printer",
  barista: "Barista Printer",
  pastry: "Pastry Printer",
  cashier: "Cashier Printer",
  system_default: "System Default / Network Printer",
};

export interface KitchenFormData {
  name: string;
  printer: string;
  color: string;
  icon: KitchenIconId;
}

interface KitchenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingKitchen?: Kitchen | null;
  unavailableColors?: string[];
  onSave: (data: KitchenFormData) => void;
}

const KitchenDialog = ({
  open,
  onOpenChange,
  editingKitchen,
  unavailableColors = [],
  onSave,
}: KitchenDialogProps) => {
  const { t, dir } = useTranslation();
  const [name, setName] = useState("");
  const [printer, setPrinter] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [icon, setIcon] = useState<KitchenIconId>("kitchen_hat");
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(editingKitchen?.name ?? "");
    setPrinter(editingKitchen?.printer ?? "");
    setColor(editingKitchen?.color ?? DEFAULT_COLOR);
    setIcon(editingKitchen?.icon ?? "kitchen_hat");
    setIsIconPickerOpen(false);
    setError("");
  }, [open, editingKitchen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("Kitchen name is required"));
      return;
    }
    onSave({ name: name.trim(), printer: printer || "system_default", color, icon });
    onOpenChange(false);
  };

  const handleOpenPrintDialog = () => {
    openSystemPrintDialog(name.trim() || editingKitchen?.name || "Kitchen");
    if (!printer) {
      setPrinter("system_default");
    }
  };

  const printerDisplayLabel = printer
    ? PRINTER_NAME_MAP[printer]
      ? t(PRINTER_NAME_MAP[printer])
      : printer
    : t("System Default / Network Printer");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-[700px]"
      >
        <div className="flex flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {editingKitchen ? t("Edit Kitchen") : t("New Kitchen")}
            </DialogTitle>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5 px-5 py-5 sm:px-7 sm:py-6"
          >
            <div>
              <InputField
                data={{
                  id: "kitchen-name",
                  label: {
                    htmlFor: "kitchen-name",
                    labelText: t("Kitchen Name"),
                  },
                  placeholder: t("e.g barista"),
                  required: true,
                  inputProps: {
                    value: name,
                    onChange: (e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    },
                  },
                }}
              />
              {error && (
                <p className="mt-1 text-[13px] text-[#C90000]">{error}</p>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              <Label className="text-[16px] font-medium text-black">
                {t("Select Printer")}
              </Label>
              <button
                type="button"
                onClick={handleOpenPrintDialog}
                className="group flex h-12 w-full cursor-pointer items-center justify-between rounded-[8px] border border-[#CACBD4] bg-white px-3.5 text-left text-[14px] text-[#28293D] transition-all hover:border-[#8F6900] hover:bg-[#FAF7F2] active:scale-[0.99] focus:border-[#8F6900] focus:outline-none"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <Printer className="size-4.5 shrink-0 text-[#8F6900] transition-transform duration-200 group-hover:scale-110" />
                  <span className="truncate text-[15px] font-medium text-[#28293D]">
                    {printerDisplayLabel}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 rounded-md bg-[#F5F0EA] px-2.5 py-1 text-xs font-semibold text-[#8F6900] transition-colors group-hover:bg-[#8F6900] group-hover:text-white">
                  <span>{t("Open System Print Dialog")}</span>
                </div>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <Label className="text-[18px] font-semibold text-black">
                  {t("Kitchen Icon")}
                </Label>
                <button
                  type="button"
                  onClick={() => setIsIconPickerOpen(true)}
                  className="group flex cursor-pointer items-center gap-0.5 text-xs font-semibold leading-4 tracking-tight text-primary transition-opacity hover:opacity-80 active:scale-95"
                >
                  {t("See more icons")}
                  {dir === "rtl" ? (
                    <ChevronLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                  ) : (
                    <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  )}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {KITCHEN_ICONS.slice(0, 5).map((option) => (
                  <KitchenIconTile
                    key={option.id}
                    option={option}
                    selected={icon === option.id}
                    onClick={() => setIcon(option.id)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Label className="text-[16px] font-medium text-black">
                {t("Accent Color")}
              </Label>
              <AccentColorPicker
                value={color}
                presets={COLOR_PRESETS}
                unavailableColors={unavailableColors}
                onChange={setColor}
              />
            </div>
          </form>

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
                    "w-full sm:w-auto border-primary text-primary hover:bg-[#F5F0EA]/30 transition-all duration-200 active:scale-[0.98]",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px] transition-all duration-200 hover:shadow-xs active:scale-[0.98]"
              >
                {editingKitchen ? t("Save") : t("Add New Kitchen")}
              </Button>
            </div>
          </div>
        </div>

        <KitchenIconPickerDialog
          key={isIconPickerOpen ? `open-${icon}` : "closed"}
          open={isIconPickerOpen}
          onOpenChange={setIsIconPickerOpen}
          value={icon}
          onSelect={setIcon}
        />
      </DialogContent>
    </Dialog>
  );
};

export default KitchenDialog;
