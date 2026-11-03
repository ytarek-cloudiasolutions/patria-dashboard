/**
 * Normalizes WhatsApp phone input in real time.
 * Handles local Egyptian format (01xxxxxxxxx) and international E.164 formats (+20...).
 */
export const normalizeWhatsAppPhone = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) return hasPlus ? "+" : "";

  if (hasPlus) {
    const normalizedDigits = digits.startsWith("200")
      ? `20${digits.slice(3)}`
      : digits;
    return `+${normalizedDigits.slice(0, 14)}`;
  }

  if (digits.startsWith("00")) {
    const intlDigits = digits.slice(2);
    const normalizedDigits = intlDigits.startsWith("200")
      ? `20${intlDigits.slice(3)}`
      : intlDigits;
    return `+${normalizedDigits.slice(0, 14)}`;
  }

  if (/^1[0125]/.test(digits)) {
    return `0${digits}`.slice(0, 11);
  }

  if (digits.startsWith("0")) {
    return digits.slice(0, 11);
  }

  if (digits.length >= 2 && !digits.startsWith("1")) {
    const normalizedDigits = digits.startsWith("200")
      ? `20${digits.slice(3)}`
      : digits;
    return `+${normalizedDigits.slice(0, 14)}`;
  }

  if (digits.length > 1) {
    return `+${digits.slice(0, 14)}`;
  }

  return digits;
};
