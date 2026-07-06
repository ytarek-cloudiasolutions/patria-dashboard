import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import DefaultButton from "@/shared/components/DefaultButton";
import DropdownSelect from "@/shared/components/DropdownSelect";
import InputField from "@/shared/components/InputField";
import DatePicker from "@/shared/components/DatePicker";
import TimePicker from "@/shared/components/TimePicker";
import type { DropdownSelectOption } from "@/shared/types/DropdownSelect.types";
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { ReservationFormData } from "../types";

const FORM_ID = "new-reservation-form";

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentTimeFormatted = () => {
  const d = new Date();
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12

  const pad = (num: number) => String(num).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)} ${period}`;
};

const INITIAL_FORM: ReservationFormData = {
  name: "",
  email: "",
  phone: "",
  people: "",
  date: "",
  time: "",
  table: "",
};

interface NewReservationDialogProps {
  open: boolean;
  tableOptions: DropdownSelectOption[];
  onOpenChange: (open: boolean) => void;
  onSave: (data: ReservationFormData) => void;
}

const NewReservationDialog = ({
  open,
  tableOptions,
  onOpenChange,
  onSave,
}: NewReservationDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<ReservationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReservationFormData, string>>
  >({});
  const [isTableOpen, setIsTableOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        ...INITIAL_FORM,
        date: getTodayDateString(),
        time: getCurrentTimeFormatted(),
      });
      setErrors({});
      setIsTableOpen(false);
    }
  }, [open]);

  const set = <K extends keyof ReservationFormData>(
    key: K,
    value: ReservationFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const next: Partial<Record<keyof ReservationFormData, string>> = {};
    if (!form.name.trim()) next.name = "Customer name is required";
    if (!form.phone.trim()) next.phone = "Phone is required";
    if (!form.people.trim() || Number(form.people) <= 0) {
      next.people = "Enter a valid number";
    }
    if (!form.date) next.date = "Date is required";
    if (!form.time.trim()) next.time = "Time is required";
    if (!form.table) next.table = "Select a table";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] bg-white p-0 ring-0 sm:max-w-150"
      >
        {isTableOpen && (
          <div className="pointer-events-none fixed inset-0 z-60 bg-black/40" />
        )}

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          <div className="px-5 pt-5 sm:px-7 sm:pt-7">
            <DialogTitle className="text-[20px] font-semibold text-[#28293D] sm:text-[22px]">
              {t("New Reservation")}
            </DialogTitle>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit}
            noValidate
            className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6"
          >
            <div className="flex flex-col gap-5">
              <div>
                <InputField
                  data={{
                    id: "res-name",
                    label: { htmlFor: "res-name", labelText: t("Customer Name") },
                    placeholder: t("Customer Name"),
                    required: true,
                    inputProps: {
                      value: form.name,
                      onChange: (e) => set("name", e.target.value),
                    },
                  }}
                />
                {errors.name && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InputField
                  data={{
                    id: "res-email",
                    label: { htmlFor: "res-email", labelText: t("Email Address") },
                    placeholder: t("Full Name"),
                    inputProps: {
                      type: "email",
                      value: form.email,
                      onChange: (e) => set("email", e.target.value),
                    },
                  }}
                />
                <div>
                  <InputField
                    data={{
                      id: "res-phone",
                      label: { htmlFor: "res-phone", labelText: t("Phone Number") },
                      placeholder: "01X XXXX XXXX",
                      
                      required: true,
                      inputProps: {
                        value: form.phone,
                        onChange: (e) => set("phone", e.target.value),
                      },
                    }}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:items-start">
                <div>
                  <InputField
                    data={{
                      id: "res-people",
                      label: {
                        htmlFor: "res-people",
                        labelText: t("Number of people"),
                      },
                      placeholder: t("e.g 1"),
                      required: true,
                      inputProps: {
                        type: "number",
                        min: "1",
                        value: form.people,
                        onChange: (e) => set("people", e.target.value),
                      },
                    }}
                  />
                  {errors.people && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.people}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label className="mb-2.5 text-[16px] font-medium text-black">
                    {t("Date")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <DatePicker
                    value={form.date}
                    onChange={(date) => set("date", date)}
                    placeholder="06/04/2026"
                    withBackdrop
                  />
                  {errors.date && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.date}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label className="mb-2.5 text-[16px] font-medium text-black">
                    {t("Time")}<span className="text-[#C90000]">*</span>
                  </Label>
                  <TimePicker
                    value={form.time}
                    onChange={(time) => set("time", time)}
                    placeholder="07:00 PM"
                    withBackdrop
                  />
                  {errors.time && (
                    <p className="mt-1 text-[13px] text-[#C90000]">
                      {errors.time}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="res-table"
                  className="mb-2.5 text-[16px] font-medium text-black"
                >
                  {t("Select Table")}<span className="text-[#C90000]">*</span>
                </Label>
                <DropdownSelect
                  options={tableOptions}
                  selected={form.table}
                  onSelect={(value) => set("table", value)}
                  onOpenChange={setIsTableOpen}
                  placeholder={t("Select table")}
                  align="start"
                  className="md:w-full"
                  contentClassName="md:w-[var(--radix-dropdown-menu-trigger-width)]"
                />
                {errors.table && (
                  <p className="mt-1 text-[13px] text-[#C90000]">
                    {errors.table}
                  </p>
                )}
              </div>
            </div>
          </form>

          <div className="bg-white px-5 pb-5 sm:px-7 sm:pb-6">
            <Separator className="mb-4 bg-[#CACBD4] sm:mb-5" />
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  variant: "outline",
                  type: "button",
                  onClick: () => onOpenChange(false),
                  className:
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px]"
              >
                {t("Confirm Reservation")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewReservationDialog;
