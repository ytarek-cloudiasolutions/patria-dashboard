import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import type { LocationStatus, ZoneFormProps } from "../types";
import InputField from "@/shared/components/InputField";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import { Label } from "@/shared/components/ui/label";

const STATUS_OPTIONS: { label: string; value: LocationStatus }[] = [
  { label: "Active", value: "available" },
  { label: "Inactive", value: "inactive" },
];

const ZoneForm = ({ initialData, onSave, onCancel }: ZoneFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    deliveryFee: initialData ? String(initialData.deliveryFee) : "",
    minOrderAmount: initialData ? String(initialData.minOrderAmount) : "",
    status: initialData?.status ?? ("available" as LocationStatus),
  });

  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.deliveryFee ||
      !formData.minOrderAmount
    ) {
      return;
    }

    onSave({
      name: formData.name,
      deliveryFee: parseFloat(formData.deliveryFee),
      minOrderAmount: parseFloat(formData.minOrderAmount),
      status: formData.status,
    });
  };

  return (
    <form className="flex flex-col gap-8 p-2.5">
      <InputField
        data={{
          id: "name",
          placeholder: "e.g. Kafr Abdo, Semouha",
          required: true,
          label: { htmlFor: "name", labelText: "Zone Name / Area" },
          inputProps: {
            name: "name",
            value: formData.name,
            onChange: handleInputChange,
          },
        }}
      />

      <div className="grid grid-cols-2 gap-6">
        <InputField
          data={{
            id: "deliveryFee",
            type: "number",
            placeholder: "0",
            required: true,
            label: {
              htmlFor: "deliveryFee",
              labelText: "Delivery Fee (EGP)",
            },
            inputProps: {
              name: "deliveryFee",
              value: formData.deliveryFee,
              onChange: handleInputChange,
              min: "0",
              step: "0.01",
            },
          }}
        />
        <InputField
          data={{
            id: "minOrderAmount",
            type: "number",
            placeholder: "0",
            required: true,
            label: {
              htmlFor: "minOrderAmount",
              labelText: "Min. Order (EGP)",
            },
            inputProps: {
              name: "minOrderAmount",
              value: formData.minOrderAmount,
              onChange: handleInputChange,
              min: "0",
              step: "0.01",
            },
          }}
        />
      </div>

      {/* Status — outside the overlay wrapper */}
      <div className="flex flex-col gap-2.5">
        <Label className="text-[#000000] text-[16px] font-medium block">
          Status <span className="text-[#C90000] ml-1">*</span>
        </Label>
        <DropdownMenu onOpenChange={setIsStatusOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12.5 w-full justify-between rounded-lg border-input bg-white px-4 py-2 text-base font-normal cursor-pointer focus-visible:border-input focus-visible:ring-0"
            >
              {STATUS_OPTIONS.find((o) => o.value === formData.status)?.label}
              <ChevronDown className="size-6 text-[#000000]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
            className="z-50 h-27.5 rounded-[16px] px-2 py-3 [&>[data-slot=dropdown-menu-item]+[data-slot=dropdown-menu-item]]:mt-2"
          >
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className={
                  formData.status === option.value
                    ? "rounded-[16px] px-3 py-2 text-[12px] font-medium bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                    : "rounded-[16px] px-3 py-2 text-[12px]"
                }
                onSelect={() =>
                  setFormData((prev) => ({ ...prev, status: option.value }))
                }
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator className="bg-[#CACBD4]" />

      <div className="flex gap-4 justify-end">
        <DefaultButton
          data={{
            buttonText: "Cancel",
            variant: "outline",
            type: "button", 
            onClick: onCancel,
            className:
              "text-primary border-primary hover:bg-white hover:text-primary",
          }}
        />
        <DefaultButton
          data={{
            buttonText: "Save Zone",
            type: "button", 
            onClick: handleSave,
          }}
        />
      </div>
    </form>
  );
};

export default ZoneForm;
