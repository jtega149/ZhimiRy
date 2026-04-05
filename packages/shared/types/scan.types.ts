export type DisposalMethod = "recycle" | "compost" | "trash" | "special";

export interface ScanResult {
  materialName: string;
  description: string;
  disposalMethod: DisposalMethod;
  disposalNotes: string | null;
  confidence: number;
}

export interface Scan extends ScanResult {
  id: string;
  userId: string;
  imageUrl: string;
  co2Saved: number;
  xpEarned: number;
  creditsEarned: number;
  createdAt: string;
}

export interface ScanResponse {
  scan: Scan;
  xpEarned: number;
  creditsEarned: number;
  co2Saved: number;
  newLevel?: number;
  streakCount: number;
}
