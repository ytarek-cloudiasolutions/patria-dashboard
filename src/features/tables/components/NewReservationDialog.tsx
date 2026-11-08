import { useEffect, useMemo, useState } from "react";
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
import { useTranslation } from "@/shared/i18n/useTranslation";
import type { ReservationFormData } from "../types";
import type { Reservation, Table } from "../store/tableTypes";
import { getReservations } from "../api/tablesApi";
import {
  hasConflictingReservation,
  reservationsForTable,
} from "../utils/tableHelpers";

const FORM_ID = "new-reservation-form";
// Same shape the backend's isValidPhone/AddDriverDialog's WHATSAPP_PHONE_REGEX
// already accept — this field previously had no validation beyond "non-empty".
const PHONE_REGEX = /^(\d{11}|\+\d{10,14})$/;

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
  phone: "",
  people: "",
  date: "",
  time: "",
  table: "",
};

interface NewReservationDialogProps {
  open: boolean;
  tables: Table[];
  onOpenChange: (open: boolean) => void;
  onSave: (data: ReservationFormData) => void;
}

const NewReservationDialog = ({
  open,
  tables,
  onOpenChange,
  onSave,
}: NewReservationDialogProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<ReservationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReservationFormData, string>>
  >({});
  const [isTableOpen, setIsTableOpen] = useState(false);
  // Reservations for whichever date is currently picked in THIS dialog —
  // fetched independently of the page's own date-filtered list (a separate
  // concern, shown behind the dialog) so changing the date here doesn't
  // clobber what the Tables page's "Today's Reservations" list is showing.
  const [reservationsForDate, setReservationsForDate] = useState<Reservation[]>([]);

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

  useEffect(() => {
    // The open-effect above always sets a date as soon as the dialog opens,
    // so this only ever skips the fetch while actually closed.
    if (!open || !form.date) return;
    let cancelled = false;
    getReservations(form.date)
      .then((res) => {
        // Response shape is flat (sendSuccess returns the data object
        // directly), but typed as the nested ApiResponse wrapper — same
        // dual-shape defensiveness tablesSaga.ts's handleGetReservations
        // already needs for this same endpoint.
        const flat = res as unknown as { reservations?: Reservation[] };
        const nested = res as unknown as { data?: { reservations?: Reservation[] } };
        const list = flat.reservations || nested.data?.reservations || [];
        if (!cancelled) setReservationsForDate(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setReservationsForDate([]);
      });
    return () => {
      cancelled = true;
    };
  }, [open, form.date]);

  // A table someone could pick is "unavailable" only for the SPECIFIC
  // date+time that actually conflicts with an existing reservation on it
  // (within the backend's own minimum gap) — not permanently blocked just
  // for having any reservation at all. Also surface what times a table
  // already has booked that day so staff can see the schedule at a glance,
  // same as the request: a table should look available again once a
  // non-conflicting time is picked.
  const tableOptions = useMemo(() => {
    return tables.map((tbl) => {
      const tblReservations = reservationsForTable(reservationsForDate, tbl._id);
      // r.time is already "HH:mm" (24h) from the backend — no conversion needed.
      const bookedTimes = tblReservations.map((r) => r.time).sort();
      const conflicts =
        !!form.date && !!form.time &&
        hasConflictingReservation(tblReservations, form.date, form.time);

      const label = bookedTimes.length
        ? `${t("Table")} ${tbl.number} (${tbl.capacity} ${t("ppl")}) — ${t("Booked")}: ${bookedTimes.join(", ")}`
        : `${t("Table")} ${tbl.number} (${tbl.capacity} ${t("ppl")})`;

      return {
        value: tbl._id,
        label,
        disabled: tbl.status === "occupied" || conflicts,
      };
    });
  }, [tables, reservationsForDate, form.date, form.time, t]);

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
    const trimmedPhone = form.phone.trim();
    if (!trimmedPhone) {
      next.phone = "Phone is required";
    } else if (!PHONE_REGEX.test(trimmedPhone)) {
      next.phone = "Enter a valid phone number (11 digits, or + and 10-14 digits for international)";
    }
    if (!form.people.trim() || Number(form.people) <= 0) {
      next.people = "Enter a valid number";
    }
    if (!form.date) next.date = "Date is required";
    if (!form.time.trim()) next.time = "Time is required";
    if (!form.table) {
      next.table = "Select a table";
    } else if (tableOptions.find((o) => o.value === form.table)?.disabled) {
      // The selected table became unavailable after the date/time changed
      // underneath it (or is occupied) — block submission with a clear
      // message rather than silently swapping/clearing their selection.
      next.table = "This table is no longer available for the selected date/time — pick another";
    }
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
                    "w-full sm:w-auto border-primary text-primary hover:bg-white hover:text-primary transition-all duration-200 hover:shadow-xs active:scale-[0.98]",
                }}
              />
              <Button
                form={FORM_ID}
                type="submit"
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] px-4 text-sm font-semibold text-white sm:h-14 sm:w-auto sm:gap-3 sm:px-7.5 sm:text-[16px] transition-all duration-200 hover:opacity-95 hover:shadow-xs active:scale-[0.98]"
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
