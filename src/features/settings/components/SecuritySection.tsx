import { useState } from "react";
import { KeyRound } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import SectionCard from "./SectionCard";
import type { PasswordFormData } from "../types";

const INITIAL: PasswordFormData = {
  currentPassword: "",
  newPassword: "",
};

const SecuritySection = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<PasswordFormData>(INITIAL);
  const [isSaving, setIsSaving] = useState(false);

  const set = (key: keyof PasswordFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleUpdatePassword = async () => {
    if (!form.currentPassword || form.newPassword.length < 6) {
      showErrorToast(t("Enter your current password and a new password of at least 6 characters"));
      return;
    }
    setIsSaving(true);
    try {
      await api.put("/users/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      showSuccessToast(t("Password updated successfully"));
      setForm(INITIAL);
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || t("Failed to update password"));
    } finally {
      setIsSaving(false);
    }
  };

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
          <DefaultButton
            data={{
              buttonText: isSaving ? t("Updating...") : t("Update Password"),
              onClick: handleUpdatePassword,
              disabled: isSaving,
            }}
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default SecuritySection;
