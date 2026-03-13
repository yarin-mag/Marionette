import type { Request, Response } from "express";
import { Webhook } from "svix";
import { config } from "../config/index.js";
import { UserRepository } from "../repositories/user.repository.js";
import { logger } from "../utils/logger.js";

interface ClerkEmailAddress {
  email_address: string;
  primary?: boolean;
}

interface ClerkUserPayload {
  id: string;
  email_addresses: ClerkEmailAddress[];
  first_name?: string | null;
  last_name?: string | null;
}

function extractEmail(payload: ClerkUserPayload): string {
  const primary = payload.email_addresses.find((e) => e.primary);
  return (primary ?? payload.email_addresses[0])?.email_address ?? "";
}

function extractName(payload: ClerkUserPayload): string | null {
  const parts = [payload.first_name, payload.last_name].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

export class ClerkWebhookController {
  private userRepo = new UserRepository();

  async handleWebhook(req: Request, res: Response): Promise<void> {
    const secret = config.cloud.clerkWebhookSecret;
    if (!secret) {
      logger.warn("[clerk-webhook] CLERK_WEBHOOK_SECRET not set — rejecting");
      res.status(500).json({ error: "Webhook not configured" });
      return;
    }

    const wh = new Webhook(secret);
    let event: { type: string; data: ClerkUserPayload };

    // req.body is a raw Buffer here — express.raw() is mounted for /api/webhooks in app.ts
    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : JSON.stringify(req.body);

    try {
      event = wh.verify(rawBody, {
        "svix-id": req.headers["svix-id"] as string,
        "svix-timestamp": req.headers["svix-timestamp"] as string,
        "svix-signature": req.headers["svix-signature"] as string,
      }) as typeof event;
    } catch {
      res.status(400).json({ error: "Invalid webhook signature" });
      return;
    }

    await this.handleEvent(event.type, event.data);
    res.json({ received: true });
  }

  private async handleEvent(type: string, data: ClerkUserPayload): Promise<void> {
    const email = extractEmail(data);
    const name = extractName(data);

    if (type === "user.created" || type === "user.updated") {
      await this.userRepo.upsertFromClerk(data.id, email, name);
      logger.info(`[clerk-webhook] ${type}: synced user ${data.id}`);
      return;
    }

    if (type === "user.deleted") {
      await this.userRepo.softDelete(data.id);
      logger.info(`[clerk-webhook] user.deleted: removed org association for ${data.id}`);
    }
  }
}
