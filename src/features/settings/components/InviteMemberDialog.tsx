import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { PRIVILEGE_ROLE_OPTIONS } from "../data";
import type { InviteFormData, TeamRole } from "../types";

const FORM_ID = "invite-member-form";

const INITIAL_FORM: InviteFormData = {
  name: "",
  email: "",
  phone: "",
  securityCode: "",
  role: "Staff",
};

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: InviteFormData) => void;
}

const InviteMemberDialog = ({
  open,
  onOpenChange,
  onSave,
}: InviteMemberDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<InviteFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof InviteFormData, string>>
  >({});
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setErrors({});
      setIsRoleOpen(false);
    }
  }, [open]);

  const set = <K extends keyof InviteFormData>(
    key: K,
    value: InviteFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof InviteFormData, string>> = {};
    if (!form.name.trim()) next.name = t("Entity name is required");
    if (!form.email.trim()) next.email = t("Email is required");
    if (!form.securityCode.trim() || form.securityCode.length < 6) {
      next.securityCode = t("Minimum 6 characters");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-150"
      >
        {isRoleOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("Issue Professional Access Key")}
            </DialogTitle>
          </div>

          {/* Body */}
          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <InputField
                    data={{
                      id: "entity-name",
                      label: {
                        htmlFor: "entity-name",
                        labelText: t("Entity Official Name"),
                      },
                      placeholder: t("e.g. Staff"),
                      required: true,
                      inputProps: {
                        value: form.name,
                        onChange: (e) => set("name", e.target.value),
                      },
                    }}
                  />
                  {errors.name && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <InputField
                    data={{
                      id: "auth-email",
                      label: {
                        htmlFor: "auth-email",
                        labelText: t("Authentication Email"),
                      },
                      placeholder: "admin@erb.com",
                      required: true,
                      inputProps: {
                        type: "email",
                        value: form.email,
                        onChange: (e) => set("email", e.target.value),
                      },
                    }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InputField
                  data={{
                    id: "contact-phone",
                    label: {
                      htmlFor: "contact-phone",
                      labelText: t("Contact Phone (Optional)"),
                    },
                    placeholder: "e.g. 0123456789",
                    inputProps: {
                      value: form.phone,
                      onChange: (e) => set("phone", e.target.value),
                    },
                  }}
                />
                <div>
                  <InputField
                    data={{
                      id: "security-code",
                      label: {
                        htmlFor: "security-code",
                        labelText: t("Initial Security Code"),
                      },
                      placeholder: "••••••••••",
                      required: true,
                      inputProps: {
                        type: "password",
                        value: form.securityCode,
                        onChange: (e) => set("securityCode", e.target.value),
                      },
                    }}
                  />
                  {errors.securityCode && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.securityCode}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="privilege-role"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Logical Privilege Role")}
                </Label>
                <DropdownSelect
                  options={PRIVILEGE_ROLE_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
                  selected={form.role}
                  onSelect={(value) => set("role", value as TeamRole)}
                  onOpenChange={setIsRoleOpen}
                  align="start"
                  className="md:w-full"
                  contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                />
              </div>
            </div>
          </form>

          {/* Sticky footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {t("Authorize Administrative Entity")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
