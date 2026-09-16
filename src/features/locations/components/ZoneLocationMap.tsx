import { useEffect, useRef, useState } from "react";
import { Undo2, RotateCcw, Hexagon, Loader2 } from "lucide-react";
import { useTranslation } from "@/shared/i18n/useTranslation";
import { loadGoogleMaps } from "@/shared/utils/googleMaps";
import type { DeliveryZone, ZonePoint } from "../types";

interface ZoneLocationMapProps {
  centerLat?: number;
  centerLng?: number;
  polygon?: ZonePoint[];
  zoneName?: string;
  existingZones?: DeliveryZone[];
  onPolygonChange?: (points: ZonePoint[], center?: { lat: number; lng: number }) => void;
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
 * Generates an initial 6-point regular polygon boundary around a center location (~650m radius)
 */
export function generateDefaultBoundary(
  center: { lat: number; lng: number },
  radiusMeters = 650
): ZonePoint[] {
  const points: ZonePoint[] = [];
  const numPoints = 6;
  const earthRadius = 6378137; // meters
  for (let i = 0; i < numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
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
  const geocoderRef = useRef<any>(null);
  const pathListenersRef = useRef<any[]>([]);

  const [points, setPoints] = useState<ZonePoint[]>(externalPolygon);
  const [history, setHistory] = useState<ZonePoint[][]>([]);
  const [isIdentifying, setIsIdentifying] = useState(false);

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

  // Read current points from the google maps polygon path
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

    isInternalChangeRef.current = true;
    setPoints(newPoints);
    if (newPoints.length > 0) {
      const centroid = calculateCentroid(newPoints);
      if (markerRef.current && mapRef.current) {
        markerRef.current.setPosition(centroid);
        markerRef.current.setMap(mapRef.current);
      }
      onPolygonChangeRef.current?.(newPoints, centroid);
    } else {
      onPolygonChangeRef.current?.(
        [],
        hasCoords ? { lat: centerLat!, lng: centerLng! } : undefined
      );
    }
  };

  // Safely updates polygon path and markers without Google Maps type confusion
  const setBoundaryPoints = (newPts: ZonePoint[], notify = true) => {
    isInternalChangeRef.current = true;
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

    if (newPts.length > 0) {
      const centroid = calculateCentroid(newPts);
      if (markerRef.current && mapRef.current) {
        markerRef.current.setPosition(centroid);
        markerRef.current.setMap(mapRef.current);
      }
      if (notify) {
        onPolygonChangeRef.current?.(newPts, centroid);
      }
    } else {
      if (notify) {
        onPolygonChangeRef.current?.(
          [],
          hasCoords ? { lat: centerLat!, lng: centerLng! } : undefined
        );
      }
    }
  };

  // Push new state to history before changing
  const pushHistory = (currentPoints: ZonePoint[]) => {
    setHistory((prev) => [...prev.slice(-15), currentPoints]);
  };

  // Undo last point or modification
  const handleUndo = () => {
    if (history.length > 0) {
      const prevPoints = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setBoundaryPoints(prevPoints);
    } else if (points.length > 0) {
      const prevPoints = points.slice(0, -1);
      setBoundaryPoints(prevPoints);
    }
  };

  // Clear all points
  const handleClear = () => {
    pushHistory(points);
    setBoundaryPoints([]);
  };

  // Add a point to boundary
  const handleAddPoint = (latLng: any) => {
    pushHistory(points);
    const lat = Number(latLng.lat().toFixed(6));
    const lng = Number(latLng.lng().toFixed(6));
    const newPts = [...points, { lat, lng }];
    setBoundaryPoints(newPts);
  };

  // Sync external polygon into state if changed outside
  useEffect(() => {
    if (externalPolygon && externalPolygon.length > 0) {
      if (JSON.stringify(externalPolygon) !== JSON.stringify(points)) {
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
          setPoints(initialPts);
          onPolygonChangeRef.current?.(initialPts, initialCenter);
        }

        // Click on polygon surface appends points
        polygon.addListener("click", (e: any) => {
          if (!e.latLng) return;
          handleAddPoint(e.latLng);
        });

        // Right-click a vertex to remove it
        polygon.addListener("rightclick", (e: any) => {
          if (e.vertex !== undefined && pathRef.current) {
            pushHistory(points);
            pathRef.current.removeAt(e.vertex);
            syncFromPath();
          }
        });

        // Initialize PRIMARY PIN MARKER - ALWAYS visible on the map!
        const centroid = initialPts.length > 0 ? calculateCentroid(initialPts) : initialCenter;
        const marker = new window.google.maps.Marker({
          position: centroid,
          map: map,
          icon: makePrimaryPinIcon(),
          draggable: true,
          cursor: "grab",
          zIndex: 999,
        });

        marker.addListener("dragend", (e: any) => {
          if (!e.latLng) return;
          isInternalChangeRef.current = true;
          const lat = Number(e.latLng.lat().toFixed(6));
          const lng = Number(e.latLng.lng().toFixed(6));
          const newPos = { lat, lng };

          if (points.length === 0) {
            const defaultPts = generateDefaultBoundary(newPos, 650);
            setBoundaryPoints(defaultPts);
          }

          if (window.google?.maps) {
            if (!geocoderRef.current) geocoderRef.current = new window.google.maps.Geocoder();
            setIsIdentifying(true);
            geocoderRef.current.geocode(
              { location: newPos, language: language || "en" },
              (results: any[], status: string) => {
                setIsIdentifying(false);
                if (status === "OK" && results?.length) {
                  const area = extractZoneAreaFromGeocode(results);
                  onLocationChangeRef.current?.(lat, lng, area || undefined);
                } else {
                  onLocationChangeRef.current?.(lat, lng);
                }
              }
            );
          } else {
            onLocationChangeRef.current?.(lat, lng);
          }
        });

        markerRef.current = marker;

        // Click anywhere on map to add point or seed boundary
        map.addListener("click", (e: any) => {
          if (!e.latLng) return;
          const lat = Number(e.latLng.lat().toFixed(6));
          const lng = Number(e.latLng.lng().toFixed(6));
          const clickedPos = { lat, lng };

          // If no boundary points exist yet, center red pin and generate 6-point boundary
          if (!pathRef.current || pathRef.current.getLength() === 0) {
            marker.setPosition(clickedPos);
            marker.setMap(map);
            map.panTo(clickedPos);
            const defaultPts = generateDefaultBoundary(clickedPos, 650);
            setBoundaryPoints(defaultPts);

            // Reverse geocode to identify area name
            if (window.google?.maps) {
              if (!geocoderRef.current) geocoderRef.current = new window.google.maps.Geocoder();
              setIsIdentifying(true);
              geocoderRef.current.geocode(
                { location: clickedPos, language: language || "en" },
                (results: any[], status: string) => {
                  setIsIdentifying(false);
                  if (status === "OK" && results?.length) {
                    const area = extractZoneAreaFromGeocode(results);
                    onLocationChangeRef.current?.(lat, lng, area || undefined);
                  } else {
                    onLocationChangeRef.current?.(lat, lng);
                  }
                }
              );
            }
          } else {
            // Boundary already exists: clicking map appends another point
            handleAddPoint(e.latLng);
          }
        });

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
      {/* Header Row: ZONE BOUNDARY & Undo/Clear Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Hexagon className="size-3.5 text-[#8F6900]" />
          <span className="text-[12px] font-bold tracking-wider text-[#28293D] uppercase">
            {t("ZONE BOUNDARY")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleUndo}
            disabled={points.length === 0}
            title={t("Undo last point")}
            className="rounded-md p-1 text-[#595959] hover:bg-[#F0F0EE] hover:text-[#28293D] disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
          >
            <Undo2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={points.length === 0}
            title={t("Clear boundary")}
            className="rounded-md p-1 text-[#595959] hover:bg-[#F0F0EE] hover:text-[#28293D] disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      {/* Subtitle guidance matching the screenshot */}
      <p className="text-[12px] text-[#8B8B8B]">
        {points.length >= 3
          ? t(
              "Boundary set — {{count}} points. Drag a point to adjust, or click the map to add more."
            ).replace("{{count}}", String(points.length))
          : points.length > 0
          ? t(
              "Boundary drawing — {{count}} points. Click the map to add at least 3 points to complete the polygon."
            ).replace("{{count}}", String(points.length))
          : t("Click the map to place boundary points to define the zone.")}
      </p>

      {/* Map Container */}
      <div className="relative mt-1 h-64 w-full overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-[#F5F0EA]/30 sm:h-72">
        <div ref={containerRef} className="h-full w-full" />

        {/* Live Identification Badge */}
        {isIdentifying && (
          <div className="pointer-events-none absolute top-3 inset-x-0 z-10 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-black/80 px-3.5 py-1.5 text-[12px] font-medium text-white shadow-lg backdrop-blur-sm">
              <Loader2 className="size-3.5 animate-spin text-primary" />
              <span>{t("Identifying zone name...")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoneLocationMap;
