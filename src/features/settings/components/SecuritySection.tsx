import { useState } from "react";
import { KeyRound } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import InputField from "@/shared/components/InputField";
import SectionCard from "./SectionCard";
import type { PasswordFormData } from "../types";

const INITIAL: PasswordFormData = {
  currentPassword: "",
  newPassword: "",
};

const SecuritySection = () => {
  const [form, setForm] = useState<PasswordFormData>(INITIAL);

  const set = (key: keyof PasswordFormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <SectionCard
      icon={<KeyRound size={32} />}
      title="Security"
      subtitle="Change your password"
    >
      <div className="flex h-full flex-col gap-5">
        <InputField
          data={{
            id: "current-password",
            label: {
              htmlFor: "current-password",
              labelText: "Current Password",
            },
            placeholder: "Current Password",
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
            label: { htmlFor: "new-password", labelText: "New Password" },
            placeholder: "Minimal 6 characters",
            inputProps: {
              type: "password",
              value: form.newPassword,
              onChange: (e) => set("newPassword", e.target.value),
            },
          }}
        />
        <div className="mt-auto flex justify-end">
          <DefaultButton data={{ buttonText: "Update Password" }} />
        </div>
      </div>
    </SectionCard>
  );
};

export default SecuritySection;
