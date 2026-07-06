import { useEffect, useState } from "react";
import InputField from "@/shared/components/InputField";
import DropdownSelect from "@/shared/components/DropdownSelect";
import { Label } from "@/shared/components/ui/label";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { DeliveryZone, ZoneFormData, ZoneStatus } from "../types";

interface AddZoneFormProps {
  id: string;
  editingZone?: DeliveryZone;
  onSubmit: (data: ZoneFormData, id?: string) => void;
  onDropdownOpenChange?: (open: boolean) => void;
}

const INITIAL_FORM: ZoneFormData = {
  name: "",
  deliveryFee: "",
  minOrderAmount: "",
  status: "Active",
};

const AddZoneForm = ({
  id,
  editingZone,
  onSubmit,
  onDropdownOpenChange,
}: AddZoneFormProps) => {
  const { t } = useTranslation();

  const statusOptions: { label: string; value: ZoneStatus }[] = [
    { label: t("Active"), value: "Active" },
    { label: t("Inactive"), value: "Inactive" },
  ];

  const [form, setForm] = useState<ZoneFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ZoneFormData, string>>>({});

  useEffect(() => {
    if (editingZone) {
      setForm({
        name: editingZone.name,
        deliveryFee: String(editingZone.deliveryFee),
        minOrderAmount: String(editingZone.minOrderAmount),
        status: editingZone.status,
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [editingZone]);

  const set = <K extends keyof ZoneFormData>(key: K, value: ZoneFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof ZoneFormData, string>> = {};
    if (!form.name.trim()) next.name = t("Zone name is required");
    if (!form.deliveryFee.trim()) {
      next.deliveryFee = t("Delivery fee is required");
    } else if (isNaN(Number(form.deliveryFee)) || Number(form.deliveryFee) < 0) {
      next.deliveryFee = t("Enter a valid amount");
    }
    if (!form.minOrderAmount.trim()) {
      next.minOrderAmount = t("Min. order is required");
    } else if (
      isNaN(Number(form.minOrderAmount)) ||
      Number(form.minOrderAmount) < 0
    ) {
      next.minOrderAmount = t("Enter a valid amount");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form, editingZone?.id);
  };

  return (
    <form id={id} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <InputField
          data={{
            id: "zone-name",
            label: { htmlFor: "zone-name", labelText: t("Zone Name / Area") },
            placeholder: t("e.g. Kafr Abdo, Semouha"),
            required: true,
            inputProps: {
              value: form.name,
              onChange: (e) => set("name", e.target.value),
            },
          }}
        />
        {errors.name && (
          <p className="mt-1 text-[13px] text-[#C90000]">{errors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <InputField
            data={{
              id: "delivery-fee",
              label: { htmlFor: "delivery-fee", labelText: t("Delivery Fee (EGP)") },
              placeholder: "0",
              required: true,
              inputProps: {
                type: "number",
                min: "0",
                value: form.deliveryFee,
                onChange: (e) => set("deliveryFee", e.target.value),
              },
            }}
          />
          {errors.deliveryFee && (
            <p className="mt-1 text-[13px] text-[#C90000]">{errors.deliveryFee}</p>
          )}
        </div>

        <div>
          <InputField
            data={{
              id: "min-order",
              label: { htmlFor: "min-order", labelText: t("Min. Order (EGP)") },
              placeholder: "0",
              required: true,
              inputProps: {
                type: "number",
                min: "0",
                value: form.minOrderAmount,
                onChange: (e) => set("minOrderAmount", e.target.value),
              },
            }}
          />
          {errors.minOrderAmount && (
            <p className="mt-1 text-[13px] text-[#C90000]">
              {errors.minOrderAmount}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <Label
          htmlFor="zone-status"
          className="mb-2.5 text-[16px] font-medium text-black"
        >
          {t("Status")}<span className="text-[#C90000]">*</span>
        </Label>
        <DropdownSelect
          options={statusOptions}
          selected={form.status}
          onSelect={(value) => set("status", value as ZoneStatus)}
          onOpenChange={onDropdownOpenChange}
          placeholder={t("Select status")}
          align="start"
          className="md:w-full"
          contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
        />
      </div>
    </form>
  );
};

export default AddZoneForm;
