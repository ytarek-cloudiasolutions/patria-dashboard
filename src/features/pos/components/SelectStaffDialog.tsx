import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import DropdownSelect from "@/shared/components/DropdownSelect";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { STAFF_MEMBERS, STAFF_POSITIONS } from "../data";
import { formatEgp } from "../utils";

type SelectStaffDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const fieldLabel = "text-[13px] font-semibold text-[#333333]";

const SelectStaffDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: SelectStaffDialogProps) => {
  const { t } = useTranslation();
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [staffName, setStaffName] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    if (!open) return;
    setSelectedStaffId("");
    setStaffName("");
    setPosition("");
  }, [open]);

  const selectedStaff =
    STAFF_MEMBERS.find((staff) => staff.id === selectedStaffId) ?? null;
  const isOther = selectedStaffId === "other";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[560px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] bg-white p-6 sm:max-w-[560px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] font-bold text-[#333333]">
            {t("Select Staff")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-5 space-y-5">
          <label className="block space-y-2">
            <span className={fieldLabel}>
              {t("Staff Member")} <span className="text-[#D40000]">*</span>
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-full justify-between rounded-[8px] border-[#E5E2DD] bg-white px-4 text-[13px] font-medium text-[#333333] hover:bg-white"
                >
                  <span className={cn(!selectedStaff && !isOther && "text-[#8B8B8B]")}>
                    {selectedStaff?.name ??
                      (isOther ? t("Other") : t("Select Staff"))}
                  </span>
                  <ChevronDown className="size-5 text-[#8B8B8B]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="z-70 w-(--radix-dropdown-menu-trigger-width) rounded-[12px] p-2"
              >
                {STAFF_MEMBERS.map((staff) => (
                  <DropdownMenuItem
                    key={staff.id}
                    className={cn(
                      "h-9 cursor-pointer rounded-[8px] px-3 text-[12px] data-highlighted:bg-[#F5F0EA] data-highlighted:text-[#333333]",
                      selectedStaffId === staff.id &&
                        "bg-primary text-white data-highlighted:bg-primary data-highlighted:text-white",
                    )}
                    onSelect={() => setSelectedStaffId(staff.id)}
                  >
                    {staff.role ? `${staff.name} (${staff.role})` : staff.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  className={cn(
                    "h-9 cursor-pointer rounded-[8px] px-3 text-[12px] data-highlighted:bg-[#F5F0EA] data-highlighted:text-[#333333]",
                    isOther &&
                      "bg-primary text-white data-highlighted:bg-primary data-highlighted:text-white",
                  )}
                  onSelect={() => setSelectedStaffId("other")}
                >
                  {t("Other")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </label>

          {selectedStaff && (
            <div className="rounded-[8px] border border-dashed border-primary/60 bg-[#FBF6EE] px-4 py-3">
              <p className="text-[11px] font-medium text-[#8B8B8B]">
                {t("Remaining amount")}
              </p>
              <p className="text-[14px] font-bold text-[#D40000]">
                {formatEgp(selectedStaff.remaining ?? 0)}
              </p>
            </div>
          )}

          {isOther && (
            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className={fieldLabel}>
                  {t("Staff Name")} <span className="text-[#D40000]">*</span>
                </span>
                <Input
                  value={staffName}
                  onChange={(event) => setStaffName(event.target.value)}
                  placeholder={t("Staff Name")}
                  className="h-11 rounded-[8px] border-[#E5E2DD] px-4 text-[13px] focus-visible:ring-0"
                />
              </label>
              <label className="space-y-2">
                <span className={fieldLabel}>
                  {t("Select Position")}{" "}
                  <span className="text-[#D40000]">*</span>
                </span>
                <DropdownSelect
                  options={STAFF_POSITIONS}
                  selected={position}
                  onSelect={setPosition}
                  placeholder={t("Select Position")}
                  align="start"
                  className="h-11 rounded-[8px] px-4 text-[13px] font-medium text-[#8B8B8B] md:w-full [&_svg]:size-5"
                />
              </label>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6 gap-3 border-t border-[#E1E1E1] bg-white px-0 pb-0 pt-5">
          <Button
            variant="outline"
            className="h-12 min-w-[110px] rounded-[8px] border-primary bg-white text-[13px] font-semibold text-primary hover:bg-[#FBF6EE]"
            onClick={() => onOpenChange(false)}
          >
            {t("Cancel")}
          </Button>
          <Button
            className="h-12 min-w-[150px] rounded-[8px] bg-primary text-[13px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
            disabled={!selectedStaffId || (isOther && !staffName)}
            onClick={onConfirm}
          >
            {t("Confirm Order")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectStaffDialog;
