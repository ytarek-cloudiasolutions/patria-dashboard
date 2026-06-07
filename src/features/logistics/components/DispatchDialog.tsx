import { useEffect, useState } from "react";
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
import type { Driver, Zone } from "../types";

const FORM_ID = "dispatch-form";

interface DispatchDialogProps {
  open: boolean;
  zone: Zone | null;
  drivers: Driver[];
  onOpenChange: (open: boolean) => void;
  onConfirm: (zoneId: string, driverId: number) => void;
}

const DispatchDialog = ({
  open,
  zone,
  drivers,
  onOpenChange,
  onConfirm,
}: DispatchDialogProps) => {
  const [driverId, setDriverId] = useState("");
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setDriverId("");
      setError("");
      setIsDropdownOpen(false);
    }
  }, [open, zone?.id]);

  const driverOptions = drivers
    .filter((d) => d.status === "Active")
    .map((d) => ({
      value: String(d.id),
      label: `${d.name} • ${d.vehicleType}`,
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zone) return;
    if (!driverId) {
      setError("Please choose a driver");
      return;
    }
    onConfirm(zone.id, Number(driverId));
    onOpenChange(false);
  };

  if (!zone) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-[480px]"
      >
        {isDropdownOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              Dispatch
            </DialogTitle>
          </div>

          {/* Body */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col">
              <Label
                htmlFor="assign-driver"
                className="mb-2.5 text-[16px] font-medium text-black"
              >
                Assign Driver<span className="text-[#C90000]">*</span>
              </Label>
              <DropdownSelect
                options={driverOptions}
                selected={driverId}
                onSelect={(value) => {
                  setDriverId(value);
                  if (error) setError("");
                }}
                onOpenChange={setIsDropdownOpen}
                placeholder="Assign Driver"
                align="start"
                className="md:w-full"
                contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
              />
              {error && (
                <p className="mt-1.5 text-[13px] text-[#C90000]">{error}</p>
              )}
            </div>
          </form>

          {/* Sticky footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: "Cancel",
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
                Execute Dispatch
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchDialog;
