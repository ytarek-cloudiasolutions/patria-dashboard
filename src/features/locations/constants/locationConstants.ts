export const LOCATION_ENDPOINTS = {
  LOCATIONS: "/locations",
  LOCATION_BY_ID: (locationId: string) => `/locations/${locationId}`,
  TOGGLE_STATUS: (locationId: string) => `/locations/${locationId}/toggle`,
} as const;
