import { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";
import type { User } from "@zhimiry/shared";

function toPublicUser(u: {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  xp: number;
  level: number;
  streakCount: number;
  totalCO2: number;
  credits: number;
}): User {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    image: u.image,
    xp: u.xp,
    level: u.level,
    streakCount: u.streakCount,
    totalCO2: u.totalCO2,
    credits: u.credits,
  };
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        xp: true,
        level: true,
        streakCount: true,
        totalCO2: true,
        credits: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(toPublicUser(user));
  } catch (e) {
    console.error("getMe", e);
    res.status(500).json({ error: "Failed to load profile" });
  }
}

export async function patchMe(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { name, image } = req.body as { name?: string | null; image?: string | null };

  try {
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(image !== undefined && { image }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        xp: true,
        level: true,
        streakCount: true,
        totalCO2: true,
        credits: true,
      },
    });

    res.json(toPublicUser(user));
  } catch (e) {
    console.error("patchMe", e);
    res.status(500).json({ error: "Failed to update profile" });
  }
}
