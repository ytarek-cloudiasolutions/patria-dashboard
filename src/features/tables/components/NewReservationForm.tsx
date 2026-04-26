import { useEffect, useMemo, useRef, useState } from "react";
import InputField from "@/shared/components/InputField";
import DefaultButton from "@/shared/components/DefaultButton";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { AddReservationFormData, DiningTable } from "../types";
import { Label } from "@/shared/components/ui/label";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";

interface NewReservationFormProps {
  tables: DiningTable[];
  onSave: (payload: {
    customerName: string;
    phone: string;
    people: number;
    date: string;
    time: string;
    tableNumber: number;
  }) => void;
  onCancel: () => void;
}

const initialState: AddReservationFormData = {
  customerName: "",
  phone: "",
  people: "",
  date: "",
  time: "",
  tableId: "",
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
const CALENDAR_PANEL_ESTIMATED_HEIGHT = 440;

const HOURS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0")
);
const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0")
);
const PERIODS = ["AM", "PM"] as const;

const toYmd = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseYmd = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatFieldDate = (value: string) => {
  const parsed = parseYmd(value);
  if (!parsed) return "";
  return parsed.toLocaleDateString("en-GB");
};

const buildCalendarDays = (viewDate: Date) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - firstDayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return {
      date,
      inCurrentMonth: date.getMonth() === month,
    };
  });
};

const parseTime24 = (value: string) => {
  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const period: "AM" | "PM" = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return {
    hour: String(hour12).padStart(2, "0"),
    minute: String(minutes).padStart(2, "0"),
    period,
  };
};

const toTime24 = (hour: string, minute: string, period: "AM" | "PM") => {
  const hourNum = Number(hour);
  let hour24 = hourNum % 12;
  if (period === "PM") hour24 += 12;
  return `${String(hour24).padStart(2, "0")}:${minute}`;
};

const formatFieldTime = (value: string) => {
  const parsed = parseTime24(value);
  if (!parsed) return "";
  return `${parsed.hour}:${parsed.minute} ${parsed.period}`;
};

interface DatePickerFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}

