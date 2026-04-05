import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { getMe, patchMe } from "../controllers/user.controller";

const router = Router();

router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, patchMe);

export default router;
