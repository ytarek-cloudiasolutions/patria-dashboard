import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";
import DefaultButton from "./DefaultButton";

type Period = "AM" | "PM";

interface TimeValue {
  hour: number; // 1-12
  minute: number; // 0-59
  period: Period;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 5-minute steps
const PERIODS: Period[] = ["AM", "PM"];

const pad = (value: number) => String(value).padStart(2, "0");

const formatTime = ({ hour, minute, period }: TimeValue) =>
  `${pad(hour)}:${pad(minute)} ${period}`;

const parseTime = (value: string): TimeValue | null => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
  return { hour, minute, period: match[3].toUpperCase() as Period };
};

const DEFAULT_TIME: TimeValue = { hour: 12, minute: 0, period: "PM" };

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  withBackdrop?: boolean;
  className?: string;
  buttonClassName?: string;
  backdropClassName?: string;
  popoverClassName?: string;
  popoverPlacement?: "top-right" | "bottom-right";
}

const TimePicker = ({
  value,
  onChange,
  placeholder = "hh:mm AM/PM",
  withBackdrop = false,
  className,
  buttonClassName,
  backdropClassName,
  popoverClassName,
  popoverPlacement = "bottom-right",
}: TimePickerProps) => {
  const { dir, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState<TimeValue>(parseTime(value) ?? DEFAULT_TIME);
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const isNarrow = window.innerWidth < 480;
    const horizontal: React.CSSProperties = isNarrow
      ? {
          left: Math.max(8, rect.left),
          right: Math.max(8, window.innerWidth - rect.right),
        }
      : { right: window.innerWidth - rect.right };

    const GAP = 8;
    const MARGIN = 8;
    const POPOVER_HEIGHT = 320;
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
      top = Math.max(
        MARGIN,
        Math.min(rect.top, window.innerHeight - POPOVER_HEIGHT - MARGIN),
      );
    }

    setPortalStyle({ position: "fixed", top, ...horizontal });
  };

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const inWrapper = wrapperRef.current?.contains(target);
      const inPortal = portalRef.current?.contains(target);
      if (!inWrapper && !inPortal) setOpen(false);
    };

    const handleScroll = (event: Event) => {
      const target = event.target as Node | null;
      if (target && portalRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", calculatePosition);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", calculatePosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleToggleOpen = () => {
    if (open) {
      setOpen(false);
      return;
    }
    calculatePosition();
    setTemp(parseTime(value) ?? DEFAULT_TIME);
    setOpen(true);
  };

  const columnItemClass = (active: boolean) =>
    cn(
      "w-full rounded-[10px] px-3 py-2 text-center text-[15px] font-semibold transition-colors",
      active
        ? "bg-primary text-primary-foreground"
        : "text-[#23252A] hover:bg-[#F5F0EA]",
    );

  const picker = open
    ? createPortal(
        <>
          {withBackdrop && (
            <button
              type="button"
              aria-label="Close time picker"
              onClick={() => setOpen(false)}
              className={cn(
                "pointer-events-auto fixed inset-0 z-9998 cursor-default bg-black/35",
                backdropClassName,
              )}
            />
          )}
          <div
            ref={portalRef}
            style={portalStyle}
            className={cn(
              "pointer-events-auto z-9999 w-[min(98vw,320px)] overflow-hidden rounded-[16px] bg-white px-3 py-5 shadow-lg",
              popoverClassName,
            )}
          >
            <div className="grid grid-cols-3 gap-2">
              {/* Hours */}
              <div className="flex max-h-[220px] flex-col gap-1 overflow-y-auto pr-1">
                {HOURS.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => setTemp((prev) => ({ ...prev, hour }))}
                    className={columnItemClass(temp.hour === hour)}
                  >
                    {pad(hour)}
                  </button>
                ))}
              </div>

              {/* Minutes */}
              <div className="flex max-h-[220px] flex-col gap-1 overflow-y-auto pr-1">
                {MINUTES.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => setTemp((prev) => ({ ...prev, minute }))}
                    className={columnItemClass(temp.minute === minute)}
                  >
                    {pad(minute)}
                  </button>
                ))}
              </div>

              {/* Period */}
              <div className="flex flex-col gap-1">
                {PERIODS.map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setTemp((prev) => ({ ...prev, period }))}
                    className={columnItemClass(temp.period === period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-6 px-2.5">
              <DefaultButton
                data={{
                  buttonText: t("Cancel"),
                  type: "button",
                  variant: "ghost",
                  onClick: () => {
                    setTemp(parseTime(value) ?? DEFAULT_TIME);
                    setOpen(false);
                  },
                  className:
                    "h-[48px] text-primary hover:bg-white hover:text-primary",
                }}
              />
              <DefaultButton
                data={{
                  buttonText: t("Select"),
                  type: "button",
                  onClick: () => {
                    onChange(formatTime(temp));
                    setOpen(false);
                  },
                  className: "h-[48px] px-[26px]",
                }}
              />
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
        dir="ltr"
        onClick={handleToggleOpen}
        className={cn(
          "flex h-12.5 w-full cursor-pointer items-center justify-between rounded-[12px] border border-[#E1E1E5] bg-white px-4.5 text-[16px] font-medium",
          buttonClassName,
        )}
      >
        {dir === "rtl" ? (
          <>
            <Clock className="size-6" />
            {value || placeholder}
          </>
        ) : (
          <>
            {value || placeholder}
            <Clock className="size-6" />
          </>
        )}
      </button>
      {picker}
    </div>
  );
};

export default TimePicker;
