import type {
  HowToLinkStep,
  TechnicalPerformance,
  GatewaySecurity,
} from "./types";

export const HOW_TO_LINK_STEPS: HowToLinkStep[] = [
  { step: 1, description: "Open WhatsApp on your mobile device" },
  { step: 2, description: "Tap Menu or Settings and select Linked Devices" },
  { step: 3, description: "Point your camera to the QR code on the left" },
  { step: 4, description: "Wait for the screen to show Connected status" },
];

export const TECHNICAL_PERFORMANCE: TechnicalPerformance = {
  responseTime: "- 120ms",
  queueStatus: "Empty (Nominal)",
  operator: "Omnia Maher",
  encryptionMode: "End-to-End",
};

export const GATEWAY_SECURITY: GatewaySecurity = {
  title: "Session Isolation",
  description:
    "Your WhatsApp messages are never stored on our database. We only handle the delivery socket.",
  complianceNote: "System compliant with WhatsApp security protocols.",
  lastAudit: "4/22/2026",
};
