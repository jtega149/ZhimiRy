"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";

type CO2TrackerProps = {
  totalKg: number;
};

export function CO2Tracker({ totalKg }: CO2TrackerProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Leaf className="h-5 w-5 text-primary" />
        <CardTitle className="text-base">CO₂ impact</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{totalKg.toFixed(2)} kg</p>
        <p className="text-xs text-muted-foreground">Estimated savings from your scans</p>
      </CardContent>
    </Card>
  );
}
