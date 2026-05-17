import { useState } from "react";
import { ChevronDown } from "lucide-react";
import DefaultButton from "@/shared/components/DefaultButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { privilegeRoleOptions } from "../data";
import type { InviteMemberForm } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InviteMemberForm) => void;
}

const defaultForm: InviteMemberForm = {
  entityName: "",
  authEmail: "",
  contactPhone: "",
  securityCode: "",
  privilegeRole: "staff",
};

const inputClassName =
  "h-[54px] w-full rounded-[13px] border border-[#E1E1E5] bg-white px-[14px] text-[17px] font-medium text-[#23252A] placeholder:text-[#9B9B9B] focus:outline-none focus:border-primary";

const InviteMemberDialog = ({ open, onOpenChange, onSubmit }: Props) => {
  const [form, setForm] = useState<InviteMemberForm>(defaultForm);

  const handleSubmit = () => {
    if (!form.entityName || !form.authEmail) return;
    onSubmit(form);
    onOpenChange(false);
    setForm(defaultForm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-[8px] border border-[#DADADA] p-0 shadow-[0_8px_18px_rgba(0,0,0,0.18)] sm:max-w-[735px]"
        showCloseButton={false}
      >
        <div className="px-[36px] pb-[35px] pt-[28px]">
          <DialogHeader>
            <DialogTitle className="text-[27px] font-bold leading-none text-[#28293D]">
              Issue Professional Access Key
            </DialogTitle>
          </DialogHeader>

          <div className="mt-[45px] grid grid-cols-1 gap-x-[26px] gap-y-[32px] md:grid-cols-2">
            <label className="flex flex-col gap-[10px] text-[18px] font-medium text-[#000000]">
              <span>
                Entity Official Name <span className="text-[#C90000]">*</span>
              </span>
              <input
                type="text"
                placeholder="e.g. Staff"
                value={form.entityName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    entityName: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </label>

            <label className="flex flex-col gap-[10px] text-[18px] font-medium text-[#000000]">
              <span>
                Authentication Email <span className="text-[#C90000]">*</span>
              </span>
              <input
                type="email"
                placeholder="admin@erb.com"
                value={form.authEmail}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    authEmail: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </label>

            <label className="flex flex-col gap-[10px] text-[18px] font-medium text-[#000000]">
              <span>
                Contact Phone{" "}
                <span className="font-medium text-[#696969]">(Optional)</span>
              </span>
              <input
                type="tel"
                placeholder="e.g. 0123456789"
                value={form.contactPhone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    contactPhone: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </label>

            <label className="flex flex-col gap-[10px] text-[18px] font-medium text-[#000000]">
              <span>
                Initial Security Code{" "}
                <span className="text-[#C90000]">*</span>
              </span>
              <input
                type="password"
                placeholder="**********"
                value={form.securityCode}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    securityCode: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </label>
          </div>

          <label className="mt-[33px] flex flex-col gap-[10px] text-[18px] font-medium text-[#000000]">
            Logical Privilege Role
            <div className="relative">
              <select
                value={form.privilegeRole}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    privilegeRole: event.target.value,
                  }))
                }
                className={`${inputClassName} appearance-none pr-[48px]`}
              >
                {privilegeRoleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-[16px] top-1/2 size-7 -translate-y-1/2 text-[#000000]" />
            </div>
          </label>

          <div className="mt-[35px] border-t border-[#CACBD4] pt-[33px]">
            <div className="flex justify-end gap-[16px]">
              <DefaultButton
                data={{
                  buttonText: "Cancel",
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "h-[59px] rounded-[5px] border-primary px-[31px] text-[18px] font-bold text-primary hover:bg-white hover:text-primary",
                }}
              />
              <DefaultButton
                data={{
                  buttonText: "Authorize Administrative Entity",
                  type: "button",
                  className:
                    "h-[59px] rounded-[5px] bg-primary px-[33px] text-[18px] font-bold hover:bg-[#7A5C10]",
                  onClick: handleSubmit,
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
