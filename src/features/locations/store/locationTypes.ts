import type { DeliveryZone, LocationStats } from "../types";

export interface ApiResponse<TData> {
  statusCode: number;
  data: TData;
  message: string;
  success: boolean;
}

export type Location = DeliveryZone;

export interface GetLocationsData {
  locations: Location[];
  stats: LocationStats;
}

export interface LocationData {
  location: Location;
}

export interface CreateLocationRequest {
  name: string;
  deliveryFee: number;
  minOrderAmount: number;
  isActive: boolean;
}

export interface UpdateLocationRequest {
  locationId: string;
  data: Partial<CreateLocationRequest>;
}

export interface DeleteLocationRequest {
  locationId: string;
}

export interface ToggleLocationStatusRequest {
  locationId: string;
  isActive: boolean;
}

export type GetLocationsResponse = ApiResponse<GetLocationsData>;
export type CreateLocationResponse = ApiResponse<LocationData>;
export type UpdateLocationResponse = ApiResponse<LocationData>;
export type DeleteLocationResponse = ApiResponse<null>;
export type ToggleLocationStatusResponse = ApiResponse<LocationData>;

export type LocationsOperation =
  | "fetch"
  | "create"
  | "update"
  | "delete"
  | "toggle";

export type LocationsLoadingState = Record<LocationsOperation, boolean>;
export type LocationsErrorState = Record<LocationsOperation, string | null>;

export interface LocationsState {
  locations: Location[];
  stats: LocationStats;
  loading: LocationsLoadingState;
  errors: LocationsErrorState;
  successMessage: string | null;
}
