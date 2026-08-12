/**
 * Formats a timestamp, ISO date string, or relative time string into a human-readable relative time string.
 * Examples:
 *  - 0 mins => "Just now"
 *  - 5 mins => "5 mins ago"
 *  - 858 mins => "14 hrs 18 mins ago"
 *  - 1839 mins => "1 day 6 hrs ago"
 */
export function formatTimeAgo(
  input: string | Date | number | undefined | null,
  t?: (key: string) => string
): string {
  if (!input) return "";

  const translate = (key: string) => (t ? t(key) : key);

  let diffMins: number | null = null;

  if (typeof input === "string") {
    // Handle strings like "Received 858 mins ago" or "858 mins ago"
    const minsMatch = input.match(/(\d+)\s*mins?\s*ago/i);
    if (minsMatch) {
      diffMins = parseInt(minsMatch[1], 10);
    } else {
      const cleanStr = input.replace(/^(Received\s+|at\s+)/i, "");
      const parsed = new Date(cleanStr);
      if (!isNaN(parsed.getTime())) {
        diffMins = Math.floor(Math.max(0, Date.now() - parsed.getTime()) / 60000);
      }
    }
  } else if (input instanceof Date) {
    if (!isNaN(input.getTime())) {
      diffMins = Math.floor(Math.max(0, Date.now() - input.getTime()) / 60000);
    }
  } else if (typeof input === "number") {
    diffMins = Math.floor(Math.max(0, Date.now() - input) / 60000);
  }

  if (diffMins === null || isNaN(diffMins)) {
    return String(input);
  }

  if (diffMins < 1) {
    return translate("Just now");
  }

  if (diffMins < 60) {
    if (diffMins === 1) return translate("1 min ago");
    return `${diffMins} ${translate("mins ago")}`;
  }

  const hours = Math.floor(diffMins / 60);
  const remMins = diffMins % 60;

  if (diffMins < 1440) {
    if (remMins === 0) {
      if (hours === 1) return translate("1 hr ago");
      return `${hours} ${translate("hrs ago")}`;
    }
    const hrStr = hours === 1 ? `1 ${translate("hr")}` : `${hours} ${translate("hrs")}`;
    const minStr = remMins === 1 ? `1 ${translate("min")}` : `${remMins} ${translate("mins")}`;
    return `${hrStr} ${minStr} ${translate("ago")}`;
  }

  const days = Math.floor(diffMins / 1440);
  const remHours = Math.floor((diffMins % 1440) / 60);

  if (remHours === 0) {
    if (days === 1) return translate("1 day ago");
    return `${days} ${translate("days ago")}`;
  }

  const dayStr = days === 1 ? `1 ${translate("day")}` : `${days} ${translate("days")}`;
  const hrStr = remHours === 1 ? `1 ${translate("hr")}` : `${remHours} ${translate("hrs")}`;
  return `${dayStr} ${hrStr} ${translate("ago")}`;
}
