"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  Circle,
  GoogleMap,
  Marker,
  OverlayView,
  OVERLAY_MOUSE_TARGET,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import { GOOGLE_MAPS_DARK_STYLES } from "./google-maps-dark-style";
import { getTrashCanMarkerIconDataUrl } from "./trash-can-marker-icon";
import {
  fetchAllNycTrashFeaturesOnce,
  filterTrashWithinRadius,
  isNycTrashDatasetCached,
  NEARBY_TRASH_RADIUS_M,
  type NearbyTrashPin,
} from "@/lib/nyc-trash-dataset";

const mapContainerStyle: CSSProperties = {
  width: "100%",
  height: "min(70vh, 560px)",
};

/** Google Maps–style live location: soft pulse + solid blue core (approximates the native “my location” dot). */
function LiveLocationDot() {
  return (
    <div
      className="pointer-events-none relative flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      aria-hidden
    >
      <span className="absolute h-11 w-11 animate-ping rounded-full bg-[#4285F4]/30 [animation-duration:2.2s]" />
      <span className="absolute h-7 w-7 rounded-full bg-[#4285F4]/25 blur-[2px]" />
      <span className="relative z-[1] h-[15px] w-[15px] rounded-full border-[2.5px] border-white bg-[#4285F4] shadow-[0_1px_4px_rgba(0,0,0,0.35),0_0_12px_rgba(66,133,244,0.65)]" />
    </div>
  );
}

type GeoState =
  | "idle"
  | "loading"
  | "ready"
  | "denied"
  | "unavailable"
  | "timeout";

function clampAccuracyMeters(m: number): number {
  if (!Number.isFinite(m) || m <= 0) return 45;
  return Math.min(Math.max(m, 20), 180);
}

function RecyclingMapInner({ apiKey }: { apiKey: string }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "zhimiry-google-map",
    googleMapsApiKey: apiKey,
  });

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracyM, setAccuracyM] = useState(45);
  const [geoState, setGeoState] = useState<GeoState>("idle");

  const [trashVisible, setTrashVisible] = useState(false);
  const [trashBins, setTrashBins] = useState<NearbyTrashPin[]>([]);
  const [trashLoading, setTrashLoading] = useState(false);
  const [loadingNycDataset, setLoadingNycDataset] = useState(false);
  const [trashNotice, setTrashNotice] = useState<string | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const positionRef = useRef<{ lat: number; lng: number } | null>(null);
  positionRef.current = position;

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const startLiveTracking = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGeoState("unavailable");
      return;
    }
    clearWatch();
    setGeoState("loading");
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const next = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(next);
        setAccuracyM(clampAccuracyMeters(pos.coords.accuracy ?? 45));
        setGeoState("ready");
      },
      (err) => {
        clearWatch();
        setPosition(null);
        if (err.code === 1) setGeoState("denied");
        else if (err.code === 2) setGeoState("unavailable");
        else if (err.code === 3) setGeoState("timeout");
        else setGeoState("unavailable");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 30_000 }
    );
  }, [clearWatch]);

  useEffect(() => {
    startLiveTracking();
    return () => clearWatch();
  }, [startLiveTracking, clearWatch]);

  const trashMarkerIcon = useMemo((): google.maps.Icon | undefined => {
    if (!isLoaded || typeof google === "undefined") return undefined;
    return {
      url: getTrashCanMarkerIconDataUrl(),
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 40),
    };
  }, [isLoaded]);

  const loadNearbyTrashcans = useCallback(async () => {
    const pos = positionRef.current;
    if (!pos) return;
    setTrashLoading(true);
    setTrashNotice(null);
    try {
      if (!isNycTrashDatasetCached()) {
        setLoadingNycDataset(true);
      }
      const all = await fetchAllNycTrashFeaturesOnce();

      const nearby = filterTrashWithinRadius(all, pos.lat, pos.lng, NEARBY_TRASH_RADIUS_M);
      setTrashBins(nearby);
      setTrashVisible(true);
      if (nearby.length === 0) {
        setTrashNotice("No nearby trashcans");
      } else {
        setTrashNotice(null);
      }
    } catch (e) {
      console.error("NYC trash dataset:", e);
      setTrashNotice("Failed to load the NYC trash can dataset. Try again.");
      setTrashBins([]);
    } finally {
      setLoadingNycDataset(false);
      setTrashLoading(false);
    }
  }, []);

  const onTrashToggle = useCallback(() => {
    if (trashVisible) {
      setTrashVisible(false);
      setTrashNotice(null);
      return;
    }
    void loadNearbyTrashcans();
  }, [trashVisible, loadNearbyTrashcans]);

  if (loadError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Map could not load</CardTitle>
          <CardDescription>
            Check that the Maps JavaScript API is enabled for your key in Google Cloud Console and that billing is
            configured if required.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (geoState === "denied") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="space-y-1">
              <CardTitle>Location access needed</CardTitle>
              <CardDescription className="text-base text-foreground/90">
                Please turn on location to use the map. Allow location when your browser asks, or enable it in your site
                settings for this page.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={startLiveTracking}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (geoState === "unavailable" || geoState === "timeout") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Location unavailable</CardTitle>
          <CardDescription>
            {geoState === "timeout"
              ? "Getting your location took too long. Check your connection and try again."
              : "We couldn’t read your position. Location services may be turned off on this device."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={startLiveTracking}>
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (geoState === "loading" || geoState === "idle") {
    return (
      <div className="flex min-h-[min(70vh,560px)] flex-col items-center justify-center gap-3 rounded-lg border bg-muted/30 px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        <p className="text-center text-sm text-muted-foreground">
          Requesting your location… your browser will ask to share it if you haven’t allowed it yet.
        </p>
      </div>
    );
  }

  if (!position) {
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[min(70vh,560px)] flex-col items-center justify-center gap-3 rounded-lg border bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        <p className="text-sm text-muted-foreground">Loading map…</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant={trashVisible ? "secondary" : "default"}
          disabled={trashLoading || loadingNycDataset || geoState !== "ready"}
          onClick={onTrashToggle}
          className="w-full sm:w-auto"
        >
          {loadingNycDataset ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading NYC data…
            </>
          ) : trashLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching…
            </>
          ) : trashVisible ? (
            "Hide Trashcans"
          ) : (
            "Show Trashcans"
          )}
        </Button>
        {trashNotice && (
          <p className="text-sm text-muted-foreground sm:text-right" role="status">
            {trashNotice}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border shadow-sm">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={position}
          zoom={16}
          options={{
            styles: GOOGLE_MAPS_DARK_STYLES,
            backgroundColor: "#242f3e",
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        >
          <Circle
            center={position}
            radius={accuracyM}
            options={{
              strokeColor: "#4285F4",
              strokeOpacity: 0.45,
              strokeWeight: 1,
              fillColor: "#4285F4",
              fillOpacity: 0.12,
              clickable: false,
            }}
          />
          <OverlayView position={position} mapPaneName={OVERLAY_MOUSE_TARGET}>
            <LiveLocationDot />
          </OverlayView>

          {trashVisible &&
            trashMarkerIcon &&
            trashBins.map((bin) => (
              <Marker
                key={bin.id}
                position={{ lat: bin.lat, lng: bin.lng }}
                icon={trashMarkerIcon}
                title={bin.name ?? "Trash can"}
              />
            ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export function RecyclingMapPanel() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();

  if (!apiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Maps API key missing</CardTitle>
          <CardDescription>
            Add <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code> and restart the dev server.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return <RecyclingMapInner apiKey={apiKey} />;
}
