import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import multer from "multer";
import authRoutes from "./routes/auth.routes";
import scanRoutes from "./routes/scan.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4001;

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/user", userRoutes);

const multerErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ error: err.message });
    return;
  }
  if (err instanceof Error && err.message === "Only image files are allowed") {
    res.status(400).json({ error: err.message });
    return;
  }
  next(err);
};

app.use(multerErrorHandler);

const fallbackErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

app.use(fallbackErrorHandler);

app.listen(PORT, () => {
  console.log(`ZhimiRy backend running on port ${PORT}`);
});
