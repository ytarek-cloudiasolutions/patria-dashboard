import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import TimePicker from "@/shared/components/TimePicker";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { SHIFT_COLORS, SHIFT_NAME_OPTIONS } from "../data";
import type { Shift, ShiftFormData } from "../types";
import AccentColorPicker from "./AccentColorPicker";

interface NewShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingShift?: Shift;
  onSave: (data: ShiftFormData, id?: number) => void;
}

const DEFAULT_START = "08:00 AM";
const DEFAULT_END = "04:00 PM";

const NewShiftDialog = ({
  open,
  onOpenChange,
  editingShift,
  onSave,
}: NewShiftDialogProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState(DEFAULT_START);
  const [endTime, setEndTime] = useState(DEFAULT_END);
  const [color, setColor] = useState(SHIFT_COLORS[0]);
  const [description, setDescription] = useState("");
  const [isNameOpen, setIsNameOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editingShift) {
      setName(editingShift.name);
      setStartTime(editingShift.startTime);
      setEndTime(editingShift.endTime);
      setColor(editingShift.color);
      setDescription(editingShift.description ?? "");
    } else {
      setName("");
      setStartTime(DEFAULT_START);
      setEndTime(DEFAULT_END);
      setColor(SHIFT_COLORS[0]);
      setDescription("");
    }
  }, [open, editingShift]);

  const nameOptions = Array.from(
    new Set([
      ...(editingShift?.name ? [editingShift.name] : []),
      ...SHIFT_NAME_OPTIONS,
    ]),
  );

  const canSave =
    name.trim().length > 0 && startTime.length > 0 && endTime.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave(
      {
        name: name.trim(),
        startTime,
        endTime,
        color,
        description: description.trim(),
      },
      editingShift?.id,
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-160"
      >
        {isNameOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {editingShift ? t("Edit Shift") : t("New Shift")}
            </DialogTitle>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            {/* Shift Name */}
            <div className="flex flex-col">
              <Label className="mb-2.5 text-[16px] font-medium text-black">
                {t("Shift Name")}
                <span className="text-[#C90000]">*</span>
              </Label>
              <DropdownSelect
                options={nameOptions}
                selected={name}
                onSelect={setName}
                onOpenChange={setIsNameOpen}
                placeholder={t("e.g Morning Shift")}
                align="start"
                className="md:w-full"
                contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
              />
            </div>

            {/* Start / End time */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col">
                <Label className="mb-2.5 text-[16px] font-medium text-black">
                  {t("Start Time")}
                  <span className="text-[#C90000]">*</span>
                </Label>
                <TimePicker
                  value={startTime}
                  onChange={setStartTime}
                  withBackdrop
                  popoverPlacement="bottom-right"
                />
              </div>
              <div className="flex flex-col">
                <Label className="mb-2.5 text-[16px] font-medium text-black">
                  {t("End Time")}
                  <span className="text-[#C90000]">*</span>
                </Label>
                <TimePicker
                  value={endTime}
                  onChange={setEndTime}
                  withBackdrop
                  popoverPlacement="bottom-right"
                />
              </div>
            </div>

            {/* Accent color */}
            <div>
              <Label className="mb-2.5 block text-[16px] font-medium text-black">
                {t("Accent Color")}
              </Label>
              <AccentColorPicker
                value={color}
                presets={SHIFT_COLORS}
                onChange={setColor}
              />
            </div>

            {/* Description */}
            <InputField
              id="shift-description"
              label={`${t("Description")} (${t("Optional")})`}
              placeholder={t("e.g Add details to this shift")}
              inputProps={{
                value: description,
                onChange: (e) => setDescription(e.target.value),
              }}
            />
          </div>

          {/* Footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex justify-end gap-3">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {editingShift ? t("Update Shift") : t("Add New Shift")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewShiftDialog;
