import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DefaultButton from "@/shared/components/DefaultButton";
import { Label } from "@/shared/components/ui/label";

import { cn } from "@/lib/utils";
import type { DispatchPayload, Driver, Zone } from "../types";

interface DispatchModalProps {
  open: boolean;
  zone: Zone | null;
  drivers: Driver[];
  onClose: () => void;
  onDispatch: (payload: DispatchPayload) => void;
}

const DispatchModal = ({
  open,
  zone,
  drivers,
  onClose,
  onDispatch,
}: DispatchModalProps) => {
  const [selectedDriverId, setSelectedDriverId] = useState<number | "">("");

  const handleDispatch = () => {
    if (!zone || selectedDriverId === "") return;
    onDispatch({ zone, driverId: selectedDriverId as number });
    setSelectedDriverId("");
    onClose();
  };

  const handleClose = () => {
    setSelectedDriverId("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className="sm:max-w-174 rounded-[16px] p-8"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#28293D]">
            Dispatch
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label className="text-[16px] font-medium text-[#000000]">
            Assign Driver
            <span className="ml-1 text-[#C90000]">*</span>
          </Label>
          <div className="relative">
            <select
              value={selectedDriverId}
              onChange={(e) =>
                setSelectedDriverId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className={cn(
                "h-12.5 w-full appearance-none rounded-[12px] border border-[#E5E5E5] bg-white p-3 pr-10",
                "text-[16px] outline-none focus:border-primary",
                selectedDriverId === "" ? "text-[#8B8B8B]" : "text-[#23252A]"
              )}
            >
              <option value="">Assign Driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B8B]">
              ▾
            </span>
          </div>
        </div>

        <hr className="border-[#E5E5E5]" />

        <div className="flex justify-end gap-3">
          <DefaultButton
            data={{
              buttonText: "Cancel",
              variant: "outline",
              className: "border-[#E5E5E5] text-[#28293D] hover:bg-[#F8F7F4]",
              onClick: handleClose,
            }}
          />
          <DefaultButton
            data={{
              buttonText: "Execute Dispatch",
              className: "bg-[#5C4A0E] hover:bg-[#4A3A08]",
              onClick: handleDispatch,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DispatchModal;
