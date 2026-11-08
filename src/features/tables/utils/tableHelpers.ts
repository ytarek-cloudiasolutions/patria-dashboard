import axios from "axios";
import type { Reservation } from "../store/tableTypes";

interface ApiErrorPayload {
  message?: string;
  error?: string;
}

// Mirrors MIN_RESERVATION_GAP_HOURS in the backend's src/config/constants.js
// — the backend is the authority that actually enforces this on submit
// (reservationController.createReservation); this copy only drives the
// "show unavailable for this time" UI hint in the New Reservation dialog,
// so keep the two in sync if that value ever changes.
export const MIN_RESERVATION_GAP_HOURS = 3;

const ACTIVE_RESERVATION_STATUSES = ["on_hold", "confirmed", "sitting"];

export const convertTo24Hour = (timeStr: string): string => {
  if (!timeStr) return "";
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return timeStr;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hours < 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  const hoursStr = String(hours).padStart(2, "0");
  return `${hoursStr}:${minutes}`;
};

/** Combine a reservation's separate date + "HH:mm" (24h) time into one real timestamp. */
const combineDateAndTime = (date: string, time24h: string): number | null => {
  if (!date || !time24h) return null;
  const [h, m] = time24h.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(h, m, 0, 0);
  return d.getTime();
};

export const isActiveReservation = (status: string) =>
  ACTIVE_RESERVATION_STATUSES.includes(status);

/** Active (on_hold/confirmed/sitting) reservations for one table, from a day's reservation list. */
export const reservationsForTable = (
  reservations: Reservation[],
  tableId: string,
) =>
  reservations.filter(
    (r) =>
      isActiveReservation(r.status) &&
      String((r.tableId as unknown as { _id?: string })?._id ?? r.tableId) === tableId,
  );

/**
 * Whether any of a table's reservations falls within MIN_RESERVATION_GAP_HOURS
 * of the given date + time (time given in the dialog's "hh:mm AM/PM" form).
 */
export const hasConflictingReservation = (
  tableReservations: Reservation[],
  date: string,
  time12h: string,
): boolean => {
  const requestedAt = combineDateAndTime(date, convertTo24Hour(time12h));
  if (requestedAt === null) return false;
  const gapMs = MIN_RESERVATION_GAP_HOURS * 60 * 60 * 1000;
  return tableReservations.some((r) => {
    const existingAt = combineDateAndTime(r.date, r.time);
    return existingAt !== null && Math.abs(existingAt - requestedAt) < gapMs;
  });
};

export const getTableErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};
