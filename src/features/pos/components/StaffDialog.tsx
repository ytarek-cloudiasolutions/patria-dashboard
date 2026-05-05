import { ChevronDown } from "lucide-react";

import DropdownSelect from "@/shared/components/DropdownSelect";
import { cn } from "@/lib/utils";
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
import { STAFF_MEMBERS, STAFF_POSITIONS } from "../data";

type StaffDialogProps = {
  open: boolean;
  selectedStaffId: string;
  staffName: string;
  position: string;
  onOpenChange: (open: boolean) => void;
  onStaffChange: (value: string) => void;
  onStaffNameChange: (value: string) => void;
  onPositionChange: (value: string) => void;
  onConfirm: () => void;
};

const StaffDialog = ({
  open,
  selectedStaffId,
  staffName,
  position,
  onOpenChange,
  onStaffChange,
  onStaffNameChange,
  onPositionChange,
  onConfirm,
}: StaffDialogProps) => {
  const selectedStaff =
    STAFF_MEMBERS.find((staff) => staff.id === selectedStaffId) ?? null;
  const isOther = selectedStaffId === "other";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[590px] max-w-[calc(100%-2rem)] rounded-[8px] bg-white p-7 shadow-xl sm:max-w-[590px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[22px] font-semibold text-[#28293D]">
            Select Staff
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <label className="block space-y-2">
            <span className="text-[13px] font-semibold text-[#1F2433]">
              Staff Member <span className="text-[#D40000]">*</span>
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 w-full justify-between rounded-[8px] border-[#E5E2DD] bg-white px-4 text-[13px] font-medium text-[#8B8B8B] hover:bg-white"
                >
                  {selectedStaff?.name ?? "Select Staff"}
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
                      "h-9 cursor-pointer rounded-[8px] px-3 text-[12px] data-highlighted:bg-[#F5F0EA] data-highlighted:text-[#1F2433]",
                      selectedStaffId === staff.id &&
                        "bg-[#9B7200] text-white data-highlighted:bg-[#9B7200] data-highlighted:text-white"
                    )}
                    onSelect={() => onStaffChange(staff.id)}
                  >
                    {staff.role
                      ? `${staff.name} (${staff.role})`
                      : staff.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </label>

          {isOther && (
            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-[13px] font-semibold text-[#1F2433]">
                  Staff Name <span className="text-[#D40000]">*</span>
                </span>
                <Input
                  value={staffName}
                  onChange={(event) => onStaffNameChange(event.target.value)}
                  placeholder="Staff Name"
                  className="h-11 rounded-[8px] border-[#E5E2DD] px-4 focus-visible:ring-0"
                />
              </label>
              <label className="space-y-2">
                <span className="text-[13px] font-semibold text-[#1F2433]">
                  Select Position <span className="text-[#D40000]">*</span>
                </span>
                <DropdownSelect
                  options={STAFF_POSITIONS}
                  selected={position}
                  onSelect={onPositionChange}
                  placeholder="Select Position"
                  align="start"
                  className="h-11 rounded-[8px] px-4 text-[13px] font-medium text-[#8B8B8B] md:w-full [&_svg]:size-5"
                />
              </label>
            </div>
          )}
        </div>

        <DialogFooter className="mt-2 gap-3 border-t border-[#E1E1E1] bg-white px-0 pb-0 pt-6">
          <Button
            variant="outline"
            className="h-12 min-w-[104px] rounded-[4px] border-[#9B7200] bg-white text-[13px] font-semibold text-[#9B7200]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="h-12 min-w-[150px] rounded-[4px] bg-[#9B7200] text-[13px] font-semibold text-white hover:bg-[#856100]"
            onClick={onConfirm}
          >
            Confirm Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDialog;
