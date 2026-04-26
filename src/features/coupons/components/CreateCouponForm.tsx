import { useEffect, useRef, useState } from "react";
import InputField from "@/shared/components/InputField";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import { Label } from "@/shared/components/ui/label";
import DefaultButton from "@/shared/components/DefaultButton";
import type { CouponProps } from "../types";

interface CreateCouponFormProps {
  initialData?: CouponProps;
  onSave: (coupon: CouponProps) => void;
  onCancel: () => void;
}

const DISCOUNT_TYPE_OPTIONS: {
  label: string;
  value: CouponProps["discountType"];
}[] = [
  { label: "Percentage %", value: "Percentage" },
  { label: "Fixed amount (EGP)", value: "Fixed" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];
const CALENDAR_PANEL_ESTIMATED_HEIGHT = 440;

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];

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
    if (!open) return;
    if (value) return;

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
                    (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
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
                    (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
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
              const isSelected = selectedDate && dayValue === toYmd(selectedDate);
              return (
                <button
                  key={dayValue}
                  type="button"
                  onClick={() => setTempValue(dayValue)}
                  className={`mx-auto inline-flex size-9 items-center justify-center rounded-[10px] text-[16px] cursor-pointer ${
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

const getInitialFormData = (initialData?: CouponProps) => ({
  couponCode: initialData?.code ?? "",
  discountType: initialData?.discountType ?? ("Percentage" as const),
  discountValue: initialData ? String(initialData.discountValue) : "",
  minOrderFee: initialData?.minOrderFee ? String(initialData.minOrderFee) : "",
  usageLimit: initialData?.usageLimit ? String(initialData.usageLimit) : "",
  startDate: initialData?.startDate ?? "",
  endDate: initialData?.endDate ?? "",
  isActive: initialData?.isActive ?? true,
});

const CreateCouponForm = ({
  initialData,
  onSave,
  onCancel,
}: CreateCouponFormProps) => {
  const [formData, setFormData] = useState(getInitialFormData(initialData));

  useEffect(() => {
    setFormData(getInitialFormData(initialData));
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (
      !formData.couponCode.trim() ||
      !formData.discountValue ||
      !formData.startDate ||
      !formData.endDate
    ) {
      return;
    }

    onSave({
      id: initialData?.id ?? Math.floor(Math.random() * 10000),
      code: formData.couponCode.trim(),
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      minOrderFee: formData.minOrderFee
        ? parseFloat(formData.minOrderFee)
        : undefined,
      usageCount: initialData?.usageCount ?? 0,
      usageLimit: formData.usageLimit
        ? parseInt(formData.usageLimit, 10)
        : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
    });
  };

  return (
    <form
      className="flex flex-col gap-8 p-2.5"
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
      }}
    >
      <InputField
        data={{
          id: "couponCode",
          placeholder: "e.g. WELCOME20",
          required: true,
          label: { htmlFor: "couponCode", labelText: "Discount Code" },
          inputProps: {
            name: "couponCode",
            value: formData.couponCode,
            onChange: handleInputChange,
          },
        }}
      />

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2.5">
          <Label className="text-[#000000] text-[16px] font-medium block">
            Discount Type <span className="text-[#C90000] ml-1">*</span>
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-12.5 w-full justify-between rounded-lg border-input bg-white px-4 py-2 text-base font-normal cursor-pointer focus-visible:border-input focus-visible:ring-0"
              >
                {
                  DISCOUNT_TYPE_OPTIONS.find(
                    (option) => option.value === formData.discountType
                  )?.label
                }
                <ChevronDown className="size-6 text-[#000000]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
              className="z-50 rounded-[16px] px-2 py-3 [&>[data-slot=dropdown-menu-item]+[data-slot=dropdown-menu-item]]:mt-2"
            >
              {DISCOUNT_TYPE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className={
                    formData.discountType === option.value
                      ? "rounded-[16px] px-3 py-2 text-[12px] font-medium bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                      : "rounded-[16px] px-3 py-2 text-[12px]"
                  }
                  onSelect={() =>
                    setFormData((prev) => ({
                      ...prev,
                      discountType: option.value,
                    }))
                  }
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <InputField
          data={{
            id: "discountValue",
            type: "number",
            placeholder: formData.discountType === "Percentage" ? "e.g. 20" : "e.g. 50",
            required: true,
            label: {
              htmlFor: "discountValue",
              labelText: `Discount ${formData.discountType === "Percentage" ? "%" : "EGP"}`,
            },
            inputProps: {
              name: "discountValue",
              value: formData.discountValue,
              onChange: handleInputChange,
              min: "0",
              step: "0.01",
            },
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <InputField
          data={{
            id: "minOrderFee",
            type: "number",
            placeholder: "e.g. 85",
            label: { htmlFor: "minOrderFee", labelText: "Min. Order (EGP) (Optional)" },
            inputProps: {
              name: "minOrderFee",
              value: formData.minOrderFee,
              onChange: handleInputChange,
              min: "0",
              step: "0.01",
            },
          }}
        />
        <InputField
          data={{
            id: "usageLimit",
            type: "number",
            placeholder: "e.g. 20",
            label: { htmlFor: "usageLimit", labelText: "Maximum Usage (Optional)" },
            inputProps: {
              name: "usageLimit",
              value: formData.usageLimit,
              onChange: handleInputChange,
              min: "0",
              step: "1",
            },
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <DatePickerField
          label="Start Date"
          required
          value={formData.startDate}
          onChange={(date) =>
            setFormData((prev) => ({
              ...prev,
              startDate: date,
            }))
          }
        />
        <DatePickerField
          label="End Date"
          required
          value={formData.endDate}
          onChange={(date) =>
            setFormData((prev) => ({
              ...prev,
              endDate: date,
            }))
          }
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <Label className="text-[#000000] text-[16px] font-medium block">
          Status <span className="text-[#C90000] ml-1">*</span>
        </Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-12.5 w-full justify-between rounded-lg border-input bg-white px-4 py-2 text-base font-normal cursor-pointer focus-visible:border-input focus-visible:ring-0"
            >
              {formData.isActive ? "Active" : "Inactive"}
              <ChevronDown className="size-6 text-[#000000]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
            className="z-50 rounded-[16px] px-2 py-3 [&>[data-slot=dropdown-menu-item]+[data-slot=dropdown-menu-item]]:mt-2"
          >
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={String(option.value)}
                className={
                  formData.isActive === option.value
                    ? "rounded-[16px] px-3 py-2 text-[12px] font-medium bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                    : "rounded-[16px] px-3 py-2 text-[12px]"
                }
                onSelect={() =>
                  setFormData((prev) => ({ ...prev, isActive: option.value }))
                }
              >
                {option.label}
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
            buttonText: initialData ? "Update Coupon" : "Create Coupon",
            type: "submit",
          }}
        />
      </div>
    </form>
  );
};

export default CreateCouponForm;
