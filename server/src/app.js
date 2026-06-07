import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import leadRoutes from "./routes/leadRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();
  const defaultClientOrigins = "http://localhost:5173,http://127.0.0.1:5173";
  const allowedOrigins = (process.env.CLIENT_ORIGIN || defaultClientOrigins)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "lead-crm-api" });
  });

  app.use("/api/leads", leadRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
