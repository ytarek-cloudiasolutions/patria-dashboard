export type GatewayConnectionStatus = "connected" | "disconnected" | "qr_ready" | "loading";

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
