import axios from "axios";

/** NYC Open Data: litter basket inventory (GeoJSON). Same source as the reference example.js */
export const NYC_TRASH_GEOJSON_URL =
  "https://data.cityofnewyork.us/resource/8znf-7b2c.geojson?$limit=50000";

/** ~0.3 mile search radius (meters), matching the earlier map feature spec */
export const NEARBY_TRASH_RADIUS_M = Math.round(0.3 * 1609.344);

export type NycTrashGeoJSONFeature = {
  type?: string;
  geometry?: { type?: string; coordinates?: [number, number] };
  properties?: Record<string, unknown>;
};

type GeoJSONCollection = {
  type?: string;
  features?: NycTrashGeoJSONFeature[];
};

let cachedFeatures: NycTrashGeoJSONFeature[] | null = null;
let inflightFetch: Promise<NycTrashGeoJSONFeature[]> | null = null;

/** True after the NYC GeoJSON has been fetched at least once this session. */
export function isNycTrashDatasetCached(): boolean {
  return cachedFeatures !== null;
}

/** Haversine distance in meters (same approach as example.js). */
export function haversineDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Fetch all NYC trash basket features once; results are cached in-memory for the session
 * (same pattern as example.js: `if (allGarbageCans) return allGarbageCans`).
 */
export async function fetchAllNycTrashFeaturesOnce(): Promise<NycTrashGeoJSONFeature[]> {
  if (cachedFeatures) return cachedFeatures;
  if (inflightFetch) return inflightFetch;

  inflightFetch = (async () => {
    const { data } = await axios.get<GeoJSONCollection>(NYC_TRASH_GEOJSON_URL);
    const feats = Array.isArray(data.features) ? data.features : [];
    cachedFeatures = feats;
    return feats;
  })();

  try {
    return await inflightFetch;
  } finally {
    inflightFetch = null;
  }
}

export type NearbyTrashPin = {
  id: string;
  lat: number;
  lng: number;
  name: string | null;
};

export function filterTrashWithinRadius(
  features: NycTrashGeoJSONFeature[],
  userLat: number,
  userLng: number,
  radiusM: number
): NearbyTrashPin[] {
  const out: NearbyTrashPin[] = [];
  features.forEach((f, index) => {
    const coords = f.geometry?.coordinates;
    if (!coords || coords.length < 2) return;
    const [lng, lat] = coords;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    if (haversineDistanceMeters(userLat, userLng, lat, lng) > radiusM) return;

    const props = f.properties ?? {};
    const id = String(
      props.objectid ?? props.object_id ?? props.bin_number ?? props.cartodb_id ?? `nyc-trash-${index}`
    );
    const name =
      (typeof props.location_description === "string" && props.location_description) ||
      (typeof props.borough === "string" && props.borough) ||
      null;

    out.push({ id, lat, lng, name });
  });
  out.sort(
    (a, b) =>
      haversineDistanceMeters(userLat, userLng, a.lat, a.lng) -
      haversineDistanceMeters(userLat, userLng, b.lat, b.lng)
  );
  return out;
}
