import type {
  ChartDataPoint,
  EquipmentRecord,
  EquipmentStatus,
  OverviewStats,
  RoastBatch,
  RoastingDegree,
  TaskTaxonomy,
} from "./types";

export const ROASTING_DEGREES: RoastingDegree[] = ["Light", "Medium", "Dark"];

export const TASK_TAXONOMIES: TaskTaxonomy[] = [
  "Routine Sterilization",
  "Calibration",
  "Repair",
  "Inspection",
];

export const EQUIPMENT_STATUS_OPTIONS: EquipmentStatus[] = ["Poor", "Healthy"];

export const OVERVIEW_STATS: OverviewStats = {
  activeBatches: 0,
  qualityIndex: 88.4,
  productionEfficiency: 82.1,
  averageLossRate: 17.9,
};

export const CHART_DATA: ChartDataPoint[] = [
  { batch: "B-245419", efficiency: 20 },
  { batch: "B-699754", efficiency: 82 },
  { batch: "B-722093", efficiency: 95 },
];

export const INITIAL_BATCHES: RoastBatch[] = [
  {
    id: "1",
    batch: "B-699754",
    product: "Brazilian Coffee",
    degree: "Medium",
    massIn: 10,
    massOut: 9,
    status: "Verify Quality",
    date: "Mar 15, 2026",
  },
  {
    id: "2",
    batch: "B-699754",
    product: "Colombian Coffee",
    degree: "Dark",
    massIn: 2,
    massOut: 0.5,
    status: "IN-QC",
    date: "Mar 15, 2026",
  },
  {
    id: "3",
    batch: "B-699754",
    product: "Colombian Coffee",
    degree: "Light",
    massIn: 2,
    massOut: 2,
    status: "IN-QC",
    date: "Mar 15, 2026",
  },
];

export const INITIAL_EQUIPMENT: EquipmentRecord[] = [
  {
    id: "1",
    machine: "#TRF-445581",
    task: "Calibration",
    operator: "Super Admin",
    deadline: "4/14/2026",
    cost: 3250,
    status: "Poor",
  },
  {
    id: "2",
    machine: "#TRF-552890",
    task: "Repair",
    operator: "Admin",
    deadline: "4/14/2026",
    cost: 1100,
    status: "Healthy",
  },
];

export const ROASTING_DEGREE_FILTER_OPTIONS = [
  "All",
  "Light",
  "Medium",
  "Dark",
] as const;