const DatePickerField = ({
  label,
  required,
  value,
  onChange,
}: DatePickerFieldProps) => {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [viewDate, setViewDate] = useState<Date>(
    parseYmd(value) ?? new Date()
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempValue(value);
    setViewDate(parseYmd(value) ?? new Date());
  }, [value]);

  useEffect(() => {
    if (!open || value) return;
    const today = new Date();
    setTempValue(toYmd(today));
    setViewDate(today);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(
        spaceBelow < CALENDAR_PANEL_ESTIMATED_HEIGHT && spaceAbove > spaceBelow
      );
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  const selectedDate = parseYmd(tempValue);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const calendarDays = buildCalendarDays(viewDate);

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-2.5">
      <Label className="text-[#000000] text-[16px] font-medium block">
        {label}
        {required && <span className="text-[#C90000] ml-1">*</span>}
      </Label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-12.5 w-full rounded-[12px] bg-white border border-[#E5E5E5] px-4 text-left text-[16px] text-[#23252A] flex items-center justify-between cursor-pointer"
      >
        <span className={value ? "text-[#23252A]" : "text-[#8B8B8B]"}>
          {value ? formatFieldDate(value) : "dd/MM/YYYY"}
        </span>
        <CalendarDays className="size-5 text-[#000000]" />
      </button>

      {open && (
        <div
          className={`absolute left-0 z-[80] w-full rounded-[16px] border border-[#E5E5E5] bg-white p-4 shadow-lg ${
            openUpward ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
          }`}
        >
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[18px] font-semibold text-[#28293D]">
                {monthLabel}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setViewDate(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                    )
                  }
                  className="inline-flex size-8 items-center justify-center rounded-md hover:bg-[#F5F0EA] cursor-pointer"
                >
                  <ChevronLeft className="size-5 text-[#000000]" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setViewDate(
                      (prev) =>
                        new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                    )
                  }
                  className="inline-flex size-8 items-center justify-center rounded-md hover:bg-[#F5F0EA] cursor-pointer"
                >
                  <ChevronRight className="size-5 text-[#000000]" />
                </button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-7 text-center text-[14px] text-[#8B8B8B]">
              {WEEK_DAYS.map((day) => (
                <span key={day} className="py-1">
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
              {calendarDays.map(({ date, inCurrentMonth }) => {
                const dayValue = toYmd(date);
                const isSelected =
                  selectedDate && dayValue === toYmd(selectedDate);
                const isPastDay = date < todayStart;

                return (
                  <button
                    key={dayValue}
                    type="button"
                    disabled={isPastDay}
                    onClick={() => {
                      if (isPastDay) return;
                      setTempValue(dayValue);
                    }}
                    className={`mx-auto inline-flex size-9 items-center justify-center rounded-[10px] text-[16px] cursor-pointer ${
                      isPastDay
                        ? "text-[#C7C7C7] cursor-not-allowed"
                        : ""
                    } ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : inCurrentMonth
                        ? "text-[#23252A] hover:bg-[#F5F0EA]"
                        : "text-[#8B8B8B] hover:bg-[#F5F0EA]"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <DefaultButton
                data={{
                  buttonText: "Cancel",
                  type: "button",
                  variant: "outline",
                  onClick: () => {
                    setTempValue(value);
                    setOpen(false);
                  },
                  className:
                    "h-11 px-6 text-primary border-primary hover:bg-white hover:text-primary",
                }}
              />
              <DefaultButton
                data={{
                  buttonText: "Select",
                  type: "button",
                  onClick: () => {
                    onChange(tempValue);
                    setOpen(false);
                  },
                  className: "h-11 px-6",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface TimePickerFieldProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}

const TimePickerField = ({
  label,
  required,
  value,
  onChange,
}: TimePickerFieldProps) => {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const parsedInitial = parseTime24(value);
  const now = new Date();

  const [tempHour, setTempHour] = useState(
    parsedInitial?.hour ?? String((now.getHours() % 12) || 12).padStart(2, "0")
  );
  const [tempMinute, setTempMinute] = useState(
    parsedInitial?.minute ?? String(now.getMinutes()).padStart(2, "0")
  );
  const [tempPeriod, setTempPeriod] = useState<"AM" | "PM">(
    parsedInitial?.period ?? (now.getHours() >= 12 ? "PM" : "AM")
  );

  useEffect(() => {
    const parsed = parseTime24(value);
    const current = new Date();
    setTempHour(
      parsed?.hour ?? String((current.getHours() % 12) || 12).padStart(2, "0")
    );
    setTempMinute(
      parsed?.minute ?? String(current.getMinutes()).padStart(2, "0")
    );
    setTempPeriod(parsed?.period ?? (current.getHours() >= 12 ? "PM" : "AM"));
  }, [value]);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(
        spaceBelow < CALENDAR_PANEL_ESTIMATED_HEIGHT && spaceAbove > spaceBelow
      );
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-2.5">
      <Label className="text-[#000000] text-[16px] font-medium block">
        {label}
        {required && <span className="text-[#C90000] ml-1">*</span>}
      </Label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-12.5 w-full rounded-[12px] bg-white border border-[#E5E5E5] px-4 text-left text-[16px] text-[#23252A] flex items-center justify-between cursor-pointer"
      >
        <span className={value ? "text-[#23252A]" : "text-[#8B8B8B]"}>
          {value ? formatFieldTime(value) : "--:-- --"}
        </span>
        <Clock3 className="size-5 text-[#000000]" />
      </button>

      {open && (
        <div
          className={`absolute left-0 z-[80] w-full rounded-[16px] border border-[#E5E5E5] bg-white p-4 shadow-lg ${
            openUpward ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
          }`}
        >
          <div className="grid grid-cols-3 gap-2">
            <div className="max-h-44 overflow-y-auto rounded-[12px] border border-[#E5E5E5] p-1">
              {HOURS.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => setTempHour(hour)}
                  className={`mb-1 w-full rounded-[8px] py-2 text-[16px] last:mb-0 ${
                    tempHour === hour
                      ? "bg-primary text-primary-foreground"
                      : "text-[#23252A] hover:bg-[#F5F0EA]"
                  }`}
                >
                  {hour}
                </button>
              ))}
            </div>

            <div className="max-h-44 overflow-y-auto rounded-[12px] border border-[#E5E5E5] p-1">
              {MINUTES.map((minute) => (
                <button
                  key={minute}
                  type="button"
                  onClick={() => setTempMinute(minute)}
                  className={`mb-1 w-full rounded-[8px] py-2 text-[16px] last:mb-0 ${
                    tempMinute === minute
                      ? "bg-primary text-primary-foreground"
                      : "text-[#23252A] hover:bg-[#F5F0EA]"
                  }`}
                >
                  {minute}
                </button>
              ))}
            </div>

            <div className="rounded-[12px] border border-[#E5E5E5] p-1">
              {PERIODS.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setTempPeriod(period)}
                  className={`mb-1 w-full rounded-[8px] py-2 text-[16px] last:mb-0 ${
                    tempPeriod === period
                      ? "bg-primary text-primary-foreground"
                      : "text-[#23252A] hover:bg-[#F5F0EA]"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <DefaultButton
              data={{
                buttonText: "Cancel",
                type: "button",
                variant: "outline",
                onClick: () => setOpen(false),
                className:
                  "h-11 px-6 text-primary border-primary hover:bg-white hover:text-primary",
              }}
            />
            <DefaultButton
              data={{
                buttonText: "Select",
                type: "button",
                onClick: () => {
                  onChange(toTime24(tempHour, tempMinute, tempPeriod));
                  setOpen(false);
                },
                className: "h-11 px-6",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const NewReservationForm = ({
  tables,
  onSave,
  onCancel,
}: NewReservationFormProps) => {
  const [formData, setFormData] = useState<AddReservationFormData>(initialState);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!canSubmit) return;

    const selectedTable = tables.find((table) => table.id === formData.tableId);
    if (!selectedTable) return;

    onSave({
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      people: Number(formData.people),
      date: formData.date,
      time: formData.time,
      tableNumber: selectedTable.tableNumber,
    });
  };

  return (
    <form className="flex flex-col gap-8 p-2.5">
      <InputField
        data={{
          id: "customerName",
          placeholder: "Full Name",
          required: true,
          label: { htmlFor: "customerName", labelText: "Customer Name" },
          inputProps: {
            name: "customerName",
            value: formData.customerName,
            onChange: handleInputChange,
          },
        }}
      />

      <div className="grid grid-cols-2 gap-6">
        <InputField
          data={{
            id: "phone",
            placeholder: "01X XXXX XXXX",
            required: true,
            label: { htmlFor: "phone", labelText: "Phone Number" },
            inputProps: {
              name: "phone",
              value: formData.phone,
              onChange: handleInputChange,
            },
          }}
        />
        <InputField
          data={{
            id: "people",
            type: "number",
            placeholder: "e.g. 1",
            required: true,
            label: { htmlFor: "people", labelText: "Number of People" },
            inputProps: {
              name: "people",
              value: formData.people,
              onChange: handleInputChange,
              min: "1",
            },
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <DatePickerField
          label="Date"
          required
          value={formData.date}
          onChange={(date) =>
            setFormData((prev) => ({
              ...prev,
              date,
            }))
          }
        />
        <TimePickerField
          label="Time"
          required
          value={formData.time}
          onChange={(time) =>
            setFormData((prev) => ({
              ...prev,
              time,
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <Label className="text-[#000000] text-[16px] font-medium block">
          Select Table <span className="text-[#C90000] ml-1">*</span>
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12.5 w-full justify-between rounded-lg border-input bg-white px-4 py-2 text-base font-normal cursor-pointer focus-visible:border-input focus-visible:ring-0"
            >
              {formData.tableId
                ? (() => {
                    const selectedTable = tables.find(
                      (table) => table.id === formData.tableId
                    );
                    if (!selectedTable) return "Select table";
                    return `Table ${selectedTable.tableNumber} - ${selectedTable.section}`;
                  })()
                : "Select table"}
              <ChevronDown className="size-6 text-[#000000]" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
            className="z-50 rounded-[16px] px-2 py-3 [&>[data-slot=dropdown-menu-item]+[data-slot=dropdown-menu-item]]:mt-2"
          >
            {tables.map((table) => (
              <DropdownMenuItem
                key={table.id}
                className={
                  formData.tableId === table.id
                    ? "rounded-[16px] px-3 py-2 text-[12px] font-medium bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                    : "rounded-[16px] px-3 py-2 text-[12px]"
                }
                onSelect={() =>
                  setFormData((prev) => ({
                    ...prev,
                    tableId: table.id,
                  }))
                }
              >
                Table {table.tableNumber} - {table.section}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
            buttonText: "Confirm Reservation",
            type: "button",
            onClick: handleSave,
            className: !canSubmit ? "opacity-50 pointer-events-none" : undefined,
          }}
        />
      </div>
    </form>
  );
};

export default NewReservationForm;
