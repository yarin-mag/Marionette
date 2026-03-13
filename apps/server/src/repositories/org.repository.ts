import { uid } from "@marionette/shared";
import { BaseRepository } from "./base.repository.js";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  created_at: string;
}

export class OrgRepository extends BaseRepository {
  async create(name: string, slug: string): Promise<Organization> {
    const id = uid("org");
    await this.query(
      `INSERT INTO organizations (id, name, slug) VALUES ($1, $2, $3)`,
      [id, name, slug]
    );
    return (await this.findById(id))!;
  }

  async findById(id: string): Promise<Organization | null> {
    return this.queryOne<Organization>(
      `SELECT * FROM organizations WHERE id = $1`,
      [id]
    );
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.queryOne<Organization>(
      `SELECT * FROM organizations WHERE slug = $1`,
      [slug]
    );
  }
}
