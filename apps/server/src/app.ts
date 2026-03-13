import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler.js";
import { clerkGlobal } from "./middleware/clerk.middleware.js";
import { logger } from "./utils/logger.js";
import { config } from "./config/index.js";

/**
 * Create and configure the Express application
 * Routes should be mounted separately after WebSocket service is initialized
 */
export function createApp() {
  const app = express();

  // CORS — local-only by default; cloud mode allows all origins (Clerk handles auth)
  app.use(cors({
    origin: (origin, callback) => {
      if (config.cloud.enabled) { callback(null, true); return; }
      if (!origin || origin === "null" || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: "${origin}"`);
        callback(new Error("CORS: origin not allowed"));
      }
    },
  }));

  // Svix (Clerk webhook verification) needs the raw body bytes, not parsed JSON.
  // Mount raw body parser for webhook paths before the global JSON parser.
  app.use("/api/webhooks", express.raw({ type: "application/json" }));
  app.use(express.json({ limit: config.api.jsonBodyLimit }));

  // Clerk global middleware — no-op locally, verifies session tokens in cloud mode
  app.use(clerkGlobal);

  // Request logging middleware
  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });

  return app;
}

/**
 * Mount error handler (must be called after routes are mounted)
 */
export function mountErrorHandler(app: express.Application) {
  app.use(errorHandler);
}
