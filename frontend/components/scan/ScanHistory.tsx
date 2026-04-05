"use client";

import { useEffect, useState } from "react";
import type { Scan } from "@zhimiry/shared";
import api from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const methodColors: Record<string, string> = {
  recycle: "bg-emerald-600",
  compost: "bg-amber-800",
  trash: "bg-slate-500",
  special: "bg-red-600",
};

export function ScanHistory() {
  const [scans, setScans] = useState<Scan[] | null>(null);

  useEffect(() => {
    api.get<Scan[]>("/api/scan/history").then((res) => setScans(res.data));
  }, []);

  if (scans === null) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading history…
      </div>
    );
  }

  if (scans.length === 0) {
    return <p className="text-sm text-muted-foreground">No scans yet. Try the scan page.</p>;
  }

  return (
    <ul className="space-y-3">
      {scans.map((s) => (
        <li key={s.id}>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
              <CardTitle className="text-base">{s.materialName}</CardTitle>
              <Badge className={methodColors[s.disposalMethod] ?? ""}>{s.disposalMethod}</Badge>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {new Date(s.createdAt).toLocaleString()} · +{s.xpEarned} XP · {s.co2Saved.toFixed(2)} kg CO₂
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
