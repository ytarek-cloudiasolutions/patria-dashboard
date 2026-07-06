import type { Shift } from "./types";

/** Preset accent colors offered in the New Shift dialog. */
export const SHIFT_COLORS: string[] = [
  "#16B8A6",
  "#E8B98A",
  "#3B82F6",
  "#F43F5E",
  "#F59E0B",
  "#A855F7",
];

/** Suggested shift names shown in the Shift Name dropdown. */
export const SHIFT_NAME_OPTIONS: string[] = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
  "Weekend",
];

export const INITIAL_SHIFTS: Shift[] = [
  {
    id: 1,
    name: "Morning",
    startTime: "08:00 AM",
    endTime: "04:00 PM",
    color: "#16B8A6",
  },
  {
    id: 2,
    name: "Evening",
    startTime: "04:00 PM",
    endTime: "10:00 PM",
    color: "#A21CAF",
  },
];
