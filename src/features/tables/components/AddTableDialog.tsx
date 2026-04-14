import { useMemo, useState } from "react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/shared/components/ui/custom-dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { TABLE_SECTIONS } from "../data";
import type { AddTableFormData, TableSection } from "../types";
import { Label } from "@/shared/components/ui/label";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";

interface AddTableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    tableNumber: number;
    capacity: number;
    section: TableSection;
  }) => void;
}

const initialState: AddTableFormData = {
  tableNumber: "",
  capacity: "",
  section: "Main Hall",
};

const AddTableDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: AddTableDialogProps) => {
  const [formData, setFormData] = useState<AddTableFormData>(initialState);

  const isInvalid = useMemo(() => {
    return (
      formData.tableNumber.trim().length === 0 ||
      formData.capacity.trim().length === 0 ||
      Number(formData.tableNumber) <= 0 ||
      Number(formData.capacity) <= 0
    );
  }, [formData.capacity, formData.tableNumber]);

  const handleClose = () => {
    setFormData(initialState);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (isInvalid) {
      return;
    }

    onSubmit({
      tableNumber: Number(formData.tableNumber),
      capacity: Number(formData.capacity),
      section: formData.section,
    });

    handleClose();
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent
        showCloseButton={false}
        className="p-6"
      >
        <div className="mb-8">
          <CustomDialogHeader className="mb-8">
            <CustomDialogTitle className="text-[24px] font-semibold text-[#28293D]">
              Add New Table
            </CustomDialogTitle>
          </CustomDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2.5">
              <Label className="text-[14px] font-medium text-[#2A2A3A]">
                Table Number <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.tableNumber}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    tableNumber: event.target.value,
                  }))
                }
                placeholder="e.g. 1"
                className="h-11"
                type="number"
                min="1"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label className="text-[14px] font-medium text-[#2A2A3A]">
                  Capacity <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.capacity}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      capacity: event.target.value,
                    }))
                  }
                  placeholder="0"
                  className="h-11"
                  type="number"
                  min="1"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[14px] font-medium text-[#2A2A3A]">
                  Section <span className="text-red-500">*</span>
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="h-11 w-full rounded-lg border border-input bg-transparent px-3 text-left text-[14px] text-[#2A2A3A] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <span className="flex items-center justify-between">
                        {formData.section}
                        <ChevronDown size={16} className="text-[#6B6B78]" />
                      </span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-(--radix-dropdown-menu-trigger-width)"
                  >
                    {TABLE_SECTIONS.map((section) => (
                      <DropdownMenuItem
                        key={section}
                        onSelect={() =>
                          setFormData((prev) => ({
                            ...prev,
                            section: section as TableSection,
                          }))
                        }
                        className={
                          formData.section === section
                            ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                            : ""
                        }
                      >
                        {section}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
        <Separator className="mb-8" />
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="px-7.5 py-4 h-14 border-primary text-primary font-semibold rounded-[5px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isInvalid}
            className="text-white font-semibold px-7.5 py-4 h-14 rounded-[5px]"
          >
            Add Table
          </Button>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
};

export default AddTableDialog;
