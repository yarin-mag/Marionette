import type { Request, Response } from "express";
import type { MarionetteEvent } from "@marionette/shared";
import type { EventService } from "../services/event.service.js";
import { logger } from "../utils/logger.js";

const MAX_BATCH = 100;

export class IngestController {
  constructor(private eventService: EventService) {}

  async receiveEvent(req: Request, res: Response): Promise<void> {
    const { orgId, createdBy } = req.orgKey!;

    const body = req.body as MarionetteEvent | MarionetteEvent[];
    const batch: MarionetteEvent[] = Array.isArray(body) ? body : [body];

    if (batch.length > MAX_BATCH) {
      res.status(413).json({ error: `Batch too large: max ${MAX_BATCH}` });
      return;
    }

    // Stamp each event with the org and user that the API key belongs to
    const stamped = batch.map((event) => ({
      ...event,
      org_id: orgId,
      user_id: event.user_id ?? createdBy ?? undefined,
    }));

    const { processed, failed } = await this.eventService.processBatch(stamped);

    if (failed.length > 0) {
      logger.warn(`[ingest] ${failed.length} events failed`, { orgId });
    }

    res.status(200).json({ received: batch.length, processed: processed.length });
  }
}
