import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";
import { Button } from "@/shared/components/ui/button";
import DefaultButton from "@/shared/components/DefaultButton";
import AddZoneForm from "./AddZoneForm";
import type { DeliveryZone, ZoneFormData } from "../types";

const FORM_ID = "add-zone-form";

interface AddZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingZone?: DeliveryZone;
  onSave: (data: ZoneFormData, id?: number) => void;
}

const AddZoneDialog = ({
  open,
  onOpenChange,
  editingZone,
  onSave,
}: AddZoneDialogProps) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const handleSubmit = (data: ZoneFormData, id?: number) => {
    onSave(data, id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-[640px]"
      >
        {/* Scrim/backdrop overlay when the Status dropdown is open */}
        {isStatusOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {editingZone ? "Edit Zone" : "Add New Zone"}
            </DialogTitle>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            <AddZoneForm
              id={FORM_ID}
              editingZone={editingZone}
              onSubmit={handleSubmit}
              onDropdownOpenChange={setIsStatusOpen}
            />
          </div>

          {/* Sticky footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex justify-end gap-3">
              <DefaultButton
                data={{
                  buttonText: "Cancel",
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {editingZone ? "Update Zone" : "Save Zone"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddZoneDialog;
