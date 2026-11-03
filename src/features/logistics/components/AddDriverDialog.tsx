import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import { useLocations } from "@/features/locations/hooks/useLocations";
import { cn } from "@/lib/utils";
import { normalizeWhatsAppPhone } from "../utils";
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
const WHATSAPP_PHONE_REGEX = /^(\d{11}|\+\d{10,14})$/;

const INITIAL_FORM: DriverFormData = {
  name: "",
  whatsappPhone: "",
  password: "",
  vehicleType: "Motorcycle",
  plateNumber: "",
  hourlyRate: "",
  zones: [],
  status: "Active",
};

interface AddDriverDialogProps {
  open: boolean;
  driver?: Driver;
  onOpenChange: (open: boolean) => void;
  onSave: (data: DriverFormData, id?: string | number) => void;
  onRemove?: (driver: Driver) => void;
}

const AddDriverDialog = ({
  open,
  driver,
  onOpenChange,
  onSave,
  onRemove,
}: AddDriverDialogProps) => {
  const { t } = useTranslation();
  const { locations, getLocations, isFetchingLocations } = useLocations();
  const [form, setForm] = useState<DriverFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DriverFormData, string>>
  >({});
  const [openDropdown, setOpenDropdown] = useState<
    "vehicle" | "status" | "zones" | null
  >(null);

  const zoneOptions = useMemo(() => {
    const names = locations
      .map((loc) => loc.name?.trim())
      .filter((name): name is string => Boolean(name));
    return Array.from(new Set(names));
  }, [locations]);

  useEffect(() => {
    if (open) {
      getLocations();
      if (driver) {
        setForm({
          name: driver.name,
          whatsappPhone: driver.whatsappPhone,
          password: "",
          vehicleType: driver.vehicleType,
          plateNumber: driver.plateNumber ?? "",
          hourlyRate: driver.hourlyRate ? String(driver.hourlyRate) : "",
          zones: driver.zones,
          status: driver.status,
        });
      } else {
        setForm(INITIAL_FORM);
      }
      setErrors({});
      setOpenDropdown(null);
    }
  }, [open, driver, getLocations]);

  const set = <K extends keyof DriverFormData>(
    key: K,
    value: DriverFormData[K],
  ) => {
    if (key === "whatsappPhone" && typeof value === "string") {
      const normalized = normalizeWhatsAppPhone(value);
      setForm((prev) => ({ ...prev, whatsappPhone: normalized }));
      if (errors.whatsappPhone && WHATSAPP_PHONE_REGEX.test(normalized)) {
        setErrors((prev) => ({ ...prev, whatsappPhone: "" }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));

    if (key === "password" && typeof value === "string") {
      const trimmedPassword = value.trim();
      setErrors((prev) => ({
        ...prev,
        password:
          trimmedPassword && trimmedPassword.length < 6
            ? t("Password must be at least 6 characters")
            : "",
      }));
      return;
    }

    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleZone = (zone: string) => {
    setForm((prev) => ({
      ...prev,
      zones: prev.zones.includes(zone)
        ? prev.zones.filter((z) => z !== zone)
        : [...prev.zones, zone],
    }));
    if (errors.zones) setErrors((prev) => ({ ...prev, zones: "" }));
  };

  const validate = (normalizedPhone: string) => {
    const next: Partial<Record<keyof DriverFormData, string>> = {};
    const trimmedPassword = form.password.trim();

    if (!form.name.trim()) next.name = t("Driver name is required");
    if (!normalizedPhone) {
      next.whatsappPhone = t("WhatsApp phone is required");
    } else if (!WHATSAPP_PHONE_REGEX.test(normalizedPhone)) {
      next.whatsappPhone = t(
        "Invalid WhatsApp phone number — must be 11 digits (or + and 10-14 digits for international)",
      );
    }

    if (!driver && !trimmedPassword) {
      next.password = t("Password is required");
    } else if (trimmedPassword && trimmedPassword.length < 6) {
      next.password = t("Password must be at least 6 characters");
    }

    if (form.zones.length === 0) next.zones = t("Select at least one zone");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = normalizeWhatsAppPhone(form.whatsappPhone);
    if (normalizedPhone !== form.whatsappPhone) {
      setForm((prev) => ({ ...prev, whatsappPhone: normalizedPhone }));
    }
    if (!validate(normalizedPhone)) return;
    onSave({ ...form, whatsappPhone: normalizedPhone }, driver?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        style={{ width: "100%", maxWidth: 620 }}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] sm:w-[620px] max-w-[calc(100vw-2rem)] sm:max-w-xl min-w-0 grid-cols-1 overflow-hidden rounded-[16px] bg-white p-0 ring-0"
      >
        <div className="flex w-full min-w-0 max-h-[calc(100vh-2rem)] flex-col overflow-hidden">
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
            className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-5 min-w-0">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 min-w-0">
                <div className="min-w-0">
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
                    <p className="mt-1 text-[13px] text-[#C90000] animate-in fade-in-0 slide-in-from-top-1 duration-150">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="min-w-0">
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
                        onChange: (e) => set("whatsappPhone", e.target.value),
                        onBlur: () => {
                          const normalized = normalizeWhatsAppPhone(
                            form.whatsappPhone,
                          );
                          if (normalized !== form.whatsappPhone) {
                            setForm((prev) => ({
                              ...prev,
                              whatsappPhone: normalized,
                            }));
                          }
                        },
                      },
                    }}
                  />
                  {errors.whatsappPhone && (
                    <p className="mt-1 text-[13px] text-[#C90000] animate-in fade-in-0 slide-in-from-top-1 duration-150">
                      {errors.whatsappPhone}
                    </p>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <InputField
                  data={{
                    id: "driver-password",
                    label: {
                      htmlFor: "driver-password",
                      labelText: driver
                        ? `${t("Password")} ${t("(leave it blank if you don't want to change it)")}`
                        : t("Password"),
                    },
                    type: "password",
                    placeholder: "••••••••",
                    required: !driver,
                    inputProps: {
                      value: form.password,
                      onChange: (e) => set("password", e.target.value),
                    },
                  }}
                />
                {errors.password && (
                  <p className="mt-1 text-[13px] text-[#C90000] animate-in fade-in-0 slide-in-from-top-1 duration-150">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 min-w-0">
                <div className="flex flex-col min-w-0">
                  <Label className="mb-2.5 text-[16px] font-medium text-black">
                    {t("Vehicle Type")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={VEHICLE_TYPE_OPTIONS.map((o) => ({
                      ...o,
                      label: t(o.label),
                    }))}
                    selected={form.vehicleType}
                    onSelect={(value) => set("vehicleType", value as VehicleType)}
                    onOpenChange={(o) => setOpenDropdown(o ? "vehicle" : null)}
                    placeholder={t("Select vehicle type")}
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                </div>

                <div className="min-w-0">
                  <InputField
                    data={{
                      id: "plate-number",
                      label: {
                        htmlFor: "plate-number",
                        labelText: t("Plate Number"),
                      },
                      placeholder: "ABCD 1234",
                      required: true,
                      inputProps: {
                        value: form.plateNumber,
                        onChange: (e) => set("plateNumber", e.target.value),
                      },
                    }}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <Label htmlFor="hourly-rate" className="mb-2.5 text-[16px] font-medium text-black">
                  {t("Hourly Rate")}
                </Label>
                <div className="flex h-12 w-full items-center justify-between gap-3 rounded-[12px] border border-[#E5E5E5] bg-white px-4 transition-colors focus-within:border-[#8F6900]">
                  <input
                    id="hourly-rate"
                    type="number"
                    min="0"
                    value={form.hourlyRate ?? ""}
                    onChange={(e) => set("hourlyRate", e.target.value)}
                    className="w-full bg-transparent text-[14px] font-normal text-black placeholder:text-[#8B8B8B] outline-none focus:ring-0 border-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const currentVal = Number(form.hourlyRate || "0") || 0;
                        set("hourlyRate", String(currentVal + 1));
                      }}
                      className="cursor-pointer text-[#8B8B8B] hover:text-black transition-colors"
                    >
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currentVal = Number(form.hourlyRate || "0") || 0;
                        set("hourlyRate", String(Math.max(0, currentVal - 1)));
                      }}
                      className="cursor-pointer text-[#8B8B8B] hover:text-black transition-colors"
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Zones multi-select */}
              <div className="flex flex-col min-w-0">
                <Label className="mb-2.5 text-[16px] font-medium text-black">
                  {t("Zones")}<span className="text-[#C90000]">*</span>
                </Label>
                <DropdownMenu
                  open={openDropdown === "zones"}
                  onOpenChange={(o) => setOpenDropdown(o ? "zones" : null)}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="group min-h-12 h-auto w-full min-w-0 justify-between whitespace-normal rounded-[12px] border-[#E5E5E5] bg-white px-4 py-2.5 text-[14px] font-medium text-[#000000] cursor-pointer transition-all duration-200 hover:bg-[#FAFAF7] hover:border-[#8F6900]/40 data-[state=open]:border-primary"
                    >
                      <span
                        className={cn(
                          "line-clamp-2 min-w-0 flex-1 whitespace-normal break-words text-start leading-snug pe-2",
                          form.zones.length === 0 && "text-[#8B8B8B]",
                        )}
                      >
                        {form.zones.length > 0
                          ? form.zones.join(", ")
                          : t("Select zones")}
                      </span>
                      <ChevronDown className="ml-2 size-5 shrink-0 text-[#000000] transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="z-80 w-[var(--radix-dropdown-menu-trigger-width)] min-w-[var(--radix-dropdown-menu-trigger-width)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white p-2 shadow-xl ring-0"
                  >
                    <div className="mb-1 flex items-center justify-between border-b border-[#F0EEEA] px-2 pb-1.5 pt-0.5">
                      <span className="text-[13px] font-semibold text-[#28293D]">
                        {t("Select zones")}
                      </span>
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(null)}
                        aria-label={t("Close")}
                        className="flex size-6 cursor-pointer items-center justify-center rounded-full text-[#8B8B8B] transition-all duration-150 hover:rotate-90 hover:bg-[#F5F0EA] hover:text-[#28293D] active:scale-90"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {isFetchingLocations && zoneOptions.length === 0 ? (
                        <div className="px-4 py-2.5 text-center text-[13px] font-normal text-[#8B8B8B]">
                          {t("Loading...")}
                        </div>
                      ) : zoneOptions.length === 0 ? (
                        <div className="px-4 py-2.5 text-center text-[14px] font-normal text-[#8B8B8B]">
                          {t("No results found.")}
                        </div>
                      ) : (
                        zoneOptions.map((zone) => {
                          const isChecked = form.zones.includes(zone);
                          return (
                            <DropdownMenuItem
                              key={zone}
                              onSelect={(e) => {
                                e.preventDefault();
                                toggleZone(zone);
                              }}
                              className="flex cursor-pointer items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[14px] text-[#28293D] data-highlighted:bg-[#F5F0EA]"
                            >
                              <div
                                className={`rounded-[10px] p-1 ${isChecked ? "bg-[#624F1C1A]" : ""}`}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  className="pointer-events-none h-5 w-5 rounded-[5.99px] border-[#8F6900] data-checked:text-primary-foreground! [&_[data-slot=checkbox-indicator]]:text-primary-foreground! [&_svg]:text-primary-foreground!"
                                />
                              </div>
                              {t(zone)}
                            </DropdownMenuItem>
                          );
                        })
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                {errors.zones && (
                  <p className="mt-1 text-[13px] text-[#C90000] animate-in fade-in-0 slide-in-from-top-1 duration-150">
                    {errors.zones}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="flex flex-col min-w-0">
                <Label className="mb-2.5 text-[16px] font-medium text-black">
                  {t("Status")}<span className="text-[#C90000]">*</span>
                </Label>
                <DropdownSelect
                  options={DRIVER_STATUS_OPTIONS.map((o) => ({
                    ...o,
                    label: t(o.label),
                  }))}
                  selected={form.status}
                  onSelect={(value) => set("status", value as DriverStatus)}
                  onOpenChange={(o) => setOpenDropdown(o ? "status" : null)}
                  placeholder={t("Select status")}
                  align="start"
                  className="md:w-full"
                  contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                />
              </div>
            </div>
          </form>

          {/* Sticky footer */}
          <div className="w-full min-w-0 bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between min-w-0">
              {driver && onRemove && (
                <DefaultButton
                  data={{
                    buttonText: t("Remove Driver"),
                    type: "button",
                    onClick: () => onRemove(driver),
                    className: "w-full sm:w-auto shrink-0 whitespace-nowrap bg-[#C90000] px-4 sm:px-5 transition-all duration-150 active:scale-[0.98]",
                  }}
                />
              )}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-3 sm:ms-auto shrink-0">
                <DefaultButton
                  data={{
                    buttonText: t("Cancel"),
                    variant: "outline",
                    type: "button",
                    onClick: () => onOpenChange(false),
                    className:
                      "w-full sm:w-auto shrink-0 whitespace-nowrap border-primary text-primary px-4 sm:px-5 hover:bg-white hover:text-primary transition-all duration-150 active:scale-[0.98]",
                  }}
                />
                <Button
                  form={FORM_ID}
                  type="submit"
                  className="flex h-12 w-full shrink-0 whitespace-nowrap cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 sm:px-5.5 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:text-[16px] transition-all duration-150 active:scale-[0.98]"
                >
                  {driver ? t("Update Driver") : t("Add Driver")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverDialog;
