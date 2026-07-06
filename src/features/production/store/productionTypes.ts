export type BatchStatus = "in_progress" | "completed" | "failed";

export interface QualityCheck {
  passed: boolean;
  notes?: string;
}

export interface ApiBatch {
  _id: string;
  batchId: string;
  productId: string | Record<string, unknown>;
  productName?: string;
  quantity: number;
  status: BatchStatus;
  qualityCheck?: QualityCheck;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export type EquipmentStatus = "operational" | "maintenance" | "offline";

export interface ApiEquipment {
  _id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  lastServiceDate?: string;
  nextServiceDate?: string;
}

// ---- Request / Response shapes ----

export interface GetBatchesResponse {
  batches: ApiBatch[];
}

export interface CreateBatchRequest {
  productId: string;
  quantity: number;
  startDate?: string;
  notes?: string;
}

export interface CreateBatchResponse {
  batch: ApiBatch;
}

export interface UpdateBatchStatusRequest {
  status: BatchStatus;
}

export interface UpdateBatchStatusResponse {
  batch: ApiBatch;
}

export interface GetEquipmentResponse {
  equipment: ApiEquipment[];
}

export interface CreateEquipmentRequest {
  name: string;
  type: string;
  status?: EquipmentStatus;
  lastServiceDate?: string;
  nextServiceDate?: string;
}

export interface CreateEquipmentResponse {
  equipment: ApiEquipment;
}

export interface UpdateEquipmentRequest {
  name?: string;
  type?: string;
  status?: EquipmentStatus;
  lastServiceDate?: string;
  nextServiceDate?: string;
}

export interface UpdateEquipmentResponse {
  equipment: ApiEquipment;
}

// ---- Store types ----

export type ProductionOperation =
  | "fetchBatches"
  | "createBatch"
  | "updateBatchStatus"
  | "fetchEquipment"
  | "createEquipment"
  | "updateEquipment";

export interface ProductionLoadingState {
  fetchBatches: boolean;
  createBatch: boolean;
  updateBatchStatus: boolean;
  fetchEquipment: boolean;
  createEquipment: boolean;
  updateEquipment: boolean;
}

export interface ProductionErrorState {
  fetchBatches: string | null;
  createBatch: string | null;
  updateBatchStatus: string | null;
  fetchEquipment: string | null;
  createEquipment: string | null;
  updateEquipment: string | null;
}

export interface ProductionState {
  batches: ApiBatch[];
  equipment: ApiEquipment[];
  loading: ProductionLoadingState;
  errors: ProductionErrorState;
  successMessage: string | null;
}
