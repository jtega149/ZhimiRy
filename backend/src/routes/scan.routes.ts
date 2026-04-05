import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadMiddleware } from "../middleware/upload.middleware";
import { createScan, getUserScans } from "../controllers/scan.controller";

const router = Router();

router.post("/", requireAuth, uploadMiddleware, createScan);
router.get("/history", requireAuth, getUserScans);

export default router;
