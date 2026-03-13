import { homedir } from "os";
import { join } from "path";

/**
 * Centralized configuration management
 * All environment variables and constants in one place
 */
export const config = {
  port: parseInt(process.env.PORT || "8787", 10),

  database: {
    // In dev: set DATABASE_URL=sqlite:db/marionette.db in .env (see .env.example)
    // In production: defaults to ~/.marionette/marionette.db (works on all platforms)
    url: process.env.DATABASE_URL || `sqlite:${join(homedir(), ".marionette", "marionette.db")}`,
  },

  websocket: {
    heartbeatIntervalMs: 30000,
    idleCheckIntervalMs: 30000,
    idleTimeoutMinutes: 2,
    disconnectTimeoutMinutes: 10,
  },

  hooks: {
    debounceMs: 200,
  },

  api: {
    maxEventsLimit: 2000,
    defaultEventsLimit: 500,
    jsonBodyLimit: "2mb",
  },

  cloud: {
    // Clerk keys — required when CLOUD_MODE=true
    clerkSecretKey: process.env.CLERK_SECRET_KEY || "",
    clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET || "",
    // Set CLOUD_MODE=true to enable multi-tenant auth and org management
    enabled: process.env.CLOUD_MODE === "true",
  },
} as const;
