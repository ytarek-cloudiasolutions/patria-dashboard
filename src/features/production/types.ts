export type ProductionTab = "roast" | "equipment";

export type RoastingDegree = "Light" | "Medium" | "Dark";

export type BatchStatus = "Verify Quality" | "IN-QC" | "Released" | "Failed";

export interface RoastBatch {
  id: number;
  batchNumber: string;
  product: string;
  degree: RoastingDegree;
  weightBefore: number;
  weightAfter: number;
  status: BatchStatus;
  date: string;
}

export interface BatchFormData {
  batchNumber: string;
  rawCoffeeType: string;
  weightBefore: string;
  weightAfter: string;
  degree: RoastingDegree;
}

export interface QualityCheckFormData {
  outputMass: string;
  atmosphericMoisture: string;
  agtronIndex: string;
  cuppingScore: string;
}

export type EquipmentStatus = "Healthy" | "Poor" | "Maintenance";
export type EquipmentTask =
  | "Calibration"
  | "Repair"
  | "Routine Sterilization"
  | "Inspection";

export interface EquipmentRecord {
  id: number;
  machine: string;
  task: EquipmentTask;
  operator: string;
  deadline: string;
  cost: number;
  status: EquipmentStatus;
}

export interface ServiceLogFormData {
  machine: string;
  task: EquipmentTask;
  cost: string;
  deadline: string;
}
