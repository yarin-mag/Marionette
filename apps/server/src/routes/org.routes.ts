import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { OrgController } from "../controllers/org.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { loadOurUser } from "../middleware/clerk.middleware.js";
import { requireAdmin } from "../middleware/require-admin.middleware.js";

export function createOrgRoutes() {
  const router = Router();
  const controller = new OrgController();

  // All org routes require a valid Clerk session + our user record.
  // loadOurUser has its own try/catch so doesn't need asyncHandler.
  router.use(requireAuth(), loadOurUser);

  router.post("/", asyncHandler(controller.createOrg.bind(controller)));
  router.get("/me", asyncHandler(controller.getMe.bind(controller)));
  router.get("/members", asyncHandler(controller.listMembers.bind(controller)));
  router.get("/metrics", asyncHandler(controller.getTeamMetrics.bind(controller)));

  // API key management — admin only
  router.get("/keys", requireAdmin, asyncHandler(controller.listApiKeys.bind(controller)));
  router.post("/keys", requireAdmin, asyncHandler(controller.generateApiKey.bind(controller)));
  router.delete("/keys/:keyId", requireAdmin, asyncHandler(controller.revokeApiKey.bind(controller)));

  return router;
}
