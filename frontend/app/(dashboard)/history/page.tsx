import { ScanHistory } from "@/components/scan/ScanHistory";

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Scan history</h1>
      <p className="text-sm text-muted-foreground">Your twenty most recent scans.</p>
      <ScanHistory />
    </div>
  );
}
