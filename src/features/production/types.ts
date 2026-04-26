export type RoastingDegree = "Light" | "Medium" | "Dark";

export type BatchStatus = "Verify Quality" | "IN-QC" | "Certified";

export type EquipmentTask = "Calibration" | "Repair" | "Routine Sterilization" | "Inspection";

export type EquipmentStatus = "Poor" | "Healthy";

export type TaskTaxonomy =
  | "Routine Sterilization"
  | "Calibration"
  | "Repair"
  | "Inspection";

// ---- Roast Tab ----

export interface RoastBatch {
  id: string;
  batch: string;
  product: string;
  degree: RoastingDegree;
  massIn: number;
  massOut: number;
  status: BatchStatus;
  date: string;
}

export interface NewRoastBatchForm {
  batchNumber: string;
  rawCoffeeType: string;
  weightBefore: number;
  weightAfter: number;
  degree: RoastingDegree;
}

export interface QualityCheckForm {
  certifiedOutputMass: number;
  atmosphericMoisture?: number;
  agtronSpecularIndex?: string;
  totalCuppingScore?: number;
}

export interface OverviewStats {
  activeBatches: number;
  qualityIndex: number;
  productionEfficiency: number;
  averageLossRate: number;
}

export interface ChartDataPoint {
  batch: string;
  efficiency: number;
}

// ---- Equipment Tab ----

export interface EquipmentRecord {
  id: string;
  machine: string;
  task: EquipmentTask;
  operator: string;
  deadline: string;
  cost: number;
  status: EquipmentStatus;
}

export interface ServiceLogForm {
  machineDesignation: string;
  taskTaxonomy: TaskTaxonomy;
  financialOutlay?: number;
  nextRecalibrationDeadline: string;
}