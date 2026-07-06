export type ShiftStatus = "open" | "closed";

export interface ApiShift {
  _id: string;
  cashierId: string | Record<string, unknown>;
  locationId?: string | Record<string, unknown>;
  status: ShiftStatus;
  openingBalance?: number;
  closingBalance?: number;
  openedAt: string;
  closedAt?: string;
  notes?: string;
  orderIds?: string[];
}

// ---- Request / Response shapes ----

export interface OpenShiftRequest {
  cashierId: string;
  locationId?: string;
  openingBalance?: number;
}

export interface OpenShiftResponse {
  shift: ApiShift;
}

export interface CloseShiftRequest {
  shiftId: string;
  closingBalance?: number;
  notes?: string;
}

export interface CloseShiftResponse {
  shift: ApiShift;
}

export interface GetCurrentShiftResponse {
  shift: ApiShift;
}

// ---- Store types ----

export type ShiftsOperation = "open" | "close" | "fetch";

export interface ShiftsLoadingState {
  open: boolean;
  close: boolean;
  fetch: boolean;
}

export interface ShiftsErrorState {
  open: string | null;
  close: string | null;
  fetch: string | null;
}

export interface ShiftsState {
  currentShift: ApiShift | null;
  loading: ShiftsLoadingState;
  errors: ShiftsErrorState;
  successMessage: string | null;
}
