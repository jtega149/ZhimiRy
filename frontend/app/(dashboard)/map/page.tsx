import { RecyclingMapPanel } from "@/components/map/RecyclingMapPanel";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Recycling map</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The map centers on your live location. <strong>Show Trashcans</strong> loads the{" "}
          <a
            href="https://data.cityofnewyork.us/City-Government/Litter-Basket-Inventory/8znf-7b2c"
            className="text-primary underline underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            NYC litter basket dataset
          </a>{" "}
          once (cached in your browser) and shows bins within about 0.3 miles—only meaningful when you are in New York
          City.
        </p>
      </div>
      <RecyclingMapPanel />
    </div>
  );
}
