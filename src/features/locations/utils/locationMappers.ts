import type { LocationStats, ZonePoint } from "../types";
import type { Location } from "../store/locationTypes";

export const mapLocation = (location: any): Location => {
  const rawPolygon = Array.isArray(location.polygon) ? location.polygon : [];
  const polygon: ZonePoint[] = rawPolygon
    .map((p: any) => ({
      lat: Number(p.lat ?? p[1] ?? 0),
      lng: Number(p.lng ?? p[0] ?? 0),
    }))
    .filter((p: ZonePoint) => !isNaN(p.lat) && !isNaN(p.lng));

  return {
    ...location,
    id: location._id || location.id,
    minOrderAmount: location.minOrderAmount ?? location.minOrder ?? 0,
    minOrder: location.minOrder ?? location.minOrderAmount ?? 0,
    status: location.status || (location.isActive ? "Active" : "Inactive"),
    isActive:
      typeof location.isActive === "boolean"
        ? location.isActive
        : location.status === "Active",
    centerLat:
      typeof location.centerLat === "number" ? location.centerLat : undefined,
    centerLng:
      typeof location.centerLng === "number" ? location.centerLng : undefined,
    polygon,
  };
};

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
