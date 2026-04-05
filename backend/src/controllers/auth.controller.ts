import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
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

function signToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  } as SignOptions);
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name } = req.body as {
      email?: string;
      password?: string;
      name?: string;
    };
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashed, name: name ?? null },
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

    const token = signToken(user.id);
    res.status(201).json({
      token,
      user: toPublicUser(user),
    });
  } catch (e) {
    console.error("register", e);
    res.status(500).json({ error: "Registration failed" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken(user.id);
    res.json({
      token,
      user: toPublicUser({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        xp: user.xp,
        level: user.level,
        streakCount: user.streakCount,
        totalCO2: user.totalCO2,
        credits: user.credits,
      }),
    });
  } catch (e) {
    console.error("login", e);
    res.status(500).json({ error: "Login failed" });
  }
}
