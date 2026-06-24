import { api } from "@/config/api";
import { LOCATION_ENDPOINTS } from "../constants/locationConstants";
import type {
  CreateLocationRequest,
  CreateLocationResponse,
  DeleteLocationRequest,
  DeleteLocationResponse,
  GetLocationsResponse,
  ToggleLocationStatusRequest,
  ToggleLocationStatusResponse,
  UpdateLocationRequest,
  UpdateLocationResponse,
} from "../store/locationTypes";

export const getLocations = async () => {
  const response = await api.get<GetLocationsResponse>(
    LOCATION_ENDPOINTS.LOCATIONS,
  );
  return response.data;
};

export const createLocation = async (payload: CreateLocationRequest) => {
  const response = await api.post<CreateLocationResponse>(
    LOCATION_ENDPOINTS.LOCATIONS,
    payload,
  );
  return response.data;
};

export const updateLocation = async ({
  locationId,
  data,
}: UpdateLocationRequest) => {
  const response = await api.put<UpdateLocationResponse>(
    LOCATION_ENDPOINTS.LOCATION_BY_ID(locationId),
    data,
  );
  return response.data;
};

export const deleteLocation = async ({ locationId }: DeleteLocationRequest) => {
  const response = await api.delete<DeleteLocationResponse>(
    LOCATION_ENDPOINTS.LOCATION_BY_ID(locationId),
  );
  return response.data;
};

export const toggleLocationStatus = async ({
  locationId,
  isActive,
}: ToggleLocationStatusRequest) => {
  const response = await api.patch<ToggleLocationStatusResponse>(
    LOCATION_ENDPOINTS.TOGGLE_STATUS(locationId),
    { isActive },
  );
  return response.data;
};

export const locationsApi = {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  toggleLocationStatus,
};
