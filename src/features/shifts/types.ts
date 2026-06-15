export interface Shift {
  id: number;
  name: string;
  /** 12-hour clock string, e.g. "08:00 AM". */
  startTime: string;
  /** 12-hour clock string, e.g. "04:00 PM". */
  endTime: string;
  /** Accent color hex used for the shift avatar. */
  color: string;
  description?: string;
}

export interface ShiftFormData {
  name: string;
  startTime: string;
  endTime: string;
  color: string;
  description: string;
}
