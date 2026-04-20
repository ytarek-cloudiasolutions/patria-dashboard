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
import type { AddReservationFormData, DiningTable } from "../types";
import { Label } from "@/shared/components/ui/label";
import { ChevronDown } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";

interface NewReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tables: DiningTable[];
  onSubmit: (payload: {
    customerName: string;
    phone: string;
    people: number;
    date: string;
    time: string;
    tableNumber: number;
  }) => void;
}

const initialState: AddReservationFormData = {
  customerName: "",
  phone: "",
  people: "",
  date: "",
  time: "",
  tableId: "",
};

const NewReservationDialog = ({
  open,
  onOpenChange,
  tables,
  onSubmit,
}: NewReservationDialogProps) => {
  const [formData, setFormData] =
    useState<AddReservationFormData>(initialState);

  const canSubmit = useMemo(() => {
    return (
      formData.customerName.trim().length > 0 &&
      formData.phone.trim().length > 0 &&
      Number(formData.people) > 0 &&
      formData.date.length > 0 &&
      formData.time.length > 0 &&
      formData.tableId.length > 0
    );
  }, [formData]);

  const handleClose = () => {
    setFormData(initialState);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    const selectedTable = tables.find((table) => table.id === formData.tableId);

    if (!selectedTable) {
      return;
    }

    onSubmit({
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      people: Number(formData.people),
      date: formData.date,
      time: formData.time,
      tableNumber: selectedTable.tableNumber,
    });

    handleClose();
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent showCloseButton={false} className="p-6">
        <div className="mb-8">
          <CustomDialogHeader className="mb-8">
            <CustomDialogTitle className="text-[24px] font-semibold text-[#28293D]">
              New Reservation
            </CustomDialogTitle>
          </CustomDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2.5">
              <Label className="text-[14px] font-medium text-[#2A2A3A]">
                Customer Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.customerName}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerName: event.target.value,
                  }))
                }
                placeholder="Full Name"
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label className="text-[14px] font-medium text-[#2A2A3A]">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="01X XXXX XXXX"
                  className="h-11"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[14px] font-medium text-[#2A2A3A]">
                  Number of people <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.people}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      people: event.target.value,
                    }))
                  }
                  placeholder="e.g. 1"
                  type="number"
                  min="1"
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2.5">
                <Label className="text-[14px] font-medium text-[#2A2A3A]">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.date}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      date: event.target.value,
                    }))
                  }
                  type="date"
                  className="h-11"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[14px] font-medium text-[#2A2A3A]">
                  Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.time}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      time: event.target.value,
                    }))
                  }
                  type="time"
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label className="text-[14px] font-medium text-[#2A2A3A]">
                Select Table <span className="text-red-500">*</span>
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="h-11 w-full rounded-lg border border-input bg-transparent px-3 text-left text-[14px] text-[#2A2A3A] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className="flex items-center justify-between">
                      {formData.tableId
                        ? (() => {
                            const selectedTable = tables.find(
                              (table) => table.id === formData.tableId,
                            );

                            if (!selectedTable) {
                              return "Select table";
                            }

                            return `Table ${selectedTable.tableNumber} - ${selectedTable.section}`;
                          })()
                        : "Select table"}
                      <ChevronDown size={16} className="text-[#6B6B78]" />
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="w-(--radix-dropdown-menu-trigger-width)"
                >
                  {tables.map((table) => (
                    <DropdownMenuItem
                      key={table.id}
                      onSelect={() =>
                        setFormData((prev) => ({
                          ...prev,
                          tableId: table.id,
                        }))
                      }
                      className={
                        formData.tableId === table.id
                          ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                          : ""
                      }
                    >
                      Table {table.tableNumber} - {table.section}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
            disabled={!canSubmit}
            className="text-white font-semibold px-7.5 py-4 h-14 rounded-[5px]"
          >
            Confirm Reservation
          </Button>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  );
};

export default NewReservationDialog;
