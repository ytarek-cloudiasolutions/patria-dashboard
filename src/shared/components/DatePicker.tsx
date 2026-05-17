import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import DefaultButton from "./DefaultButton";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  withBackdrop?: boolean;
  className?: string;
  buttonClassName?: string;
  backdropClassName?: string;
  popoverClassName?: string;
  popoverPlacement?: "top-right" | "bottom-right";
}

const DatePicker = ({
  value,
  onChange,
  placeholder = "dd/MM/YYYY",
  withBackdrop = false,
  className,
  buttonClassName,
  backdropClassName,
  popoverClassName,
  popoverPlacement = "top-right",
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [viewDate, setViewDate] = useState<Date>(parseYmd(value) ?? new Date());
  const [calendarMode, setCalendarMode] = useState<"days" | "months">("days");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  const selectedDate = parseYmd(tempValue);
  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const calendarDays = buildCalendarDays(viewDate);

  const handleToggleOpen = () => {
    if (open) {
      setOpen(false);
      return;
    }

    const baseDate = parseYmd(value) ?? new Date();
    setTempValue(value || toYmd(baseDate));
    setViewDate(baseDate);
    setCalendarMode("days");
    setOpen(true);
  };

  const handleMonthSelect = (month: number) => {
    const selectedDay = selectedDate?.getDate() ?? viewDate.getDate();
    const lastDayOfMonth = new Date(
      viewDate.getFullYear(),
      month + 1,
      0
    ).getDate();

    setViewDate(
      new Date(
        viewDate.getFullYear(),
        month,
        Math.min(selectedDay, lastDayOfMonth)
      )
    );
    setCalendarMode("days");
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={handleToggleOpen}
        className={cn(
          "flex items-center justify-between h-12.5 w-full rounded-[12px] px-4.5 text-[16px] font-medium border border-[#E1E1E5] bg-white text-left cursor-pointer",
          buttonClassName
        )}
      >
        {value ? formatFieldDate(value) : placeholder}
        <CalendarDays className="size-6" />
      </button>
      {open && (
        <>
          {withBackdrop && (
            <button
              type="button"
              aria-label="Close calendar"
              onClick={() => setOpen(false)}
              className={cn(
                "fixed inset-0 z-[80] cursor-default bg-black/35",
                backdropClassName
              )}
            />
          )}
          <div
            className={cn(
              "absolute right-0 z-[90] w-98.25 rounded-[16px] bg-white px-3 py-6 shadow-lg",
              popoverPlacement === "top-right"
                ? "bottom-[calc(100%+8px)]"
                : "top-[calc(100%+8px)]",
              popoverClassName
            )}
          >
            <div className="max-h-[70vh] overflow-y-auto pr-1">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMode((mode) =>
                      mode === "days" ? "months" : "days"
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-[8px] px-2.5 py-1 text-[18px] font-bold text-[#28293D] hover:bg-[#F5F0EA]"
                >
                  {calendarMode === "days" ? monthLabel : viewDate.getFullYear()}
                  <ChevronRight
                    className={cn(
                      "size-7 transition-transform",
                      calendarMode === "months" && "rotate-90"
                    )}
                  />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setViewDate(
                      (prev) =>
                        calendarMode === "days"
                          ? new Date(
                              prev.getFullYear(),
                              prev.getMonth() - 1,
                              1
                            )
                          : new Date(prev.getFullYear() - 1, prev.getMonth(), 1)
                    )
                  }
                  className="inline-flex size-8 items-center justify-center rounded-md hover:bg-[#F5F0EA]"
                >
                  <ChevronLeft className="size-7 text-[#000000]" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setViewDate(
                      (prev) =>
                        calendarMode === "days"
                          ? new Date(
                              prev.getFullYear(),
                              prev.getMonth() + 1,
                              1
                            )
                          : new Date(prev.getFullYear() + 1, prev.getMonth(), 1)
                    )
                  }
                  className="inline-flex size-8 items-center justify-center rounded-md hover:bg-[#F5F0EA]"
                >
                  <ChevronRight className="size-7 text-[#000000]" />
                </button>
              </div>
            </div>

            {calendarMode === "months" ? (
              <div className="grid grid-cols-3 gap-2 px-2.5 py-2">
                {MONTHS.map((month, index) => {
                  const isSelectedMonth =
                    selectedDate?.getFullYear() === viewDate.getFullYear() &&
                    selectedDate.getMonth() === index;

                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handleMonthSelect(index)}
                      className={cn(
                        "h-12 rounded-[10px] text-[15px] font-semibold transition-colors",
                        isSelectedMonth
                          ? "bg-primary text-primary-foreground"
                          : "text-[#23252A] hover:bg-[#F5F0EA]"
                      )}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
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

                    return (
                      <button
                        key={dayValue}
                        type="button"
                        onClick={() => setTempValue(dayValue)}
                        className={cn(
                          "mx-auto inline-flex size-9 items-center justify-center rounded-[10px] text-[16px]",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : inCurrentMonth
                            ? "text-[#23252A] hover:bg-[#F5F0EA]"
                            : "text-[#8B8B8B] hover:bg-[#F5F0EA]"
                        )}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            <div className="mt-6 flex justify-end gap-6 px-2.5">
              <DefaultButton
                data={{
                  buttonText: "Cancel",
                  type: "button",
                  variant: "ghost",
                  onClick: () => {
                    setTempValue(value);
                    setCalendarMode("days");
                    setOpen(false);
                  },
                  className:
                    "h-[48px] text-primary hover:bg-white hover:text-primary",
                }}
              />
              <DefaultButton
                data={{
                  buttonText: "Select",
                  type: "button",
                  onClick: () => {
                    onChange(tempValue);
                    setCalendarMode("days");
                    setOpen(false);
                  },
                  className: "h-[48px] px-[26px]",
                }}
              />
            </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DatePicker;
