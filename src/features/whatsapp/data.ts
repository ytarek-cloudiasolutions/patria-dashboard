import type { LinkStep, PerformanceMetric } from "./types";

export const LINK_STEPS: LinkStep[] = [
  { id: 1, text: "Open WhatsApp on your mobile device" },
  { id: 2, text: "Tap Menu or Settings and select Linked Devices" },
  { id: 3, text: "Point your camera to the QR code on the left" },
  { id: 4, text: "Wait for the screen to show Connected status" },
];

export const PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    id: "response-time",
    label: "Response Time",
    value: "- 120ms",
    tone: "neutral",
  },
  {
    id: "queue-status",
    label: "Queue Status",
    value: "Empty (Nominal)",
    tone: "positive",
  },
  {
    id: "encryption",
    label: "Omnia Maher",
    value: "End-to-End",
    tone: "highlight",
  },
];

export const SECURITY_LAST_AUDIT = "4/22/2026";
