import { Save, Settings } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
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
}: AccountSettingsCardProps) => {
  const { t } = useTranslation();
  return (
    <Card className="group/card gap-0 overflow-hidden rounded-[16px] border border-[#E5E5E5] bg-white py-0 ring-0 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between bg-[#F5F0EA] px-5 py-4 sm:px-6">
        <h3 className="text-[16px] font-bold text-[#333333]">{t("Account Settings")}</h3>
        <Settings size={20} className="text-[#28293D] transition-transform duration-300 group-hover/card:rotate-45" />
      </div>
      <CardContent className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
        <InputField
          data={{
            id: "account-name",
            label: { htmlFor: "account-name", labelText: t("Full Name") },
            placeholder: t("Full Name"),
            inputProps: {
              value: form.fullName,
              onChange: (e) => onChange("fullName", e.target.value),
            },
          }}
        />
        <InputField
          data={{
            id: "account-email",
            label: { htmlFor: "account-email", labelText: t("Email Address") },
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
            label: { htmlFor: "account-phone", labelText: t("Phone Number") },
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
            label: { htmlFor: "account-address", labelText: t("Shipment Address") },
            placeholder: t("Address in details..."),
            inputProps: {
              value: form.shipmentAddress,
              onChange: (e) => onChange("shipmentAddress", e.target.value),
            },
          }}
        />
        <Button
          type="button"
          onClick={onSave}
          className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] text-[15px] font-semibold text-white sm:h-13 transition-all duration-200 hover:shadow-xs active:scale-[0.98]"
        >
          <Save className="size-4.5 transition-transform duration-200 group-hover:scale-110" />
          {t("Save Changes")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountSettingsCard;
