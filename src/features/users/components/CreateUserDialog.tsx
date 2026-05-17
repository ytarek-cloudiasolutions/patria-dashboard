import { useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  Gift,
  Home,
  MapPin,
  Settings,
  ShoppingBag,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DefaultButton from "@/shared/components/DefaultButton";
import { ROLE_DEFAULT_PAGES, roleOptions, ALL_PAGES } from "../data";
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

const inputClassName =
  "h-[61px] w-full rounded-[13px] border border-[#E1E1E5] bg-white px-[16px] text-[20px] font-medium text-[#23252A] placeholder:text-[#9B9B9B] focus:outline-none focus:border-primary";

const PAGE_ICON_MAP: Record<PagePermission, ReactNode> = {
  Home: <Home className="size-[13px]" />,
  "Order Management": <ShoppingBag className="size-[13px]" />,
  "Product Catalog": <Store className="size-[13px]" />,
  "Customer Base": <Users className="size-[13px]" />,
  "Offers & Discounts": <BadgeCheck className="size-[13px]" />,
  Profile: <UserRound className="size-[13px]" />,
  "General Settings": <Settings className="size-[13px]" />,
  "Users & Permissions": <Gift className="size-[13px]" />,
  "Branches & Locations": <MapPin className="size-[13px]" />,
};

const PAGE_COLOR_MAP: Record<PagePermission, string> = {
  Home: "text-[#C57A00]",
  "Order Management": "text-[#E18A00]",
  "Product Catalog": "text-[#0066FF]",
  "Customer Base": "text-[#A000FF]",
  "Offers & Discounts": "text-[#00A85A]",
  Profile: "text-[#7A7A43]",
  "General Settings": "text-[#696969]",
  "Users & Permissions": "text-[#FF0000]",
  "Branches & Locations": "text-[#000000]",
};

const CreateUserDialog = ({ open, onOpenChange, onSubmit }: Props) => {
  const [form, setForm] = useState<NewUserForm>(defaultForm);

  const handleRoleChange = (role: UserRole) => {
    setForm((current) => ({
      ...current,
      role,
      pages: ROLE_DEFAULT_PAGES[role],
    }));
  };

  const togglePage = (page: PagePermission) => {
    setForm((current) => ({
      ...current,
      pages: current.pages.includes(page)
        ? current.pages.filter((item) => item !== page)
        : [...current.pages, page],
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
        className="rounded-[8px] border border-[#DADADA] p-0 shadow-[0_8px_18px_rgba(0,0,0,0.18)] sm:max-w-[860px] sm:max-h-[729px] overflow-auto"
        showCloseButton={false}
      >
        <div className="px-[42px] pb-[40px] pt-[34px]">
          <DialogHeader>
            <DialogTitle className="text-[32px] font-bold leading-none text-[#28293D]">
              Create New User Account
            </DialogTitle>
          </DialogHeader>

          <div className="mt-[56px]">
            <label className="flex flex-col gap-[13px] text-[21px] font-medium text-[#000000]">
              <span>
                Full Name <span className="text-[#C90000]">*</span>
              </span>
              <input
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </label>
          </div>

          <div className="mt-[38px] grid grid-cols-1 gap-[30px] md:grid-cols-2">
            <label className="flex flex-col gap-[13px] text-[21px] font-medium text-[#000000]">
              <span>
                Email Address <span className="text-[#C90000]">*</span>
              </span>
              <input
                type="email"
                placeholder="user@erb.com"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </label>

            <label className="flex flex-col gap-[13px] text-[21px] font-medium text-[#000000]">
              <span>
                Phone Number <span className="text-[#C90000]">*</span>
              </span>
              <input
                type="tel"
                placeholder="+20..."
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </label>
          </div>

          <div className="mt-[38px] grid grid-cols-1 gap-[30px] md:grid-cols-2">
            <label className="flex flex-col gap-[13px] text-[21px] font-medium text-[#000000]">
              <span>
                Password <span className="text-[#C90000]">*</span>
              </span>
              <input
                type="password"
                placeholder="**********"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </label>

            <label className="flex flex-col gap-[13px] text-[21px] font-medium text-[#000000]">
              <span>
                Role and Permission <span className="text-[#C90000]">*</span>
              </span>
              <div className="relative">
                <select
                  value={form.role}
                  onChange={(event) =>
                    handleRoleChange(event.target.value as UserRole)
                  }
                  className={`${inputClassName} appearance-none pr-[52px]`}
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-[16px] top-1/2 size-8 -translate-y-1/2 text-[#000000]" />
              </div>
            </label>
          </div>

          <div className="mt-[40px] rounded-[16px] border border-[#CACBD4] bg-white px-[28px] py-[28px]">
            <div className="flex flex-wrap gap-x-[9px] gap-y-[15px]">
              {ALL_PAGES.map((page) => {
                const active = form.pages.includes(page);
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => togglePage(page)}
                    className={`inline-flex h-[29px] items-center gap-[6px] rounded-full border px-[10px] text-[16px] font-bold leading-none transition-colors ${
                      active
                        ? "border-[#DADADA] bg-white text-[#000000]"
                        : "border-[#E1E1E5] bg-[#F7F7F7] text-[#8F8F8F]"
                    }`}
                  >
                    <span
                      className={
                        active ? PAGE_COLOR_MAP[page] : "text-[#8F8F8F]"
                      }
                    >
                      {PAGE_ICON_MAP[page]}
                    </span>
                    {page}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-[40px] border-t border-[#CACBD4] pt-[40px]">
            <div className="flex justify-end gap-[20px]">
              <DefaultButton
                data={{
                  buttonText: "Cancel",
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "h-[70px] rounded-[5px] border-primary px-[37px] text-[21px] font-bold text-primary hover:bg-white hover:text-primary",
                }}
              />
              <DefaultButton
                data={{
                  buttonText: "Create Account",
                  type: "button",
                  className:
                    "h-[70px] rounded-[5px] bg-primary px-[37px] text-[21px] font-bold hover:bg-[#7A5C10]",
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

export default CreateUserDialog;
