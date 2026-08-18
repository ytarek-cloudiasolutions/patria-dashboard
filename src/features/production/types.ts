export type ProductionTab = "roast" | "equipment";

export type RoastingDegree = "Light" | "Medium" | "Dark";

export type BatchStatus =
  | "Roasted"
  | "In-QC"
  | "Released"
  | "Rejected"
  | "Quarantined";

export interface RoastBatch {
  id: string;
  batchNumber: string;
  productId: string;
  product: string;
  degree: RoastingDegree;
  weightIn: number;
  weightOut: number | null;
  moistureGreen: number | null;
  moistureRoasted: number | null;
  roastColor: string;
  cupScore: number | null;
  status: BatchStatus;
  date: string;
  notes: string;
}

export interface StartRoastFormData {
  batchNumber: string;
  productId: string;
  weightIn: string;
  moistureGreen: string;
  degree: RoastingDegree;
  notes: string;
}

export interface CompleteRoastFormData {
  weightOut: string;
  moistureRoasted: string;
  roastColor: string;
  cupScore: string;
  notes: string;
}

export interface QualityCheckFormData {
  cuppingScore: string;
  aroma: string;
  acidity: string;
  body: string;
  aftertaste: string;
  cupper: string;
  notes: string;
}

export type MaintenanceStatus = "Completed" | "Pending" | "Overdue";
export type MaintenanceTaskType =
  | "Cleaning"
  | "Repair"
  | "Calibration"
  | "Parts Replacement";

export interface EquipmentRecord {
  id: string;
  equipmentName: string;
  taskType: MaintenanceTaskType;
  operator: string;
  deadline: string;
  cost: number;
  status: MaintenanceStatus;
}

export interface ServiceLogFormData {
  equipmentName: string;
  taskType: MaintenanceTaskType;
  cost: string;
  deadline: string;
  status: MaintenanceStatus;
  notes: string;
}
