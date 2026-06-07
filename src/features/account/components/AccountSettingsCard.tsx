import { Save, Settings } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import InputField from "@/shared/components/InputField";
import type { AccountFormData } from "../types";

interface AccountSettingsCardProps {
  form: AccountFormData;
  onChange: (key: keyof AccountFormData, value: string) => void;
  onSave: () => void;
}

const AccountSettingsCard = ({
  form,
  onChange,
  onSave,
}: AccountSettingsCardProps) => (
  <Card className="gap-0 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm">
    <div className="flex items-center justify-between bg-[#F5F0EA] px-5 py-4 sm:px-6">
      <h3 className="text-[16px] font-bold text-[#333333]">Account Settings</h3>
      <Settings size={20} className="text-[#28293D]" />
    </div>
    <CardContent className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
      <InputField
        data={{
          id: "account-name",
          label: { htmlFor: "account-name", labelText: "Full Name" },
          placeholder: "Super Admin",
          inputProps: {
            value: form.fullName,
            onChange: (e) => onChange("fullName", e.target.value),
          },
        }}
      />
      <InputField
        data={{
          id: "account-email",
          label: { htmlFor: "account-email", labelText: "Email Address" },
          placeholder: "admin@er.com",
          inputProps: {
            type: "email",
            value: form.email,
            onChange: (e) => onChange("email", e.target.value),
          },
        }}
      />
      <InputField
        data={{
          id: "account-phone",
          label: { htmlFor: "account-phone", labelText: "Phone Number" },
          placeholder: "01X XXXX XXXX",
          inputProps: {
            value: form.phone,
            onChange: (e) => onChange("phone", e.target.value),
          },
        }}
      />
      <InputField
        data={{
          id: "account-address",
          label: { htmlFor: "account-address", labelText: "Shipment Address" },
          placeholder: "Address in details...",
          inputProps: {
            value: form.shipmentAddress,
            onChange: (e) => onChange("shipmentAddress", e.target.value),
          },
        }}
      />
      <Button
        type="button"
        onClick={onSave}
        className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] text-[15px] font-semibold text-white sm:h-13"
      >
        <Save className="size-4.5" />
        Save Changes
      </Button>
    </CardContent>
  </Card>
);

export default AccountSettingsCard;
