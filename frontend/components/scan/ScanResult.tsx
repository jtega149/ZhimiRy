"use client";

import type { ScanResponse } from "@zhimiry/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const methodColors: Record<string, string> = {
  recycle: "bg-emerald-600 hover:bg-emerald-600",
  compost: "bg-amber-800 hover:bg-amber-800",
  trash: "bg-slate-500 hover:bg-slate-500",
  special: "bg-red-600 hover:bg-red-600",
};

type ScanResultProps = {
  data: ScanResponse;
};

export function ScanResult({ data }: ScanResultProps) {
  const { scan, xpEarned, creditsEarned, co2Saved, newLevel, streakCount } = data;
  const pct = Math.min(100, Math.round(scan.confidence * 100));

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="text-2xl">{scan.materialName}</CardTitle>
        <Badge className={methodColors[scan.disposalMethod] ?? "bg-primary"}>{scan.disposalMethod}</Badge>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="text-muted-foreground">{scan.description}</p>
        {scan.disposalNotes && <p>{scan.disposalNotes}</p>}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">XP earned</p>
            <p className="text-lg font-semibold">+{xpEarned}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Credits</p>
            <p className="text-lg font-semibold">+{creditsEarned}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">CO₂ saved</p>
            <p className="text-lg font-semibold">{co2Saved.toFixed(2)} kg</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="text-lg font-semibold">{streakCount} days</p>
          </div>
        </div>
        {newLevel != null && (
          <p className="rounded-md bg-accent px-3 py-2 font-medium text-accent-foreground">
            Level up! You reached level {newLevel}.
          </p>
        )}
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Model confidence</p>
          <Progress value={pct} />
          <p className="mt-1 text-xs text-muted-foreground">{pct}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
