import { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { analyzeImage } from "../services/gemini.service";
import { uploadScanImage } from "../services/storage.service";
import { applyGamification, calculateLevel, resolveStreak } from "../services/gamification.service";
import { prisma } from "../lib/prisma";

export async function createScan(req: AuthRequest, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: "No image provided" });
    return;
  }
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const imageUrl = await uploadScanImage(req.file, req.userId);
    const aiResult = await analyzeImage(req.file.buffer, req.file.mimetype);
    const rewards = applyGamification(aiResult.disposalMethod);

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.userId },
    });

    const streakState = resolveStreak(user.lastScanDate);
    let streakCount = user.streakCount;
    if (streakState === "same") {
      streakCount = user.streakCount;
    } else if (streakState === "continue") {
      streakCount = user.streakCount + 1;
    } else {
      streakCount = 1;
    }

    const newXp = user.xp + rewards.xpEarned;
    const newLevel = calculateLevel(newXp);
    const leveledUp = newLevel > user.level;

    const scan = await prisma.$transaction(async (tx) => {
      const created = await tx.scan.create({
        data: {
          userId: req.userId!,
          imageUrl,
          materialName: aiResult.materialName,
          description: aiResult.description,
          disposalMethod: aiResult.disposalMethod,
          disposalNotes: aiResult.disposalNotes ?? null,
          confidence: aiResult.confidence,
          co2Saved: rewards.co2Saved,
          xpEarned: rewards.xpEarned,
          creditsEarned: rewards.creditsEarned,
        },
      });

      await tx.user.update({
        where: { id: req.userId! },
        data: {
          xp: newXp,
          level: newLevel,
          credits: { increment: rewards.creditsEarned },
          totalCO2: { increment: rewards.co2Saved },
          lastScanDate: new Date(),
          streakCount,
        },
      });

      return created;
    });

    res.status(201).json({
      scan,
      xpEarned: rewards.xpEarned,
      creditsEarned: rewards.creditsEarned,
      co2Saved: rewards.co2Saved,
      ...(leveledUp && { newLevel }),
      streakCount,
    });
  } catch (err) {
    console.error("Scan error:", err);
    res.status(500).json({ error: "Scan failed" });
  }
}

export async function getUserScans(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const scans = await prisma.scan.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    res.json(scans);
  } catch (e) {
    console.error("getUserScans", e);
    res.status(500).json({ error: "Failed to load scans" });
  }
}
