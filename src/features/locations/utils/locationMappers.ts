import type { LocationStats } from "../types";
import type { Location } from "../store/locationTypes";

export const mapLocation = (location: any): Location => ({
  ...location,
  id: location._id || location.id,
  minOrderAmount: location.minOrderAmount ?? location.minOrder ?? 0,
  minOrder: location.minOrder ?? location.minOrderAmount ?? 0,
  status: location.status || (location.isActive ? "Active" : "Inactive"),
  isActive: typeof location.isActive === "boolean" ? location.isActive : location.status === "Active",
});

export const mapLocations = (locations: Location[]) => locations.map(mapLocation);

export const calculateLocationStats = (
  locations: Location[],
): LocationStats => {
  const active = locations.filter((location) => location.isActive).length;

  return {
    total: locations.length,
    active,
    inactive: locations.length - active,
  };
};
