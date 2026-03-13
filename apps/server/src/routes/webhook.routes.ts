import { Router } from "express";
import { ClerkWebhookController } from "../controllers/clerk-webhook.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";

export function createWebhookRoutes() {
  const router = Router();
  const controller = new ClerkWebhookController();

  // Clerk fires this when users sign up, update, or delete their account.
  // Svix signature verification happens inside the controller.
  router.post("/clerk", asyncHandler(controller.handleWebhook.bind(controller)));

  return router;
}
