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
import { ROLE_DEFAULT_PAGES, ROLE_OPTIONS } from "../data";
import type { UserFormData, UserRole } from "../types";
import PageChip from "./PageChip";

const FORM_ID = "create-user-form";

const INITIAL_FORM: UserFormData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "Staff",
};

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: UserFormData) => void;
}

const CreateUserDialog = ({
  open,
  onOpenChange,
  onSave,
}: CreateUserDialogProps) => {
  const [form, setForm] = useState<UserFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setErrors({});
      setIsRoleOpen(false);
    }
  }, [open]);

  const set = <K extends keyof UserFormData>(
    key: K,
    value: UserFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof UserFormData, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.password.trim() || form.password.length < 6)
      next.password = "Password must be at least 6 characters";
    if (!form.role) next.role = "Role is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
    onOpenChange(false);
  };

  const previewPages =
    form.role && form.role in ROLE_DEFAULT_PAGES
      ? ROLE_DEFAULT_PAGES[form.role as UserRole]
      : [];

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
              Create New User Account
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
              <div>
                <InputField
                  data={{
                    id: "full-name",
                    label: {
                      htmlFor: "full-name",
                      labelText: "Full Name",
                    },
                    placeholder: "Full Name",
                    required: true,
                    inputProps: {
                      value: form.fullName,
                      onChange: (e) => set("fullName", e.target.value),
                    },
                  }}
                />
                {errors.fullName && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-end">
                <div>
                  <InputField
                    data={{
                      id: "email",
                      label: {
                        htmlFor: "email",
                        labelText: "Email Address",
                      },
                      placeholder: "user@erb.com",
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

                <div>
                  <InputField
                    data={{
                      id: "phone",
                      label: {
                        htmlFor: "phone",
                        labelText: "Phone Number",
                      },
                      placeholder: "+20...",
                      required: true,
                      inputProps: {
                        value: form.phone,
                        onChange: (e) => set("phone", e.target.value),
                      },
                    }}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-end">
                <div>
                  <InputField
                    data={{
                      id: "password",
                      label: {
                        htmlFor: "password",
                        labelText: "Password",
                      },
                      placeholder: "••••••••",
                      required: true,
                      inputProps: {
                        type: "password",
                        value: form.password,
                        onChange: (e) => set("password", e.target.value),
                      },
                    }}
                  />
                  {errors.password && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label
                    htmlFor="role"
                    className="mb-2.5 text-[16px] font-medium text-black"
                  >
                    Role and Permission
                    <span className="text-[#C90000]">*</span>
                  </Label>
                  <DropdownSelect
                    options={ROLE_OPTIONS}
                    selected={form.role}
                    onSelect={(value) => set("role", value as UserRole)}
                    onOpenChange={setIsRoleOpen}
                    placeholder="Select role"
                    align="start"
                    className="md:w-full"
                    contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                  />
                  {errors.role && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.role}
                    </p>
                  )}
                </div>
              </div>

              {previewPages.length > 0 && (
                <div className="rounded-[12px] bg-[#FAFAF7] px-4 py-4 border  border-[#CACBD4]">
                  <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#8B8B8B]">
                    Available pages
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {previewPages.map((page) => (
                      <PageChip key={page} page={page} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Sticky footer */}
          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: "Cancel",
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
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
