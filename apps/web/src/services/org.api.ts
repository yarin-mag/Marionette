import { useAuth } from "@clerk/clerk-react";
import { API_URL } from "../lib/constants";

export interface OrgUser {
  id: string;
  email: string;
  name: string | null;
  org_id: string | null;
  role: "admin" | "developer" | null;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  created_at: string;
}

export interface MemberMetrics {
  user_id: string;
  email: string;
  name: string | null;
  total_tokens: number;
  total_cost: number;
  last_active: string | null;
}

export type MetricsPeriod = "day" | "week" | "month";

/**
 * Returns a fetch wrapper that automatically attaches the Clerk session token.
 * Must be called inside a React component or hook (uses useAuth).
 */
export function useOrgApi() {
  const { getToken } = useAuth();

  async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
    const token = await getToken();
    return fetch(`${API_URL}/api${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  }

  async function getMe(): Promise<{ user: OrgUser; org: Organization | null }> {
    const res = await authFetch("/org/me");
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function createOrg(name: string): Promise<{ org: Organization; role: string }> {
    const res = await authFetch("/org", { method: "POST", body: JSON.stringify({ name }) });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function getTeamMetrics(period: MetricsPeriod = "week"): Promise<{ members: MemberMetrics[]; period: MetricsPeriod }> {
    const res = await authFetch(`/org/metrics?period=${period}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function getMembers(): Promise<OrgUser[]> {
    const res = await authFetch("/org/members");
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function generateApiKey(label?: string): Promise<{ key: object; rawKey: string }> {
    const res = await authFetch("/org/keys", { method: "POST", body: JSON.stringify({ label }) });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function revokeApiKey(keyId: string): Promise<void> {
    const res = await authFetch(`/org/keys/${keyId}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
  }

  return { getMe, createOrg, getTeamMetrics, getMembers, generateApiKey, revokeApiKey };
}
