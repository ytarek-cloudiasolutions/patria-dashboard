import { useState } from "react";
import {
  BadgeCheck,
  Check,
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
import { ROLE_DEFAULT_PAGES, ROLE_DESCRIPTIONS, ALL_PAGES } from "../data";
import type {
  User,
  EditPermissionsForm,
  UserRole,
  PagePermission,
} from "../types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (userId: string, data: EditPermissionsForm) => void;
}

const ROLE_TABS: UserRole[] = ["Staff", "Manager", "Admin"];

const PAGE_ICON_MAP: Record<PagePermission, ReactNode> = {
  Home: <Home className="size-5" />,
  "Order Management": <ShoppingBag className="size-5" />,
  "Product Catalog": <Store className="size-5" />,
  "Customer Base": <Users className="size-5" />,
  "Offers & Discounts": <BadgeCheck className="size-5" />,
  Profile: <UserRound className="size-5" />,
  "General Settings": <Settings className="size-5" />,
  "Users & Permissions": <Gift className="size-5" />,
  "Branches & Locations": <MapPin className="size-5" />,
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

interface EditPermissionsContentProps {
  user: User;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: string, data: EditPermissionsForm) => void;
}

const EditPermissionsContent = ({
  user,
  onOpenChange,
  onSubmit,
}: EditPermissionsContentProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    user.role === "User" ? "Staff" : user.role
  );
  const [selectedPages, setSelectedPages] = useState<PagePermission[]>(
    user.availablePages
  );

  const handleRoleTab = (role: UserRole) => {
    setSelectedRole(role);
    setSelectedPages(ROLE_DEFAULT_PAGES[role]);
  };

  const togglePage = (page: PagePermission) => {
    setSelectedPages((prev) =>
      prev.includes(page)
        ? prev.filter((item) => item !== page)
        : [...prev, page]
    );
  };

  const handleSubmit = () => {
    onSubmit(user.id, { role: selectedRole, pages: selectedPages });
    onOpenChange(false);
  };

  return (
    <div className="px-[42px] pb-[40px] pt-[31px]">
      <DialogHeader>
        <p className="text-[15px] font-semibold text-[#595959]">
          Modify permissions
        </p>
        <DialogTitle className="mt-[16px] text-[32px] font-bold leading-none text-[#28293D]">
          {user.name}
        </DialogTitle>
      </DialogHeader>

      <div className="mt-[53px] grid grid-cols-3 gap-[24px]">
        {ROLE_TABS.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => handleRoleTab(role)}
            className={`flex h-[80px] flex-col items-center justify-center rounded-[5px] border-[3px] text-center transition-colors ${
              selectedRole === role
                ? "border-[#DADADA] bg-primary text-white"
                : "border-[#CACBD4] bg-[#EDEDED] text-[#333333]"
            }`}
          >
            <span className="text-[18px] font-medium leading-none">{role}</span>
            <span
              className={`mt-[8px] text-[13px] font-medium leading-none ${
                selectedRole === role ? "text-white" : "text-[#9B9B9B]"
              }`}
            >
              {ROLE_DESCRIPTIONS[role]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-[39px] flex items-center justify-between">
        <span className="text-[15px] font-bold text-[#28293D]">
          Available pages
        </span>
        <span className="text-[15px] font-bold text-[#28293D]">
          {selectedPages.length}/{ALL_PAGES.length}
        </span>
      </div>

      <div className="mt-[37px] flex flex-col gap-[21px]">
        {ALL_PAGES.map((page) => {
          const checked = selectedPages.includes(page);
          return (
            <button
              key={page}
              type="button"
              onClick={() => togglePage(page)}
              className="flex h-[54px] w-full items-center justify-between rounded-[16px] border border-[#E1E1E5] bg-white px-[17px] text-left"
            >
              <span
                className={`flex items-center gap-[10px] text-[18px] font-bold ${
                  checked ? "text-[#28293D]" : "text-[#8B8B95]"
                }`}
              >
                <span className={PAGE_COLOR_MAP[page]}>
                  {PAGE_ICON_MAP[page]}
                </span>
                {page}
              </span>
              <span
                className={`flex size-[27px] items-center justify-center rounded-[8px] border ${
                  checked
                    ? "border-primary bg-primary text-white"
                    : "border-primary bg-white text-transparent"
                }`}
              >
                <Check className="size-5" strokeWidth={3} />
              </span>
            </button>
          );
        })}
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
              buttonText: "Save Edits",
              type: "button",
              className:
                "h-[70px] rounded-[5px] bg-primary px-[37px] text-[21px] font-bold hover:bg-[#7A5C10]",
              onClick: handleSubmit,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const EditPermissionsDialog = ({
  open,
  onOpenChange,
  user,
  onSubmit,
}: Props) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-[8px] border border-[#DADADA] p-0 shadow-[0_8px_18px_rgba(0,0,0,0.18)] sm:max-w-[860px] sm:max-h-[729px] overflow-auto"
        showCloseButton={false}
      >
        <EditPermissionsContent
          key={user.id}
          user={user}
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditPermissionsDialog;
