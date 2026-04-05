export interface LeaderboardEntry {
  id: string;
  name: string | null;
  image: string | null;
  xp: number;
  level: number;
  streakCount: number;
  totalCO2: number;
  scanCount: number;
}
