export type ConnectionStatus = "Connected" | "Disconnected";

export type QueueStatus = "Empty (Nominal)" | "Processing" | "Backlogged";

export type EncryptionMode = "End-to-End" | "Transport" | "None";

export interface TechnicalPerformance {
  responseTime: string;
  queueStatus: QueueStatus;
  operator: string;
  encryptionMode: EncryptionMode;
}

export interface GatewaySecurity {
  title: string;
  description: string;
  complianceNote: string;
  lastAudit: string;
}

export interface HowToLinkStep {
  step: number;
  description: string;
}