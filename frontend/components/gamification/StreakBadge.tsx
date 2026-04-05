"use client";

import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

type StreakBadgeProps = {
  days: number;
};

export function StreakBadge({ days }: StreakBadgeProps) {
  return (
    <Badge variant="secondary" className="gap-1">
      <Flame className="h-3.5 w-3.5 text-orange-500" />
      {days} day streak
    </Badge>
  );
}
