import { useEffect, useState } from "react";
import { User } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { api } from "@/config/api";
import { showErrorToast, showSuccessToast } from "@/shared/utils/toast";
import SectionCard from "./SectionCard";
import type { ProfileFormData } from "../types";

const EMPTY: ProfileFormData = {
  displayName: "",
  email: "",
  phone: "",
};

interface ProfileSectionProps {
  onSaved?: (data: { name: string; role: string }) => void;
}

const ProfileSection = ({ onSaved }: ProfileSectionProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<ProfileFormData>(EMPTY);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Was hardcoded to "Super Admin" / "admin@erb.com" for every user —
  // load whoever is actually logged in.
  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        setUserId(data._id ?? null);
        setRole(data.role ?? "");
        setForm({
          displayName: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
        });
      })
      .catch(() => {});
  }, []);

  const set = (key: keyof ProfileFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      await api.put(`/users/${userId}`, {
        name: form.displayName,
        email: form.email,
        phone: form.phone || undefined,
      });
      showSuccessToast(t("Profile updated successfully"));
      onSaved?.({ name: form.displayName, role });
    } catch (err: any) {
      showErrorToast(err?.response?.data?.message ?? t("Failed to update profile"));
    } finally {
      setIsSaving(false);
    }
  };

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
          <DefaultButton
            data={{
              buttonText: isSaving ? t("Saving...") : t("Save changes"),
              onClick: handleSave,
              disabled: isSaving,
            }}
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default ProfileSection;
