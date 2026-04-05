"use client";

import { Progress } from "@/components/ui/progress";

type XPBarProps = {
  xp: number;
  level: number;
};

/** Simple level curve aligned with backend `calculateLevel` (sqrt-based). */
function progressInLevel(xp: number, level: number): { current: number; required: number; pct: number } {
  const currentFloor = Math.pow(level - 1, 2) * 50;
  const nextFloor = Math.pow(level, 2) * 50;
  const span = nextFloor - currentFloor;
  const cur = xp - currentFloor;
  return { current: cur, required: span, pct: span > 0 ? Math.min(100, (cur / span) * 100) : 100 };
}

export function XPBar({ xp, level }: XPBarProps) {
  const { current, required, pct } = progressInLevel(xp, level);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Level {level}</span>
        <span>
          {Math.round(current)} / {Math.round(required)} XP
        </span>
      </div>
      <Progress value={pct} />
    </div>
  );
}
