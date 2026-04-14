import { useState, useEffect } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/shared/components/ui/custom-dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { Location, LocationStatus } from "../types";

interface EditZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location | null;
  onSave: (location: Location) => void;
}

const EditZoneDialog = ({
  open,
  onOpenChange,
  location,
  onSave,
}: EditZoneDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    deliveryFee: "",
    minOrderAmount: "",
    status: "available" as LocationStatus,
  });

  // Initialize form with location data when dialog opens
  useEffect(() => {
    if (location && open) {
      setFormData({
        name: location.name,
        deliveryFee: String(location.deliveryFee),
        minOrderAmount: String(location.minOrderAmount),
        status: location.status,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.id, open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.deliveryFee ||
      !formData.minOrderAmount ||
      !location
    ) {
      alert("Please fill in all fields");
      return;
    }

    onSave({
      id: location.id,
      name: formData.name,
      deliveryFee: parseFloat(formData.deliveryFee),
      minOrderAmount: parseFloat(formData.minOrderAmount),
      status: formData.status,
    });

    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent showCloseButton={false}>
        <CustomDialogHeader>
          <CustomDialogTitle>Edit Zone</CustomDialogTitle>
        </CustomDialogHeader>

        <div className="flex flex-col gap-6">
          {/* Zone Name / Area */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Zone Name / Area <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              placeholder="e.g. Kafr Abdo, Semouha"
              value={formData.name}
              onChange={handleInputChange}
              className="px-4 py-2 h-10"
            />
          </div>

          {/* Delivery Fee and Min Order Amount - Side by side */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium">
                Delivery Fee (EGP) <span className="text-red-500">*</span>
              </label>
              <Input
                name="deliveryFee"
                type="number"
                placeholder="0"
                value={formData.deliveryFee}
                onChange={handleInputChange}
                className="px-4 py-2 h-10"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium">
                Min. Order (EGP) <span className="text-red-500">*</span>
              </label>
              <Input
                name="minOrderAmount"
                type="number"
                placeholder="0"
                value={formData.minOrderAmount}
                onChange={handleInputChange}
                className="px-4 py-2 h-10"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="h-10 w-full rounded-lg border border-input bg-transparent px-4 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
            >
              <option value="available">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-200 my-6" />

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleCancel}
            variant="outline"
            className=" px-7.5 py-4 h-14 border-primary text-primary font-semibold rounded-[5px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="text-white font-semibold px-7.5 py-4 h-14 rounded-[5px]"
          >
            Save Zone
          </Button>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
};

export default EditZoneDialog;
