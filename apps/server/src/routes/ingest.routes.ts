import { Router } from "express";
import { IngestController } from "../controllers/ingest.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { requireOrgKey } from "../middleware/org-key.middleware.js";
import type { EventService } from "../services/event.service.js";

export function createIngestRoutes(eventService: EventService) {
  const router = Router();
  const controller = new IngestController(eventService);

  // Machine-to-machine: local Marionette proxy sends token events here
  // Authentication via org API key (Bearer token in Authorization header)
  router.post("/ingest", requireOrgKey, asyncHandler(controller.receiveEvent.bind(controller)));

  return router;
}
