import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getLeaderboard(_req: Request, res: Response): Promise<void> {
  try {
    const leaders = await prisma.user.findMany({
      take: 50,
      orderBy: { xp: "desc" },
      select: {
        id: true,
        name: true,
        image: true,
        xp: true,
        level: true,
        streakCount: true,
        totalCO2: true,
        _count: { select: { scans: true } },
      },
    });

    res.json(
      leaders.map((u) => ({
        id: u.id,
        name: u.name,
        image: u.image,
        xp: u.xp,
        level: u.level,
        streakCount: u.streakCount,
        totalCO2: u.totalCO2,
        scanCount: u._count.scans,
      }))
    );
  } catch (e) {
    console.error("getLeaderboard", e);
    res.status(500).json({ error: "Failed to load leaderboard" });
  }
}
