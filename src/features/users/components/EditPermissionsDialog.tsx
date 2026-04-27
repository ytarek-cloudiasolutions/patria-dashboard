import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import DefaultButton from "@/shared/components/DefaultButton";
import {
  ROLE_DEFAULT_PAGES,
  ROLE_DESCRIPTIONS,
  ALL_PAGES,
  PAGE_ICONS,
} from "../data";
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

const EditPermissionsDialog = ({
  open,
  onOpenChange,
  user,
  onSubmit,
}: Props) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("Staff");
  const [selectedPages, setSelectedPages] = useState<PagePermission[]>([]);

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role === "User" ? "Staff" : user.role);
      setSelectedPages(user.availablePages);
    }
  }, [user]);

  if (!user) return null;

  const handleRoleTab = (role: UserRole) => {
    setSelectedRole(role);
    setSelectedPages(ROLE_DEFAULT_PAGES[role]);
  };

  const togglePage = (page: PagePermission) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page],
    );
  };

  const handleSubmit = () => {
    onSubmit(user.id, { role: selectedRole, pages: selectedPages });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-[13px] sm:max-w-174"
        showCloseButton={false}
      >
        <DialogHeader>
          <p className="text-[12px] text-[#8B8B8B]">Modify permissions</p>
          <DialogTitle className="text-[20px] font-bold text-[#28293D]">
            {user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-1">
          {/* Role tabs */}
          <div className="grid grid-cols-3 gap-2">
            {ROLE_TABS.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleTab(role)}
                className={`flex flex-col items-center py-2.5 px-3 rounded-[10px] border transition-colors cursor-pointer text-center ${
                  selectedRole === role
                    ? "bg-[#5C4A1E] border-[#5C4A1E] text-white"
                    : "bg-white border-[#E5E5E5] text-[#28293D] hover:border-[#5C4A1E]"
                }`}
              >
                <span className="text-[13px] font-semibold">{role}</span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    selectedRole === role ? "text-white/80" : "text-[#8B8B8B]"
                  }`}
                >
                  {ROLE_DESCRIPTIONS[role]}
                </span>
              </button>
            ))}
          </div>

          {/* Available pages */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-[#28293D]">
                Available pages
              </span>
              <span className="text-[12px] text-[#8B8B8B]">
                {selectedPages.length}/{ALL_PAGES.length}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              {ALL_PAGES.map((page) => {
                const checked = selectedPages.includes(page);
                return (
                  <button
                    key={page}
                    onClick={() => togglePage(page)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-[8px] hover:bg-[#F5F0EA] transition-colors cursor-pointer w-full text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[14px]">{PAGE_ICONS[page]}</span>
                      <span className="text-[13px] text-[#28293D]">{page}</span>
                    </div>
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-colors ${
                        checked
                          ? "bg-[#5C4A1E] border-[#5C4A1E]"
                          : "bg-white border-[#D1D5DB]"
                      }`}
                    >
                      {checked && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1 border-t border-[#E5E5E5]">
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
                buttonText: "Save Edits",
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

export default EditPermissionsDialog;
