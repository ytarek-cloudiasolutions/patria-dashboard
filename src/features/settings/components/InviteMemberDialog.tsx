import DefaultButton from "@/shared/components/DefaultButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { useState } from "react";
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
        className="rounded-[13px] sm:max-w-lg"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-[18px] font-semibold text-[#28293D]">
            Issue Professional Access Key
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#000]">
                Entity Official Name <span className="text-[#C90000]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Staff"
                value={form.entityName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, entityName: e.target.value }))
                }
                className="h-11 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#000]">
                Authentication Email <span className="text-[#C90000]">*</span>
              </label>
              <input
                type="email"
                placeholder="admin@erb.com"
                value={form.authEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, authEmail: e.target.value }))
                }
                className="h-11 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#8B8B8B]">
                Contact Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="e.g. 01234567890"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactPhone: e.target.value }))
                }
                className="h-11 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#000]">
                Initial Security Code <span className="text-[#C90000]">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                value={form.securityCode}
                onChange={(e) =>
                  setForm((f) => ({ ...f, securityCode: e.target.value }))
                }
                className="h-11 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#000]">
              Logical Privilege Role
            </label>
            <div className="relative">
              <select
                value={form.privilegeRole}
                onChange={(e) =>
                  setForm((f) => ({ ...f, privilegeRole: e.target.value }))
                }
                className="w-full h-11 px-3 pr-8 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] appearance-none cursor-pointer focus:outline-none focus:border-[#5C4A1E]"
              >
                {privilegeRoleOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8B8B8B] text-xs">
                ▾
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <DefaultButton
              data={{
                buttonText: "Cancel",
                variant: "outline",
                type: "button",
                onClick: () => onOpenChange(false),
                className:
                  "text-primary border-primary hover:bg-white hover:text-primary",
              }}
            />
            <DefaultButton
              data={{
                buttonText: "Authorize Administrative Entity",
                type: "button",
                className: "bg-[#5C4A1E] hover:bg-[#3d3012]",
                onClick: handleSubmit,
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
