export type GatewayConnectionStatus = "connected" | "disconnected";

export interface LinkStep {
  id: number;
  text: string;
}

export type PerformanceTone = "neutral" | "positive" | "highlight";

export interface PerformanceMetric {
  id: string;
  label: string;
  value: string;
  tone: PerformanceTone;
}
