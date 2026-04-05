const CO2_MAP: Record<string, number> = {
  recycle: 0.5,
  compost: 0.3,
  trash: 0.0,
  special: 0.1,
};

const XP_MAP: Record<string, number> = {
  recycle: 20,
  compost: 15,
  trash: 5,
  special: 10,
};

export function applyGamification(disposalMethod: string): {
  xpEarned: number;
  co2Saved: number;
  creditsEarned: number;
} {
  const xpEarned = XP_MAP[disposalMethod] ?? 5;
  const co2Saved = CO2_MAP[disposalMethod] ?? 0;
  const creditsEarned = Math.floor(xpEarned / 4);
  return { xpEarned, co2Saved, creditsEarned };
}

export function calculateLevel(xp: number): number {
  return Math.floor(1 + Math.sqrt(xp / 50));
}

export function xpToNextLevel(xp: number): {
  current: number;
  required: number;
  progress: number;
} {
  const level = calculateLevel(xp);
  const currentFloor = Math.pow(level - 1, 2) * 50;
  const nextFloor = Math.pow(level, 2) * 50;
  return {
    current: xp - currentFloor,
    required: nextFloor - currentFloor,
    progress: ((xp - currentFloor) / (nextFloor - currentFloor)) * 100,
  };
}

export function resolveStreak(
  lastScanDate: Date | null
): "continue" | "reset" | "new" | "same" {
  if (!lastScanDate) return "new";
  const diffDays = Math.floor((Date.now() - lastScanDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "same";
  if (diffDays === 1) return "continue";
  return "reset";
}
