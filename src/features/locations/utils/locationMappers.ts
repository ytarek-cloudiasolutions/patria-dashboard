import type { LocationStats } from "../types";
import type { Location } from "../store/locationTypes";

export const mapLocation = (location: Location): Location => ({
  ...location,
  id: location._id,
  status: location.isActive ? "Active" : "Inactive",
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
