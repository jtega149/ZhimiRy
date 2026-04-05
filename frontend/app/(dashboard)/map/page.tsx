import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Recycling map</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            This page will show nearby recycling facilities using the Google Maps JavaScript API. Set{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">.env.local</code> when you are ready to wire it up.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[320px] rounded-lg border border-dashed bg-muted/20" />
      </Card>
    </div>
  );
}
