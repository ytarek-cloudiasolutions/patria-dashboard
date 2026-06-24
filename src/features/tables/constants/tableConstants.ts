export const TABLE_ENDPOINTS = {
  TABLES: "/tables",
  TABLE_BY_ID: (tableId: string) => `/tables/${tableId}`,
  RESERVATIONS: "/reservations",
  RESERVATION_BY_ID: (reservationId: string) => `/reservations/${reservationId}`,
} as const;
