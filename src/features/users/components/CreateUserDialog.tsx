import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DefaultButton from "@/shared/components/DefaultButton";
import {
  ROLE_DEFAULT_PAGES,
  roleOptions,
  ALL_PAGES,
  PAGE_ICONS,
} from "../data";
import type { NewUserForm, UserRole, PagePermission } from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewUserForm) => void;
}

const defaultForm: NewUserForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "Staff",
  pages: ROLE_DEFAULT_PAGES["Staff"],
};

const CreateUserDialog = ({ open, onOpenChange, onSubmit }: Props) => {
  const [form, setForm] = useState<NewUserForm>(defaultForm);

  const handleRoleChange = (role: UserRole) => {
    setForm((f) => ({ ...f, role, pages: ROLE_DEFAULT_PAGES[role] }));
  };

  const togglePage = (page: PagePermission) => {
    setForm((f) => ({
      ...f,
      pages: f.pages.includes(page)
        ? f.pages.filter((p) => p !== page)
        : [...f.pages, page],
    }));
  };

  const handleSubmit = () => {
    if (!form.fullName || !form.email) return;
    onSubmit(form);
    onOpenChange(false);
    setForm(defaultForm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-[13px] sm:max-w-174"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-[18px] font-semibold text-[#28293D]">
            Create New User Account
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-medium text-[#000]">
              Full Name <span className="text-[#C90000]">*</span>
            </label>
            <input
              type="text"
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) =>
                setForm((f) => ({ ...f, fullName: e.target.value }))
              }
              className="w-full h-11 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#000]">
                Email Address <span className="text-[#C90000]">*</span>
              </label>
              <input
                type="email"
                placeholder="user@erb.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="h-11 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#000]">
                Phone Number <span className="text-[#C90000]">*</span>
              </label>
              <input
                type="tel"
                placeholder="+20..."
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="h-11 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>
          </div>

          {/* Password + Role */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#000]">
                Password <span className="text-[#C90000]">*</span>
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                className="h-11 px-3 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] placeholder:text-[#8B8B8B] focus:outline-none focus:border-[#5C4A1E]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-[#000]">
                Role and Permission <span className="text-[#C90000]">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.role}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="w-full h-11 px-3 pr-8 rounded-[10px] border border-[#E5E5E5] bg-white text-[14px] text-[#23252A] appearance-none cursor-pointer focus:outline-none focus:border-[#5C4A1E]"
                >
                  {roleOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8B8B8B] text-xs">
                  ▾
                </span>
              </div>
            </div>
          </div>

          {/* Pages grid */}
          <div className="border border-[#E5E5E5] rounded-[10px] p-4 bg-[#FAFAFA]">
            <div className="flex flex-wrap gap-2">
              {ALL_PAGES.map((page) => {
                const active = form.pages.includes(page);
                return (
                  <button
                    key={page}
                    onClick={() => togglePage(page)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-[12px] font-medium border transition-colors cursor-pointer ${
                      active
                        ? "bg-[#F5F0EA] border-[#5C4A1E] text-[#5C4A1E]"
                        : "bg-white border-[#E5E5E5] text-[#8B8B8B] hover:border-[#5C4A1E]"
                    }`}
                  >
                    <span>{PAGE_ICONS[page]}</span>
                    {page}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
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
                buttonText: "Create Account",
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

export default CreateUserDialog;
