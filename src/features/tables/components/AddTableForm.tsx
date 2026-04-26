import { useMemo, useState } from "react";
import InputField from "@/shared/components/InputField";
import DefaultButton from "@/shared/components/DefaultButton";
import { Button } from "@/shared/components/ui/button";
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

interface AddTableFormProps {
  onSave: (payload: {
    tableNumber: number;
    capacity: number;
    section: TableSection;
  }) => void;
  onCancel: () => void;
}

const initialState: AddTableFormData = {
  tableNumber: "",
  capacity: "",
  section: "Main Hall",
};

const AddTableForm = ({ onSave, onCancel }: AddTableFormProps) => {
  const [formData, setFormData] = useState<AddTableFormData>(initialState);

  const isInvalid = useMemo(() => {
    return (
      formData.tableNumber.trim().length === 0 ||
      formData.capacity.trim().length === 0 ||
      Number(formData.tableNumber) <= 0 ||
      Number(formData.capacity) <= 0
    );
  }, [formData.capacity, formData.tableNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isInvalid) return;

    onSave({
      tableNumber: Number(formData.tableNumber),
      capacity: Number(formData.capacity),
      section: formData.section,
    });
  };

  return (
    <form className="flex flex-col gap-8 p-2.5">
      <InputField
        data={{
          id: "tableNumber",
          type: "number",
          placeholder: "e.g. 1",
          required: true,
          label: { htmlFor: "tableNumber", labelText: "Table Number" },
          inputProps: {
            name: "tableNumber",
            value: formData.tableNumber,
            onChange: handleInputChange,
            min: "1",
          },
        }}
      />

      <div className="grid grid-cols-2 gap-6">
        <InputField
          data={{
            id: "capacity",
            type: "number",
            placeholder: "0",
            required: true,
            label: { htmlFor: "capacity", labelText: "Capacity" },
            inputProps: {
              name: "capacity",
              value: formData.capacity,
              onChange: handleInputChange,
              min: "1",
            },
          }}
        />

        <div className="flex flex-col gap-2.5">
          <Label className="text-[#000000] text-[16px] font-medium block">
            Section <span className="text-[#C90000] ml-1">*</span>
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-12.5 w-full justify-between rounded-lg border-input bg-white px-4 py-2 text-base font-normal cursor-pointer focus-visible:border-input focus-visible:ring-0"
              >
                {formData.section}
                <ChevronDown className="size-6 text-[#000000]" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
              className="z-50 rounded-[16px] px-2 py-3 [&>[data-slot=dropdown-menu-item]+[data-slot=dropdown-menu-item]]:mt-2"
            >
              {TABLE_SECTIONS.map((section) => (
                <DropdownMenuItem
                  key={section}
                  className={
                    formData.section === section
                      ? "rounded-[16px] px-3 py-2 text-[12px] font-medium bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                      : "rounded-[16px] px-3 py-2 text-[12px]"
                  }
                  onSelect={() =>
                    setFormData((prev) => ({
                      ...prev,
                      section: section as TableSection,
                    }))
                  }
                >
                  {section}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator className="bg-[#CACBD4]" />

      <div className="flex gap-4 justify-end">
        <DefaultButton
          data={{
            buttonText: "Cancel",
            variant: "outline",
            type: "button",
            onClick: onCancel,
            className:
              "text-primary border-primary hover:bg-white hover:text-primary",
          }}
        />
        <DefaultButton
          data={{
            buttonText: "Add Table",
            type: "button",
            onClick: handleSave,
            className: isInvalid ? "opacity-50 pointer-events-none" : undefined,
          }}
        />
      </div>
    </form>
  );
};

export default AddTableForm;
