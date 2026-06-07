/**
 * Translate the words inside a payment-method string while preserving any
 * numbers/symbols (e.g. "Cash 90 + Visa 190" → "نقدي 90 + فيزا 190").
 *
 * In English `t()` returns the same word, so each replace is a no-op.
 */
export const translatePaymentMethod = (
  method: string,
  t: (key: string) => string,
) =>
  method
    .replace(/Online Payment/g, t("Online Payment"))
    .replace(/Visa\/Card/g, t("Visa/Card"))
    .replace(/\bCash\b/g, t("Cash"))
    .replace(/\bVisa\b/g, t("Visa"))
    .replace(/\bMix\b/g, t("Mix"));
