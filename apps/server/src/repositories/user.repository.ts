import { BaseRepository } from "./base.repository.js";

export interface User {
  id: string; // = Clerk user_id
  email: string;
  name: string | null;
  org_id: string | null;
  role: "admin" | "developer" | null;
  created_at: string;
  updated_at: string;
}

export class UserRepository extends BaseRepository {
  async findById(id: string): Promise<User | null> {
    return this.queryOne<User>(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.queryOne<User>(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
  }

  async findByOrgId(orgId: string): Promise<User[]> {
    return this.query<User>(
      `SELECT * FROM users WHERE org_id = $1 ORDER BY created_at ASC`,
      [orgId]
    );
  }

  /**
   * Upsert a user from a Clerk webhook payload.
   * id = Clerk's user_id; role and org_id are managed by us separately.
   */
  async upsertFromClerk(id: string, email: string, name: string | null): Promise<User> {
    await this.query(
      `INSERT INTO users (id, email, name, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET
         email      = excluded.email,
         name       = excluded.name,
         updated_at = CURRENT_TIMESTAMP`,
      [id, email, name ?? null]
    );
    return (await this.findById(id))!;
  }

  async setOrg(userId: string, orgId: string, role: "admin" | "developer"): Promise<void> {
    await this.query(
      `UPDATE users SET org_id = $1, role = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [orgId, role, userId]
    );
  }

  async softDelete(id: string): Promise<void> {
    await this.query(
      `UPDATE users SET org_id = NULL, role = NULL, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );
  }
}
