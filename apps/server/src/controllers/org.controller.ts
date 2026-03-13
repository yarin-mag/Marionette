import type { Request, Response } from "express";
import { uid } from "@marionette/shared";
import { OrgRepository } from "../repositories/org.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { OrgApiKeyRepository } from "../repositories/org-api-key.repository.js";
import { OrgMetricsRepository } from "../repositories/org-metrics.repository.js";
import type { MetricsPeriod } from "../repositories/org-metrics.repository.js";

const VALID_PERIODS = new Set<string>(["day", "week", "month"]);

export class OrgController {
  private orgRepo = new OrgRepository();
  private userRepo = new UserRepository();
  private keyRepo = new OrgApiKeyRepository();
  private metricsRepo = new OrgMetricsRepository();

  async createOrg(req: Request, res: Response): Promise<void> {
    const user = req.ourUser!;
    if (user.org_id) {
      res.status(409).json({ error: "Already a member of an org" });
      return;
    }

    const { name } = req.body as { name?: string };
    if (!name?.trim()) {
      res.status(400).json({ error: "org name is required" });
      return;
    }

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + uid("").slice(-6);
    const org = await this.orgRepo.create(name.trim(), slug);
    await this.userRepo.setOrg(user.id, org.id, "admin");

    res.status(201).json({ org, role: "admin" });
  }

  async getMe(req: Request, res: Response): Promise<void> {
    const user = req.ourUser!;
    const org = user.org_id ? await this.orgRepo.findById(user.org_id) : null;
    res.json({ user, org });
  }

  async getTeamMetrics(req: Request, res: Response): Promise<void> {
    const orgId = req.ourUser!.org_id;
    if (!orgId) { res.status(400).json({ error: "Not part of an org" }); return; }

    const period = VALID_PERIODS.has(String(req.query.period))
      ? (req.query.period as MetricsPeriod)
      : "week";

    const members = await this.metricsRepo.getTeamMetrics(orgId, period);
    res.json({ members, period });
  }

  async listMembers(req: Request, res: Response): Promise<void> {
    const orgId = req.ourUser!.org_id;
    if (!orgId) { res.status(400).json({ error: "Not part of an org" }); return; }

    const members = await this.userRepo.findByOrgId(orgId);
    res.json(members);
  }

  async generateApiKey(req: Request, res: Response): Promise<void> {
    const user = req.ourUser!;
    const { label } = req.body as { label?: string };
    const { key, rawKey } = await this.keyRepo.create(user.org_id!, user.id, label);
    // rawKey shown once — never retrievable again
    res.status(201).json({ key, rawKey });
  }

  async listApiKeys(req: Request, res: Response): Promise<void> {
    const orgId = req.ourUser!.org_id;
    if (!orgId) { res.status(400).json({ error: "Not part of an org" }); return; }
    const keys = await this.keyRepo.listByOrgId(orgId);
    res.json(keys);
  }

  async revokeApiKey(req: Request, res: Response): Promise<void> {
    await this.keyRepo.deleteById(req.params.keyId);
    res.status(204).send();
  }
}
