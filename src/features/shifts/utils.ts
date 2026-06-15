/** Convert a 12-hour clock string ("08:00 AM") to 24-hour ("08:00"). */
export const to24Hour = (value: string): string => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return value;

  let hour = Number(match[1]);
  const minute = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${minute}`;
};

/** "08:00 AM" + "04:00 PM" -> "08:00 - 16:00". */
export const formatShiftRange = (start: string, end: string): string =>
  `${to24Hour(start)} - ${to24Hour(end)}`;

/** First character of the shift name, used in the avatar. */
export const shiftInitial = (name: string): string =>
  name.trim().charAt(0).toUpperCase() || "?";
