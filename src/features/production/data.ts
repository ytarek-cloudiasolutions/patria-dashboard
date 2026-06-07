import type { EquipmentRecord, RoastBatch } from "./types";

export const ROAST_OVERVIEW = {
  activeBatches: 0,
  qualityIndex: "88.4/100",
  productionEfficiency: "82.1%",
  averageLossRate: "17.9%",
};

export const INITIAL_BATCHES: RoastBatch[] = [
  {
    id: 1,
    batchNumber: "B-699754",
    product: "Brazilian Coffee",
    degree: "Medium",
    weightBefore: 10,
    weightAfter: 9,
    status: "Verify Quality",
    date: "Mar 15, 2026",
  },
  {
    id: 2,
    batchNumber: "B-699754",
    product: "Colombian Coffee",
    degree: "Dark",
    weightBefore: 2,
    weightAfter: 0.5,
    status: "IN-QC",
    date: "Mar 15, 2026",
  },
  {
    id: 3,
    batchNumber: "B-699754",
    product: "Colombian Coffee",
    degree: "Light",
    weightBefore: 2,
    weightAfter: 2,
    status: "IN-QC",
    date: "Mar 15, 2026",
  },
];

export const INITIAL_EQUIPMENT: EquipmentRecord[] = [
  {
    id: 1,
    machine: "#TRF-44581",
    task: "Calibration",
    operator: "Super Admin",
    deadline: "4/14/2026",
    cost: 3250,
    status: "Poor",
  },
  {
    id: 2,
    machine: "#TRF-552890",
    task: "Repair",
    operator: "Admin",
    deadline: "4/14/2026",
    cost: 1100,
    status: "Healthy",
  },
];

export const PRODUCTION_CHART_DATA = [
  { label: "B-245419", value: 30 },
  { label: "B-699754", value: 75 },
  { label: "B-722093", value: 95 },
];

export const ROASTING_DEGREE_FILTERS = [
  { value: "all", label: "Roasting degree" },
  { value: "Light", label: "Light" },
  { value: "Medium", label: "Medium" },
  { value: "Dark", label: "Dark" },
];

export const EQUIPMENT_STATUS_FILTERS = [
  { value: "all", label: "All Statuses" },
  { value: "Healthy", label: "Healthy" },
  { value: "Poor", label: "Poor" },
  { value: "Maintenance", label: "Maintenance" },
];

export const EQUIPMENT_TASK_OPTIONS = [
  { value: "Routine Sterilization", label: "Routine Sterilization" },
  { value: "Calibration", label: "Calibration" },
  { value: "Repair", label: "Repair" },
  { value: "Inspection", label: "Inspection" },
];
