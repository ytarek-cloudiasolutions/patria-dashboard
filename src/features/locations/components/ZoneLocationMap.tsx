import { useEffect, useRef, useState } from "react";
import { Undo2, RotateCcw, Hexagon, Plus, Minus } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { loadGoogleMaps } from "@/shared/utils/googleMaps";
import type { DeliveryZone, ZonePoint } from "../types";

interface ZoneLocationMapProps {
  centerLat?: number;
  centerLng?: number;
  polygon?: ZonePoint[];
  zoneName?: string;
  existingZones?: DeliveryZone[];
  onPolygonChange?: (points: ZonePoint[]) => void;
  onLocationChange?: (lat: number, lng: number, identifiedName?: string) => void;
}

// Default fallback center: Alexandria, Egypt (Smouha / Alexandria center)
const DEFAULT_CENTER = { lat: 31.2001, lng: 29.9187 };

/**
 * Clean, guaranteed SVG data URI for the prominent primary-colored pin marker
 */
function makePrimaryPinIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48">
    <defs>
      <filter id="shadow" x="-30%" y="-20%" width="160%" height="150%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
      </filter>
    </defs>
    <path d="M19 0C8.507 0 0 8.507 0 19c0 14 19 29 19 29s19-15 19-29C38 8.507 29.493 0 19 0z" fill="#8F6900" filter="url(#shadow)"/>
    <circle cx="19" cy="19" r="8" fill="#FFFFFF"/>
    <circle cx="19" cy="19" r="4.5" fill="#8F6900"/>
  </svg>`;
  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(38, 48),
    anchor: new window.google.maps.Point(19, 48),
  };
}

/**
 * Generates an initial regular polygon boundary around a center location
 */
export function generateDefaultBoundary(
  center: { lat: number; lng: number },
  radiusMeters = 650,
  numPoints = 6
): ZonePoint[] {
  const points: ZonePoint[] = [];
  const safeCount = Math.max(3, numPoints);
  const earthRadius = 6378137; // meters
  for (let i = 0; i < safeCount; i++) {
    const angle = (i * 2 * Math.PI) / safeCount - Math.PI / 2;
    const dLat = (radiusMeters * Math.cos(angle)) / earthRadius;
    const dLng =
      (radiusMeters * Math.sin(angle)) /
      (earthRadius * Math.cos((Math.PI * center.lat) / 180));
    points.push({
      lat: Number((center.lat + (dLat * 180) / Math.PI).toFixed(6)),
      lng: Number((center.lng + (dLng * 180) / Math.PI).toFixed(6)),
    });
  }
  return points;
}

/**
 * Calculates average radius from center to all vertices
 */
function calculateAverageRadius(
  points: ZonePoint[],
  center: { lat: number; lng: number }
): number {
  if (points.length === 0) return 650;
  const earthRadius = 6378137;
  const sumDist = points.reduce((acc, p) => {
    const dLat = ((p.lat - center.lat) * Math.PI) / 180;
    const dLng = ((p.lng - center.lng) * Math.PI) / 180;
    const lat1 = (center.lat * Math.PI) / 180;
    const lat2 = (p.lat * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return acc + earthRadius * c;
  }, 0);
  return Math.round(sumDist / points.length) || 650;
}

/**
 * Checks if a polygon is approximately a regular polygon around the center
 */
function checkIsRegularPolygon(
  points: ZonePoint[],
  center: { lat: number; lng: number }
): boolean {
  if (points.length < 3) return false;
  const earthRadius = 6378137;
  const dists = points.map((p) => {
    const dLat = ((p.lat - center.lat) * Math.PI) / 180;
    const dLng = ((p.lng - center.lng) * Math.PI) / 180;
    const lat1 = (center.lat * Math.PI) / 180;
    const lat2 = (p.lat * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  });
  const avg = dists.reduce((a, b) => a + b, 0) / dists.length;
  if (avg === 0) return false;
  const maxDiff = Math.max(...dists.map((d) => Math.abs(d - avg)));
  return maxDiff / avg < 0.2;
}

/**
 * Inserts a new point at the midpoint of the longest edge of a custom polygon
 */
function insertMidpointOnLongestEdge(points: ZonePoint[]): ZonePoint[] {
  if (points.length < 3) return points;
  let maxDist = -1;
  let maxIdx = 0;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const dist = Math.hypot(p2.lat - p1.lat, p2.lng - p1.lng);
    if (dist > maxDist) {
      maxDist = dist;
      maxIdx = i;
    }
  }
  const p1 = points[maxIdx];
  const p2 = points[(maxIdx + 1) % points.length];
  const mid: ZonePoint = {
    lat: Number(((p1.lat + p2.lat) / 2).toFixed(6)),
    lng: Number(((p1.lng + p2.lng) / 2).toFixed(6)),
  };
  const result = [...points];
  result.splice(maxIdx + 1, 0, mid);
  return result;
}

/**
 * Calculates the centroid of a polygon
 */
function calculateCentroid(points: ZonePoint[]): { lat: number; lng: number } {
  if (points.length === 0) return DEFAULT_CENTER;
  const sum = points.reduce(
    (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
    { lat: 0, lng: 0 }
  );
  return {
    lat: Number((sum.lat / points.length).toFixed(6)),
    lng: Number((sum.lng / points.length).toFixed(6)),
  };
}

/**
 * Extracts the prominent area/district/neighborhood name
 */
function extractZoneAreaFromGeocode(results: any[]): string {
  if (!results || results.length === 0) return "";

  const areaTypes = [
    "neighborhood",
    "sublocality_level_1",
    "sublocality",
    "sublocality_level_2",
  ];

  for (const type of areaTypes) {
    const matched = results.find((r) => r.types?.includes(type));
    if (matched?.address_components) {
      const comp = matched.address_components.find((c: any) =>
        c.types?.includes(type)
      );
      if (comp?.long_name) return comp.long_name.trim();
    }
  }

  for (const res of results.slice(0, 6)) {
    if (!res.address_components) continue;
    for (const type of areaTypes) {
      const comp = res.address_components.find((c: any) =>
        c.types?.includes(type)
      );
      if (comp?.long_name) return comp.long_name.trim();
    }
  }

  for (const res of results.slice(0, 4)) {
    if (!res.address_components) continue;
    const admin3 = res.address_components.find((c: any) =>
      c.types?.includes("administrative_area_level_3")
    );
    if (admin3?.long_name) return admin3.long_name.trim();

    const admin2 = res.address_components.find((c: any) =>
      c.types?.includes("administrative_area_level_2")
    );
    if (admin2?.long_name) return admin2.long_name.trim();
  }

  for (const res of results.slice(0, 3)) {
    if (!res.address_components) continue;
    const locality = res.address_components.find((c: any) =>
      c.types?.includes("locality")
    );
    if (locality?.long_name) return locality.long_name.trim();
  }

  if (results[0]?.formatted_address) {
    const firstPart = results[0].formatted_address.split(",")[0].trim();
    if (firstPart && !/^\d+/.test(firstPart)) return firstPart;
  }

  return "";
}

const ZoneLocationMap = ({
  centerLat,
  centerLng,
  polygon: externalPolygon = [],
  zoneName,
  existingZones = [],
  onPolygonChange,
  onLocationChange,
}: ZoneLocationMapProps) => {
  const { t, language } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const pathRef = useRef<any>(null);
  const existingOverlaysRef = useRef<any[]>([]);
  const pathListenersRef = useRef<any[]>([]);

  const [points, setPoints] = useState<ZonePoint[]>(externalPolygon);
  const [history, setHistory] = useState<ZonePoint[][]>([]);

  // Keep a reference to the initial baseline points for the current location
  const initialPointsRef = useRef<ZonePoint[]>(externalPolygon || []);
  const lastKnownPointsRef = useRef<ZonePoint[]>(externalPolygon || []);
  const isInternalChangeRef = useRef(false);

  const onPolygonChangeRef = useRef(onPolygonChange);
  onPolygonChangeRef.current = onPolygonChange;

  const onLocationChangeRef = useRef(onLocationChange);
  onLocationChangeRef.current = onLocationChange;

  const hasCoords =
    typeof centerLat === "number" &&
    typeof centerLng === "number" &&
    !isNaN(centerLat) &&
    !isNaN(centerLng);

  // Bind events to polygon path so dragging vertices/midpoints syncs state
  const bindPathEvents = (path: any) => {
    pathListenersRef.current.forEach((l) => l.remove?.());
    pathListenersRef.current = [];

    const onEdit = () => {
      syncFromPath();
    };

    pathListenersRef.current.push(path.addListener("set_at", onEdit));
    pathListenersRef.current.push(path.addListener("insert_at", onEdit));
    pathListenersRef.current.push(path.addListener("remove_at", onEdit));
  };

  // Read current points from the google maps polygon path without touching the pin
  const syncFromPath = () => {
    if (!pathRef.current) return;
    const path = pathRef.current;
    const newPoints: ZonePoint[] = [];
    for (let i = 0; i < path.getLength(); i++) {
      const latLng = path.getAt(i);
      newPoints.push({
        lat: Number(latLng.lat().toFixed(6)),
        lng: Number(latLng.lng().toFixed(6)),
      });
    }

    if (JSON.stringify(newPoints) !== JSON.stringify(lastKnownPointsRef.current)) {
      pushHistory(lastKnownPointsRef.current);
      lastKnownPointsRef.current = newPoints;
    }

    isInternalChangeRef.current = true;
    setPoints(newPoints);
    onPolygonChangeRef.current?.(newPoints);
  };

  // Safely updates polygon path without moving or reverting the pin marker
  const setBoundaryPoints = (newPts: ZonePoint[], notify = true) => {
    isInternalChangeRef.current = true;
    lastKnownPointsRef.current = newPts;
    setPoints(newPts);

    if (polygonRef.current && window.google?.maps) {
      if (newPts.length > 0) {
        const newPath = new window.google.maps.MVCArray();
        newPts.forEach((p) => {
          newPath.push(new window.google.maps.LatLng(p.lat, p.lng));
        });
        pathRef.current = newPath;
        polygonRef.current.setPaths([newPath]);
        bindPathEvents(newPath);
      } else {
        pathRef.current = new window.google.maps.MVCArray();
        polygonRef.current.setPaths([]);
      }
    }

    if (notify) {
      onPolygonChangeRef.current?.(newPts);
    }
  };

  // Push new state to history before changing
  const pushHistory = (currentPoints: ZonePoint[]) => {
    setHistory((prev) => [...prev.slice(-15), currentPoints]);
  };

  // Undo last point modification without touching the pin
  const handleUndo = () => {
    if (history.length > 0) {
      const prevPoints = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setBoundaryPoints(prevPoints);
    } else if (
      initialPointsRef.current.length > 0 &&
      JSON.stringify(points) !== JSON.stringify(initialPointsRef.current)
    ) {
      setBoundaryPoints(initialPointsRef.current);
    }
  };

  // Revert user's point edits back to the initial boundary for this zone/location
  const handleRevert = () => {
    if (initialPointsRef.current.length > 0) {
      pushHistory(points);
      setBoundaryPoints(initialPointsRef.current);
    }
  };

  // Increase polygon points
  const handleIncreasePoints = () => {
    if (points.length >= 16 || points.length === 0) return;
    pushHistory(points);

    const center = hasCoords
      ? { lat: centerLat!, lng: centerLng! }
      : calculateCentroid(points);

    const isRegular = checkIsRegularPolygon(points, center);
    if (isRegular) {
      const radius = calculateAverageRadius(points, center);
      const newPts = generateDefaultBoundary(center, radius, points.length + 1);
      setBoundaryPoints(newPts);
    } else {
      const newPts = insertMidpointOnLongestEdge(points);
      setBoundaryPoints(newPts);
    }
  };

  // Decrease polygon points
  const handleDecreasePoints = () => {
    if (points.length <= 3) return;
    pushHistory(points);

    const center = hasCoords
      ? { lat: centerLat!, lng: centerLng! }
      : calculateCentroid(points);

    const isRegular = checkIsRegularPolygon(points, center);
    if (isRegular) {
      const radius = calculateAverageRadius(points, center);
      const newPts = generateDefaultBoundary(center, radius, points.length - 1);
      setBoundaryPoints(newPts);
    } else {
      const newPts = points.slice(0, -1);
      setBoundaryPoints(newPts);
    }
  };

  // Sync external polygon into state if changed outside
  useEffect(() => {
    if (externalPolygon && externalPolygon.length > 0) {
      if (JSON.stringify(externalPolygon) !== JSON.stringify(points)) {
        initialPointsRef.current = externalPolygon;
        lastKnownPointsRef.current = externalPolygon;
        setBoundaryPoints(externalPolygon, false);
      }
    }
  }, [externalPolygon]);

  // Initialize Map
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_KEY;
    if (!key || !containerRef.current) return;

    let cancelled = false;
    loadGoogleMaps(key).then(() => {
      if (cancelled || !containerRef.current) return;

      const initialCenter = hasCoords
        ? { lat: centerLat!, lng: centerLng! }
        : points.length > 0
        ? calculateCentroid(points)
        : DEFAULT_CENTER;

      if (!mapRef.current) {
        const map = new window.google.maps.Map(containerRef.current, {
          center: initialCenter,
          zoom: hasCoords || points.length > 0 ? 15 : 13,
          disableDefaultUI: false,
          gestureHandling: "greedy",
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        // Determine initial boundary points
        const initialPts =
          points.length > 0
            ? points
            : hasCoords
            ? generateDefaultBoundary(initialCenter, 650)
            : [];

        // Seed MVCArray path
        const path = new window.google.maps.MVCArray();
        initialPts.forEach((p) => {
          path.push(new window.google.maps.LatLng(p.lat, p.lng));
        });
        pathRef.current = path;

        // Initialize editable polygon with paths: [path] (array of rings)
        const polygon = new window.google.maps.Polygon({
          paths: initialPts.length > 0 ? [path] : [],
          strokeColor: "#8F6900",
          strokeOpacity: 0.95,
          strokeWeight: 2.5,
          fillColor: "#8F6900",
          fillOpacity: 0.18,
          editable: true,
          draggable: false,
          map,
        });

        polygonRef.current = polygon;
        bindPathEvents(path);

        if (initialPts.length > 0 && points.length === 0) {
          initialPointsRef.current = initialPts;
          lastKnownPointsRef.current = initialPts;
          setPoints(initialPts);
          onPolygonChangeRef.current?.(initialPts);
        } else if (points.length > 0) {
          initialPointsRef.current = points;
          lastKnownPointsRef.current = points;
        }

        // Initialize PRIMARY PIN MARKER - ALWAYS visible on the map at the zone location!
        const pinPosition = hasCoords
          ? { lat: centerLat!, lng: centerLng! }
          : initialPts.length > 0
          ? calculateCentroid(initialPts)
          : initialCenter;
        const marker = new window.google.maps.Marker({
          position: pinPosition,
          map: map,
          icon: makePrimaryPinIcon(),
          draggable: false,
          zIndex: 999,
        });

        markerRef.current = marker;
        mapRef.current = map;
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // When center coordinates change externally (e.g. user selected or typed an area)
  useEffect(() => {
    if (!mapRef.current || !hasCoords) return;

    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }

    const newCenter = { lat: centerLat!, lng: centerLng! };
    mapRef.current.panTo(newCenter);
    mapRef.current.setZoom(15);

    if (markerRef.current) {
      markerRef.current.setPosition(newCenter);
      markerRef.current.setMap(mapRef.current);
    }

    // Generate initial 6-point boundary around the new area
    const defaultPts = generateDefaultBoundary(newCenter, 650);
    initialPointsRef.current = defaultPts;
    lastKnownPointsRef.current = defaultPts;
    setBoundaryPoints(defaultPts, false);
  }, [centerLat, centerLng, hasCoords]);

  // Render existing zones on map for reference
  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return;

    existingOverlaysRef.current.forEach((item) => item.setMap?.(null));
    existingOverlaysRef.current = [];

    existingZones.forEach((zone) => {
      if (zone.polygon && zone.polygon.length >= 3) {
        const poly = new window.google.maps.Polygon({
          paths: zone.polygon.map((p) => ({ lat: p.lat, lng: p.lng })),
          strokeColor: "#9CA3AF",
          strokeOpacity: 0.6,
          strokeWeight: 1.5,
          fillColor: "#9CA3AF",
          fillOpacity: 0.08,
          map: mapRef.current,
          clickable: true,
        });

        poly.addListener("click", () => {
          const centroid = calculateCentroid(zone.polygon!);
          onLocationChangeRef.current?.(centroid.lat, centroid.lng, zone.name);
        });

        existingOverlaysRef.current.push(poly);
      } else if (typeof zone.centerLat === "number" && typeof zone.centerLng === "number") {
        const circle = new window.google.maps.Circle({
          strokeColor: "#9CA3AF",
          strokeOpacity: 0.5,
          strokeWeight: 1,
          fillColor: "#9CA3AF",
          fillOpacity: 0.05,
          map: mapRef.current,
          center: { lat: zone.centerLat, lng: zone.centerLng },
          radius: (Number(zone.radiusKm) || 5) * 1000,
          clickable: true,
        });

        circle.addListener("click", () => {
          onLocationChangeRef.current?.(zone.centerLat!, zone.centerLng!, zone.name);
        });

        existingOverlaysRef.current.push(circle);
      }
    });

    return () => {
      existingOverlaysRef.current.forEach((item) => item.setMap?.(null));
      existingOverlaysRef.current = [];
    };
  }, [existingZones]);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Header Row: ZONE BOUNDARY & Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Hexagon className="size-3.5 text-[#8F6900]" />
          <span className="text-[12px] font-bold tracking-wider text-[#28293D] uppercase">
            {t("ZONE BOUNDARY")}
          </span>
        </div>

        {/* Controls: Increase / Decrease Points & Undo / Revert */}
        <div className="flex items-center gap-2">
          {/* Stepper: [-] {count} Points [+] */}
          <div className="flex items-center rounded-lg border border-[#E5E5E5] bg-[#F9F9F8] p-0.5 shadow-xs">
            <button
              type="button"
              onClick={handleDecreasePoints}
              disabled={points.length <= 3}
              title={t("Decrease points")}
              className="flex size-6 items-center justify-center rounded-md text-[#595959] hover:bg-white hover:text-[#28293D] hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition cursor-pointer"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="px-2 text-[11px] font-semibold text-[#28293D] select-none min-w-[58px] text-center">
              {points.length} {t("Points")}
            </span>
            <button
              type="button"
              onClick={handleIncreasePoints}
              disabled={points.length >= 16 || points.length === 0}
              title={t("Increase points")}
              className="flex size-6 items-center justify-center rounded-md text-[#595959] hover:bg-white hover:text-[#28293D] hover:shadow-xs disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none transition cursor-pointer"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-[#E5E5E5]" />

          {/* Action buttons: Undo & Revert */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={handleUndo}
              disabled={
                history.length === 0 &&
                JSON.stringify(points) === JSON.stringify(initialPointsRef.current)
              }
              title={t("Undo last point")}
              className="rounded-md p-1 text-[#595959] hover:bg-[#F0F0EE] hover:text-[#28293D] disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
            >
              <Undo2 className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleRevert}
              disabled={JSON.stringify(points) === JSON.stringify(initialPointsRef.current)}
              title={t("Revert points")}
              className="rounded-md p-1 text-[#595959] hover:bg-[#F0F0EE] hover:text-[#28293D] disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtitle guidance */}
      <p className="text-[12px] text-[#8B8B8B]">
        {points.length >= 3
          ? t(
              "Boundary set — {{count}} points. Use the controls above to adjust points or drag handles on the map."
            ).replace("{{count}}", String(points.length))
          : t("Select a zone above to set the delivery location and boundary.")}
      </p>

      {/* Map Container */}
      <div className="relative mt-1 h-64 w-full overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-[#F5F0EA]/30 sm:h-72">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
};

export default ZoneLocationMap;
