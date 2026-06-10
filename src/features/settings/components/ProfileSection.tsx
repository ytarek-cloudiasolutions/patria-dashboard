import { useState } from "react";
import { User } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import SectionCard from "./SectionCard";
import type { ProfileFormData } from "../types";

const INITIAL: ProfileFormData = {
  displayName: "Super Admin",
  email: "admin@erb.com",
  phone: "",
};

const ProfileSection = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<ProfileFormData>(INITIAL);

  const set = (key: keyof ProfileFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <SectionCard
      icon={<User size={32} />}
      title={t("Profile Information")}
      subtitle={t("Update your name, email, and phone number")}
    >
      <div className="flex h-full flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField
            data={{
              id: "display-name",
              label: { htmlFor: "display-name", labelText: t("Display Name") },
              placeholder: t("Display Name"),
              inputProps: {
                value: form.displayName,
                onChange: (e) => set("displayName", e.target.value),
              },
            }}
          />
          <InputField
            data={{
              id: "profile-email",
              label: { htmlFor: "profile-email", labelText: t("Email Address") },
              placeholder: "admin@erb.com",
              inputProps: {
                type: "email",
                value: form.email,
                onChange: (e) => set("email", e.target.value),
              },
            }}
          />
        </div>
        <InputField
          data={{
            id: "profile-phone",
            label: { htmlFor: "profile-phone", labelText: t("Phone Number") },
            placeholder: "e.g. 0123456789",
            inputProps: {
              value: form.phone,
              onChange: (e) => set("phone", e.target.value),
            },
          }}
        />
        <div className="mt-auto flex justify-end">
          <DefaultButton data={{ buttonText: t("Save changes") }} />
        </div>
      </div>
    </SectionCard>
  );
};

export default ProfileSection;
