import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import {
  DRIVER_STATUS_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
} from "../data";
import type {
  Driver,
  DriverFormData,
  DriverStatus,
  VehicleType,
} from "../types";

const FORM_ID = "driver-form";

const INITIAL_FORM: DriverFormData = {
  name: "",
  whatsappPhone: "",
  vehicleType: "Motorcycle",
  status: "Active",
};

interface AddDriverDialogProps {
  open: boolean;
  driver?: Driver;
  onOpenChange: (open: boolean) => void;
  onSave: (data: DriverFormData, id?: number) => void;
}

const AddDriverDialog = ({
  open,
  driver,
  onOpenChange,
  onSave,
}: AddDriverDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<DriverFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DriverFormData, string>>
  >({});
  const [openDropdown, setOpenDropdown] = useState<
    "vehicle" | "status" | null
  >(null);

  useEffect(() => {
    if (open) {
      if (driver) {
        setForm({
          name: driver.name,
          whatsappPhone: driver.whatsappPhone,
          vehicleType: driver.vehicleType,
          status: driver.status,
        });
      } else {
        setForm(INITIAL_FORM);
      }
      setErrors({});
      setOpenDropdown(null);
    }
  }, [open, driver]);

  const set = <K extends keyof DriverFormData>(
    key: K,
    value: DriverFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof DriverFormData, string>> = {};
    if (!form.name.trim()) next.name = t("Driver name is required");
    if (!form.whatsappPhone.trim())
      next.whatsappPhone = t("WhatsApp phone is required");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, driver?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-140"
      >
        {openDropdown && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {driver ? t("Edit Driver") : t("Add Driver")}
            </DialogTitle>
          </div>

          {/* Scrollable body */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <InputField
                  data={{
                    id: "driver-name",
                    label: {
                      htmlFor: "driver-name",
                      labelText: t("Driver Name"),
                    },
                    placeholder: t("Driver Name"),
                    required: true,
                    inputProps: {
                      value: form.name,
                      onChange: (e) => set("name", e.target.value),
                    },
                  }}
                />
                {errors.name && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <InputField
                  data={{
                    id: "whatsapp-phone",
                    label: {
                      htmlFor: "whatsapp-phone",
                      labelText: t("Whatsapp Phone"),
                    },
                    type: "tel",
                    placeholder: "+20...",
                    required: true,
                    inputProps: {
                      value: form.whatsappPhone,
                      onChange: (e) =>
                        set("whatsappPhone", e.target.value),
                    },
                  }}
                />
                {errors.whatsappPhone && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.whatsappPhone}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="vehicle-type"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Vehicle Type")}<span className="text-[#C90000]">*</span>
                </Label>
                <DropdownSelect
                  options={VEHICLE_TYPE_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
                  selected={form.vehicleType}
                  onSelect={(value) =>
                    set("vehicleType", value as VehicleType)
                  }
                  onOpenChange={(o) =>
                    setOpenDropdown(o ? "vehicle" : null)
                  }
                  placeholder={t("Select vehicle type")}
                  align="start"
                  className="md:w-full"
                  contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                />
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="driver-status"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Status")}<span className="text-[#C90000]">*</span>
                </Label>
                <DropdownSelect
                  options={DRIVER_STATUS_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
                  selected={form.status}
                  onSelect={(value) =>
                    set("status", value as DriverStatus)
                  }
                  onOpenChange={(o) =>
                    setOpenDropdown(o ? "status" : null)
                  }
                  placeholder={t("Select status")}
                  align="start"
                  className="md:w-full"
                  contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                />
              </div>
            </div>
          </form>

          {/* Sticky footer */}
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
                {driver ? t("Update Driver") : t("Save Driver")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverDialog;
