import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import AccentColorPicker from "@/features/shifts/components/AccentColorPicker";
import { KITCHEN_ICONS, type KitchenIconId } from "../icons";
import KitchenIconTile from "./KitchenIconTile";
import KitchenIconPickerDialog from "./KitchenIconPickerDialog";
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

const PRINTER_OPTIONS = [
  { value: "main_kitchen", label: "Main Kitchen Printer" },
  { value: "barista", label: "Barista Printer" },
  { value: "pastry", label: "Pastry Printer" },
  { value: "cashier", label: "Cashier Printer" },
];

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
  const [isPrinterOpen, setIsPrinterOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(editingKitchen?.name ?? "");
    setPrinter(editingKitchen?.printer ?? "");
    setColor(editingKitchen?.color ?? DEFAULT_COLOR);
    setIcon(editingKitchen?.icon ?? "kitchen_hat");
    setIsPrinterOpen(false);
    setIsIconPickerOpen(false);
    setError("");
  }, [open, editingKitchen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("Kitchen name is required"));
      return;
    }
    onSave({ name: name.trim(), printer, color, icon });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-[700px]"
      >
        {isPrinterOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}
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
              <DropdownSelect
                options={PRINTER_OPTIONS.map((option) => ({
                  ...option,
                  label: t(option.label),
                }))}
                selected={printer}
                onSelect={setPrinter}
                onOpenChange={setIsPrinterOpen}
                placeholder={t("Select Printer")}
                align="start"
                className="md:w-full"
                contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <Label className="text-[18px] font-semibold text-black">
                  {t("Kitchen Icon")}
                </Label>
                <button
                  type="button"
                  onClick={() => setIsIconPickerOpen(true)}
                  className="flex cursor-pointer items-center gap-0.5 text-xs font-semibold leading-4 tracking-tight text-primary"
                >
                  {t("See more icons")}
                  {dir === "rtl" ? (
                    <ChevronLeft className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
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
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
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
