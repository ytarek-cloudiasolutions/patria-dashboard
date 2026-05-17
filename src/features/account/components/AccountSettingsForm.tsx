import { useState } from "react";
import { Save, Settings } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import type { AccountSettingsProps, AccountFormData } from "../types";

const AccountSettingsForm = ({ data, onSave }: AccountSettingsProps) => {
  const [formData, setFormData] = useState<AccountFormData>(data);

  const handleChange =
    (field: keyof AccountFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <section className="overflow-hidden rounded-[16px] border border-[#E1E1E5] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="flex h-[52px] items-center justify-between bg-[#F5F0EA] px-[18px]">
        <h2 className="text-[18px] font-semibold text-[#333333]">
          Account Settings
        </h2>
        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-[8px] text-[#000000] transition-colors hover:bg-white/70"
        >
          <Settings size={21} strokeWidth={2.2} />
        </button>
      </div>

      <div className="px-[17px] pb-[25px] pt-[27px]">
        <div className="flex flex-col gap-[13px]">
          <InputField
            data={{
              id: "fullName",
              label: { htmlFor: "fullName", labelText: "Full Name" },
              placeholder: "Super Admin",
              className:
                "h-[53px] rounded-[12px] px-[14px] text-[16px] placeholder:text-[#9B9B9B]",
              inputProps: {
                onChange: handleChange("fullName"),
                value: formData.fullName,
              },
            }}
          />

          <InputField
            data={{
              id: "email",
              type: "email",
              label: { htmlFor: "email", labelText: "Email Address" },
              placeholder: "admin@er.com",
              className:
                "h-[53px] rounded-[12px] px-[14px] text-[16px] placeholder:text-[#9B9B9B]",
              inputProps: {
                onChange: handleChange("email"),
                value: formData.email,
              },
            }}
          />

          <InputField
            data={{
              id: "phoneNumber",
              type: "tel",
              label: { htmlFor: "phoneNumber", labelText: "Phone Number" },
              placeholder: "01X XXXX XXXX",
              className:
                "h-[53px] rounded-[12px] px-[14px] text-[16px] placeholder:text-[#9B9B9B]",
              inputProps: {
                onChange: handleChange("phoneNumber"),
                value: formData.phoneNumber,
              },
            }}
          />

          <InputField
            data={{
              id: "shipmentAddress",
              label: {
                htmlFor: "shipmentAddress",
                labelText: "Shipment Address",
              },
              placeholder: "Address in details...",
              className:
                "h-[53px] rounded-[12px] px-[14px] text-[16px] placeholder:text-[#9B9B9B]",
              inputProps: {
                onChange: handleChange("shipmentAddress"),
                value: formData.shipmentAddress,
              },
            }}
          />
        </div>

        <div className="mt-[25px]">
          <DefaultButton
            data={{
              buttonText: "Save Changes",
              icon: <Save className="size-[18px]" />,
              onClick: handleSave,
              className:
                "h-[60px] w-full rounded-[5px] bg-primary text-[17px] font-semibold text-white hover:bg-[#7A5C10]",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default AccountSettingsForm;
