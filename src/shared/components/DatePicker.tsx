import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
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
  /** Earliest selectable date as YYYY-MM-DD. Days before this are disabled. */
  minDate?: string;
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
  minDate,
  className,
  buttonClassName,
  backdropClassName,
  popoverClassName,
  popoverPlacement = "top-right",
}: DatePickerProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [viewDate, setViewDate] = useState<Date>(parseYmd(value) ?? new Date());
  const [calendarMode, setCalendarMode] = useState<"days" | "months">("days");
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // On narrow viewports anchor the popover to both edges so it cannot
    // overflow off-screen — letting CSS clamp the width via min().
    const isNarrow = window.innerWidth < 480;
    const isRtl = document.documentElement.dir === "rtl";

    const horizontal: React.CSSProperties = isNarrow
      ? {
          left: Math.max(8, rect.left),
          right: Math.max(8, window.innerWidth - rect.right),
        }
      : isRtl
        ? { left: Math.max(8, rect.left) }
        : { right: window.innerWidth - rect.right };

    // Place the popover so the entire calendar (including action buttons)
    // is visible without internal scrolling. Prefer below/above the trigger
    // when there is room; otherwise clamp the top edge to the viewport so
    // nothing is ever cropped.
    const GAP = 8;
    const MARGIN = 8;
    const POPOVER_HEIGHT = 520;
    const spaceBelow = window.innerHeight - rect.bottom - GAP - MARGIN;
    const spaceAbove = rect.top - GAP - MARGIN;
    const preferBottom = popoverPlacement === "bottom-right";

    let top: number;
    if (preferBottom && spaceBelow >= POPOVER_HEIGHT) {
      top = rect.bottom + GAP;
    } else if (!preferBottom && spaceAbove >= POPOVER_HEIGHT) {
      top = rect.top - GAP - POPOVER_HEIGHT;
    } else if (spaceBelow >= POPOVER_HEIGHT) {
      top = rect.bottom + GAP;
    } else if (spaceAbove >= POPOVER_HEIGHT) {
      top = rect.top - GAP - POPOVER_HEIGHT;
    } else {
      // Neither side fits — clamp so the popover stays fully on-screen.
      top = Math.max(
        MARGIN,
        Math.min(rect.top, window.innerHeight - POPOVER_HEIGHT - MARGIN),
      );
    }

    setPortalStyle({
      position: "fixed",
      top,
      ...horizontal,
    });
  };

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const inWrapper = wrapperRef.current?.contains(target);
      const inPortal = portalRef.current?.contains(target);
      if (!inWrapper && !inPortal) setOpen(false);
    };

    // Close (don't reposition) when the user scrolls a parent container.
    // Ignore scrolls that originate inside the popover itself.
    const handleScroll = (event: Event) => {
      const target = event.target as Node | null;
      if (target && portalRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    // capture:true catches scroll on any ancestor, not just window
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", calculatePosition);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [open]);

  const selectedDate = parseYmd(tempValue);
  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const calendarDays = buildCalendarDays(viewDate);
  const minDateObj = minDate ? parseYmd(minDate) : null;
  const isBeforeMin = (date: Date) => {
    if (!minDateObj) return false;
    const dayStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const minStart = new Date(
      minDateObj.getFullYear(),
      minDateObj.getMonth(),
      minDateObj.getDate(),
    );
    return dayStart.getTime() < minStart.getTime();
  };
  const isMonthBeforeMin = (year: number, month: number) => {
    if (!minDateObj) return false;
    const lastDay = new Date(year, month + 1, 0);
    return isBeforeMin(lastDay);
  };

  const handleToggleOpen = () => {
    if (open) {
      setOpen(false);
      return;
    }

    calculatePosition();
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
      0,
    ).getDate();

    setViewDate(
      new Date(
        viewDate.getFullYear(),
        month,
        Math.min(selectedDay, lastDayOfMonth),
      ),
    );
    setCalendarMode("days");
  };

  const calendar = open
    ? createPortal(
        <>
          {withBackdrop && (
            <button
              type="button"
              aria-label="Close calendar"
              onClick={() => setOpen(false)}
              className={cn(
                "pointer-events-auto fixed inset-0 z-9998 cursor-default bg-black/35",
                backdropClassName,
              )}
            />
          )}
          <div
            ref={portalRef}
            dir="ltr"
            style={portalStyle}
            className={cn(
              "pointer-events-auto z-9999 w-[min(98vw,392px)] sm:w-98.25 overflow-hidden rounded-[16px] bg-white px-3 py-6 shadow-lg",
              popoverClassName,
            )}
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMode((mode) =>
                        mode === "days" ? "months" : "days",
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-[8px] px-2.5 py-1 text-[18px] font-bold text-[#28293D] hover:bg-[#F5F0EA]"
                  >
                    {calendarMode === "days"
                      ? monthLabel
                      : viewDate.getFullYear()}
                    <ChevronRight
                      className={cn(
                        "size-7 transition-transform",
                        calendarMode === "months" && "rotate-90",
                      )}
                    />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setViewDate((prev) =>
                        calendarMode === "days"
                          ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                          : new Date(
                              prev.getFullYear() - 1,
                              prev.getMonth(),
                              1,
                            ),
                      )
                    }
                    className="inline-flex size-8 items-center justify-center rounded-md hover:bg-[#F5F0EA]"
                  >
                    <ChevronLeft className="size-7 text-[#000000]" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setViewDate((prev) =>
                        calendarMode === "days"
                          ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                          : new Date(
                              prev.getFullYear() + 1,
                              prev.getMonth(),
                              1,
                            ),
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
                    const isDisabled = isMonthBeforeMin(
                      viewDate.getFullYear(),
                      index,
                    );

                    return (
                      <button
                        key={month}
                        type="button"
                        disabled={isDisabled}
                        onClick={() =>
                          !isDisabled && handleMonthSelect(index)
                        }
                        className={cn(
                          "h-12 rounded-[10px] text-[15px] font-semibold transition-colors",
                          isDisabled
                            ? "cursor-not-allowed text-[#CACBD4]"
                            : isSelectedMonth
                              ? "bg-primary text-primary-foreground"
                              : "text-[#23252A] hover:bg-[#F5F0EA]",
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
                      const isDisabled = isBeforeMin(date);

                      return (
                        <button
                          key={dayValue}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => !isDisabled && setTempValue(dayValue)}
                          className={cn(
                            "mx-auto inline-flex size-9 items-center justify-center rounded-[10px] text-[16px]",
                            isDisabled
                              ? "cursor-not-allowed text-[#CACBD4]"
                              : isSelected
                                ? "bg-primary text-primary-foreground"
                                : inCurrentMonth
                                  ? "text-[#23252A] hover:bg-[#F5F0EA]"
                                  : "text-[#8B8B8B] hover:bg-[#F5F0EA]",
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
                    buttonText: t("Select"),
                    type: "button",
                    onClick: () => {
                      onChange(tempValue);
                      setCalendarMode("days");
                      setOpen(false);
                    },
                    className: "h-[48px] px-[26px]",
                  }}
                />
                <DefaultButton
                  data={{
                    buttonText: t("Cancel"),
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
              </div>
            </div>
          </div>
        </>,
        document.body,
      )
    : null;

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggleOpen}
        className={cn(
          "flex items-center justify-between h-12.5 w-full rounded-[12px] px-4.5 text-[16px] font-medium border border-[#E1E1E5] bg-white text-left cursor-pointer",
          buttonClassName,
        )}
      >
        {value ? formatFieldDate(value) : placeholder}
        <CalendarDays className="size-6" />
      </button>
      {calendar}
    </div>
  );
};

export default DatePicker;
