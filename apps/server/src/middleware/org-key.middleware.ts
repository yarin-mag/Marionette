import type { RequestHandler } from "express";
import { OrgApiKeyRepository, hashApiKey } from "../repositories/org-api-key.repository.js";

interface OrgKeyContext {
  orgId: string;
  keyId: string;
  createdBy: string | null;
}

declare global {
  namespace Express {
    interface Request {
      orgKey?: OrgKeyContext;
    }
  }
}

/**
 * Machine-to-machine auth for the /ingest endpoint.
 * Expects: Authorization: Bearer <raw_api_key>
 * Hashes the key and looks it up in org_api_keys.
 */
export const requireOrgKey: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing API key" });
      return;
    }

    const rawKey = authHeader.slice(7);
    const keyHash = hashApiKey(rawKey);

    const repo = new OrgApiKeyRepository();
    const apiKey = await repo.findByKeyHash(keyHash);

    if (!apiKey) {
      res.status(401).json({ error: "Invalid API key" });
      return;
    }

    req.orgKey = { orgId: apiKey.org_id, keyId: apiKey.id, createdBy: apiKey.created_by };
    next();
  } catch (err) {
    next(err);
  }
};
