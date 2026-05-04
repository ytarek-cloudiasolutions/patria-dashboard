import { useState } from "react";
import { Settings } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
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
    <Card className="py-0 rounded-[16px] border border-[#E5E5E5] shadow-sm">
      <CardContent className="px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#28293D] text-[16px] font-semibold">
            Account Settings
          </h2>
          <button className="text-[#8B8B8B] hover:text-[#28293D] transition-colors">
            <Settings size={18} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-5">
          <InputField
            data={{
              id: "fullName",
              label: { htmlFor: "fullName", labelText: "Full Name" },
              placeholder: "Super Admin",
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
              inputProps: {
                onChange: handleChange("shipmentAddress"),
                value: formData.shipmentAddress,
              },
            }}
          />
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <DefaultButton
            data={{
              buttonText: "Save Changes",
              icon: (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              ),
              onClick: handleSave,
              className: "w-full bg-[#8B6914] hover:bg-[#7A5C10] text-white",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettingsForm;
