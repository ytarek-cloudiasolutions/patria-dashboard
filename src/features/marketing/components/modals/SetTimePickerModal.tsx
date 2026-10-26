import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/shared/i18n/useTranslation";

interface SetTimePickerModalProps {
  isOpen: boolean;
  initialTime?: string; // e.g. "06:28:55 PM" or "10:00 AM"
  onClose: () => void;
  onSave: (formattedTime: string) => void;
}

const ITEM_HEIGHT = 44; // px per row item

export const getFormattedLocalTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${period}`;
};

const parseTimeToParts = (timeStr?: string) => {
  const effective = timeStr?.trim() ? timeStr : getFormattedLocalTime();
  const parts = effective.match(/(\d+):(\d+)(?::(\d+))?\s*(AM|PM)?/i);
  if (!parts) {
    const fallback = getFormattedLocalTime();
    const lparts = fallback.match(/(\d+):(\d+)(?::(\d+))?\s*(AM|PM)?/i)!;
    return {
      h: lparts[1].padStart(2, "0"),
      m: lparts[2].padStart(2, "0"),
      s: (lparts[3] || "00").padStart(2, "0"),
      p: (lparts[4]?.toUpperCase() as "AM" | "PM") || "AM",
    };
  }
  return {
    h: parts[1].padStart(2, "0"),
    m: parts[2].padStart(2, "0"),
    s: (parts[3] ? parts[3] : "00").padStart(2, "0"),
    p: (parts[4] ? parts[4].toUpperCase() : "PM") as "AM" | "PM",
  };
};

interface WheelColumnProps {
  items: string[];
  value: string;
  onChange: (value: string) => void;
  width?: string;
}

const WheelColumn = ({
  items,
  value,
  onChange,
  width = "w-11",
}: WheelColumnProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync scroll position on value changes
  useEffect(() => {
    const idx = items.indexOf(value);
    if (idx !== -1 && containerRef.current) {
      const targetTop = idx * ITEM_HEIGHT;
      if (Math.abs(containerRef.current.scrollTop - targetTop) > 2) {
        containerRef.current.scrollTop = targetTop;
      }
    }
  }, [value, items]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
    if (items[clampedIndex] && items[clampedIndex] !== value) {
      onChange(items[clampedIndex]);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        "h-[132px] overflow-y-auto overflow-x-hidden snap-y snap-mandatory select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        width
      )}
    >
      {/* Top spacer so first item can center in middle row */}
      <div style={{ height: ITEM_HEIGHT }} className="shrink-0" />

      {items.map((item) => {
        const isSelected = item === value;
        return (
          <div
            key={item}
            onClick={() => onChange(item)}
            style={{ height: ITEM_HEIGHT }}
            className={cn(
              "flex items-center justify-center snap-center text-xl font-['Inter',sans-serif] transition-all cursor-pointer",
              isSelected
                ? "text-[#8F6900] font-bold"
                : "text-[#8C8C8C] font-medium hover:text-black"
            )}
          >
            {item}
          </div>
        );
      })}

      {/* Bottom spacer so last item can center in middle row */}
      <div style={{ height: ITEM_HEIGHT }} className="shrink-0" />
    </div>
  );
};

export const SetTimePickerModal = ({
  isOpen,
  initialTime,
  onClose,
  onSave,
}: SetTimePickerModalProps) => {
  const { t } = useTranslation();

  const [hours, setHours] = useState(() => parseTimeToParts(initialTime).h);
  const [minutes, setMinutes] = useState(() => parseTimeToParts(initialTime).m);
  const [seconds, setSeconds] = useState(() => parseTimeToParts(initialTime).s);
  const [period, setPeriod] = useState<"AM" | "PM">(
    () => parseTimeToParts(initialTime).p
  );

  // When modal opens, sync to initialTime or current local time
  useEffect(() => {
    if (isOpen) {
      const parsed = parseTimeToParts(initialTime);
      setHours(parsed.h);
      setMinutes(parsed.m);
      setSeconds(parsed.s);
      setPeriod(parsed.p);
    }
  }, [isOpen, initialTime]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const hoursList = Array.from({ length: 12 }, (_, i) => pad(i + 1));
  const minutesList = Array.from({ length: 60 }, (_, i) => pad(i));
  const secondsList = Array.from({ length: 60 }, (_, i) => pad(i));
  const periodList = ["PM", "AM"];

  if (!isOpen) return null;

  const handleSave = () => {
    const formatted = `${hours}:${minutes}:${seconds} ${period}`;
    onSave(formatted);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-[386px] p-4 bg-[#F8F8F8] rounded-[16px] border border-[#CACBD4] shadow-2xl flex flex-col justify-start items-start gap-[18px] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title: Set Time */}
        <div className="text-black text-xs font-semibold font-['Montserrat',sans-serif] leading-3 tracking-tight">
          {t("Set Time")}
        </div>

        {/* 3-Row Scroll Wheel Drums */}
        <div className="self-stretch relative flex items-center justify-center gap-4 sm:gap-6 py-1 select-none">
          {/* Hours Wheel */}
          <WheelColumn
            items={hoursList}
            value={hours}
            onChange={setHours}
            width="w-10"
          />

          {/* First Colon */}
          <div className="w-2.5 h-[132px] flex items-center justify-center pointer-events-none">
            <span className="text-[#8F6900] text-xl font-bold font-['Inter',sans-serif]">
              :
            </span>
          </div>

          {/* Minutes Wheel */}
          <WheelColumn
            items={minutesList}
            value={minutes}
            onChange={setMinutes}
            width="w-10"
          />

          {/* Second Colon */}
          <div className="w-2.5 h-[132px] flex items-center justify-center pointer-events-none">
            <span className="text-[#8F6900] text-xl font-bold font-['Inter',sans-serif]">
              :
            </span>
          </div>

          {/* Seconds Wheel */}
          <WheelColumn
            items={secondsList}
            value={seconds}
            onChange={setSeconds}
            width="w-10"
          />

          {/* Period Wheel (AM/PM) */}
          <WheelColumn
            items={periodList}
            value={period}
            onChange={(val) => setPeriod(val as "AM" | "PM")}
            width="w-12"
          />
        </div>

        {/* Separator */}
        <div className="self-stretch h-px bg-[#CACBD4]" />

        {/* Action Buttons */}
        <div className="self-stretch flex justify-end items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="h-14 px-7 py-4 rounded-[5px] outline outline-1 outline-offset-[-1px] outline-[#8F6900] text-[#8F6900] text-base font-semibold font-['Montserrat',sans-serif] leading-6 hover:bg-[#F5F0EA] transition-colors cursor-pointer"
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-14 px-7 py-4 bg-[#8F6900] hover:bg-[#785700] rounded-[5px] text-white text-base font-semibold font-['Montserrat',sans-serif] leading-6 transition-colors cursor-pointer shadow-xs"
          >
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};
