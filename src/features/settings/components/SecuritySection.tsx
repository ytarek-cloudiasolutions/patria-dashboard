import { useState } from "react";
import { KeyRound } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import SectionCard from "./SectionCard";
import type { PasswordFormData } from "../types";

const INITIAL: PasswordFormData = {
  currentPassword: "",
  newPassword: "",
};

const SecuritySection = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<PasswordFormData>(INITIAL);

  const set = (key: keyof PasswordFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <SectionCard
      icon={<KeyRound size={32} />}
      title={t("Security")}
      subtitle={t("Change your password")}
    >
      <div className="flex h-full flex-col gap-5">
        <InputField
          data={{
            id: "current-password",
            label: {
              htmlFor: "current-password",
              labelText: t("Current Password"),
            },
            placeholder: t("Current Password"),
            inputProps: {
              type: "password",
              value: form.currentPassword,
              onChange: (e) => set("currentPassword", e.target.value),
            },
          }}
        />
        <InputField
          data={{
            id: "new-password",
            label: { htmlFor: "new-password", labelText: t("New Password") },
            placeholder: t("Minimal 6 characters"),
            inputProps: {
              type: "password",
              value: form.newPassword,
              onChange: (e) => set("newPassword", e.target.value),
            },
          }}
        />
        <div className="mt-auto flex justify-end">
          <DefaultButton data={{ buttonText: t("Update Password") }} />
        </div>
      </div>
    </SectionCard>
  );
};

export default SecuritySection;
