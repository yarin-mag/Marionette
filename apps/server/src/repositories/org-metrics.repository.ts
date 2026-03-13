import { BaseRepository } from "./base.repository.js";

export type MetricsPeriod = "day" | "week" | "month";

export interface MemberMetrics {
  user_id: string;
  email: string;
  name: string | null;
  total_tokens: number;
  total_cost: number;
  last_active: string | null;
}

const PERIOD_DAYS: Record<MetricsPeriod, number> = {
  day: 1,
  week: 7,
  month: 30,
};

function periodCutoff(period: MetricsPeriod): string {
  const d = new Date();
  d.setDate(d.getDate() - PERIOD_DAYS[period]);
  return d.toISOString();
}

export class OrgMetricsRepository extends BaseRepository {
  /**
   * Returns per-member token and cost totals for the given period.
   * All members of the org are included (zeros if no activity).
   */
  async getTeamMetrics(orgId: string, period: MetricsPeriod): Promise<MemberMetrics[]> {
    const cutoff = periodCutoff(period);

    return this.query<MemberMetrics>(
      `SELECT
         u.id                          AS user_id,
         u.email,
         u.name,
         COALESCE(SUM(mt.tokens), 0)   AS total_tokens,
         COALESCE(SUM(mt.cost_usd), 0) AS total_cost,
         MAX(mt.ts)                    AS last_active
       FROM users u
       LEFT JOIN message_tokens mt
         ON mt.user_id = u.id
         AND mt.ts >= $2
       WHERE u.org_id = $1
       GROUP BY u.id, u.email, u.name
       ORDER BY total_tokens DESC`,
      [orgId, cutoff]
    );
  }
}
