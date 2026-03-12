import type { MessageTokenEntry } from "@marionette/shared";
import { BaseRepository } from "./base.repository.js";

export interface MessageTokenRow {
  id: number;
  agent_id: string;
  run_id: string;
  msg_index: number;
  role: "user" | "assistant";
  tokens: number;
  cost_usd: number | null;
  model: string | null;
  ts: string;
  created_at: string;
}

export class MessageTokensRepository extends BaseRepository {
  /**
   * Bulk-insert per-message token entries from a single llm.call event.
   * Each entry maps to one row in message_tokens.
   */
  async insertBatch(
    agentId: string,
    runId: string,
    ts: string,
    model: string | undefined,
    entries: MessageTokenEntry[]
  ): Promise<void> {
    if (entries.length === 0) return;

    for (const entry of entries) {
      await this.query(
        `INSERT INTO message_tokens (agent_id, run_id, msg_index, role, tokens, cost_usd, model, ts)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          agentId,
          runId,
          entry.msg_index,
          entry.role,
          entry.tokens,
          entry.cost_usd ?? null,
          model ?? null,
          ts,
        ]
      );
    }
  }

  /** Fetch all per-message token rows for an agent, ordered by msg_index. */
  async findByAgent(agentId: string, limit = 500): Promise<MessageTokenRow[]> {
    return this.query<MessageTokenRow>(
      `SELECT * FROM message_tokens WHERE agent_id = $1 ORDER BY msg_index ASC LIMIT $2`,
      [agentId, limit]
    );
  }

  /** Fetch per-message token rows for an agent filtered by role, grouped by run_id and ordered by msg_index. */
  async findByAgentAndRole(agentId: string, role: "user" | "assistant"): Promise<MessageTokenRow[]> {
    return this.query<MessageTokenRow>(
      `SELECT * FROM message_tokens WHERE agent_id = $1 AND role = $2 ORDER BY run_id, msg_index ASC`,
      [agentId, role]
    );
  }

  /** Delete all token rows for a specific agent. */
  async deleteByAgent(agentId: string): Promise<void> {
    await this.query(`DELETE FROM message_tokens WHERE agent_id = $1`, [agentId]);
  }

  /** Delete all rows — used when the user resets the dashboard. */
  async deleteAll(): Promise<void> {
    await this.query(`DELETE FROM message_tokens`, []);
  }
}
