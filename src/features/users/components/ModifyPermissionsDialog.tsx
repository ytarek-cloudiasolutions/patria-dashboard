import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/lib/utils";
import DefaultButton from "@/shared/components/DefaultButton";
import {
  ALL_PERMISSION_PAGES,
  ROLE_CARD_OPTIONS,
  ROLE_DEFAULT_PAGES,
} from "../data";
import type { PermissionPage, UserAccount, UserRole } from "../types";
import { PAGE_ICONS } from "./PageChip";

interface ModifyPermissionsDialogProps {
  open: boolean;
  user?: UserAccount;
  onOpenChange: (open: boolean) => void;
  onSave: (id: number, role: UserRole, pages: PermissionPage[]) => void;
}

const ModifyPermissionsDialog = ({
  open,
  user,
  onOpenChange,
  onSave,
}: ModifyPermissionsDialogProps) => {
  const [role, setRole] = useState<UserRole>("Staff");
  const [pages, setPages] = useState<Set<PermissionPage>>(new Set());

  useEffect(() => {
    if (open && user) {
      const initialRole = (
        ROLE_CARD_OPTIONS.some((opt) => opt.value === user.role)
          ? user.role
          : "Staff"
      ) as UserRole;
      setRole(initialRole);
      setPages(new Set(user.pages));
    }
  }, [open, user]);

  const handleRoleChange = (next: UserRole) => {
    setRole(next);
    setPages(new Set(ROLE_DEFAULT_PAGES[next]));
  };

  const togglePage = (page: PermissionPage) => {
    setPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const handleSave = () => {
    if (!user) return;
    onSave(user.id, role, Array.from(pages));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-150"
      >
        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          {/* Header */}
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <p className="text-[13px] text-[#8B8B8B]">Modify permissions</p>
            <DialogTitle className="mt-1 text-[20px] font-semibold text-[#28293D] sm:text-[24px]">
              {user?.name ?? ""}
            </DialogTitle>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex flex-col gap-5">
              {/* Role cards */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                {ROLE_CARD_OPTIONS.map((option) => {
                  const isActive = role === option.value;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => handleRoleChange(option.value)}
                      className={cn(
                        "flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded px-2 py-3.5 text-center transition-colors",
                        isActive
                          ? "bg-[#8F6900] font-medium text-white ring-4 ring-[#624F1C1A]"
                          : "border-4 border-gray-400/40 bg-neutral-200 font-normal text-[#333333]",
                      )}
                    >
                      <span
                        className={cn(
                          "text-[14px] font-normal",
                          isActive ? "text-white" : "text-[#333333]",
                        )}
                      >
                        {option.label}
                      </span>
                      <span
                        className={cn(
                          "text-[10px]",
                          isActive ? "text-white" : "text-[#8B8B8B]",
                        )}
                      >
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Available pages */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[14px] font-semibold text-[#28293D]">
                    Available pages
                  </p>
                  <span className="text-[13px] text-[#8B8B8B]">
                    {pages.size}/{ALL_PERMISSION_PAGES.length}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {ALL_PERMISSION_PAGES.map((page) => {
                    const { icon: Icon, color } = PAGE_ICONS[page];
                    const isChecked = pages.has(page);
                    const id = `page-${page}`;
                    return (
                      <label
                        key={page}
                        htmlFor={id}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-2xl border border-[#E5E5E5] p-3 transition-opacity",
                          !isChecked && "opacity-60",
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          <Icon size={18} className={color} />
                          <span className="text-[14px] font-semibold text-[#28293D]">
                            {page}
                          </span>
                        </span>
                        <div
                          className={cn(
                            "rounded-[10px] p-1",
                            isChecked && "bg-[#624F1C1A]",
                          )}
                        >
                          <Checkbox
                            id={id}
                            checked={isChecked}
                            onCheckedChange={() => togglePage(page)}
                            className="h-5 w-5 cursor-pointer rounded-[5.99px] border-[#8F6900]"
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

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
                type="button"
                onClick={handleSave}
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                Save Edits
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModifyPermissionsDialog;
