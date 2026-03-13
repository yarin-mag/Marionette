import { createHash, randomBytes } from "crypto";
import { uid } from "@marionette/shared";
import { BaseRepository } from "./base.repository.js";

export interface OrgApiKey {
  id: string;
  org_id: string;
  key_hash: string;
  label: string | null;
  created_by: string | null;
  created_at: string;
}

export interface NewKeyResult {
  key: OrgApiKey;
  /** Raw key — shown once, never stored */
  rawKey: string;
}

export function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey).digest("hex");
}

export class OrgApiKeyRepository extends BaseRepository {
  async create(orgId: string, createdBy: string, label?: string): Promise<NewKeyResult> {
    const rawKey = randomBytes(32).toString("hex");
    const keyHash = hashApiKey(rawKey);
    const id = uid("key");

    await this.query(
      `INSERT INTO org_api_keys (id, org_id, key_hash, label, created_by)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, orgId, keyHash, label ?? null, createdBy]
    );

    return { key: (await this.findById(id))!, rawKey };
  }

  async findById(id: string): Promise<OrgApiKey | null> {
    return this.queryOne<OrgApiKey>(
      `SELECT * FROM org_api_keys WHERE id = $1`,
      [id]
    );
  }

  async findByKeyHash(keyHash: string): Promise<OrgApiKey | null> {
    return this.queryOne<OrgApiKey>(
      `SELECT * FROM org_api_keys WHERE key_hash = $1`,
      [keyHash]
    );
  }

  async listByOrgId(orgId: string): Promise<OrgApiKey[]> {
    return this.query<OrgApiKey>(
      `SELECT * FROM org_api_keys WHERE org_id = $1 ORDER BY created_at DESC`,
      [orgId]
    );
  }

  async deleteById(id: string): Promise<void> {
    await this.query(`DELETE FROM org_api_keys WHERE id = $1`, [id]);
  }
}
