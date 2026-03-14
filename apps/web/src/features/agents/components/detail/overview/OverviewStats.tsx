import type { AgentSnapshot } from "@marionette/shared";
import { TrendingUp, Activity, Zap, XCircle } from "lucide-react";
import { FancyStatCard } from "../../../../../components/ui/fancy-stat-card";
import { formatTokens } from "../../../../../lib/utils";

interface OverviewStatsProps {
  agent: AgentSnapshot;
}

export function OverviewStats({ agent }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <FancyStatCard
        icon={TrendingUp}
        label="Runs"
        value={agent.session_runs}
        gradient="from-indigo-400 to-purple-600"
        className="p-4"
      />
      <FancyStatCard
        icon={Activity}
        label="Tasks"
        value={agent.total_tasks}
        gradient="from-cyan-400 to-blue-500"
        className="p-4"
      />
      <FancyStatCard
        icon={Zap}
        label="Tokens"
        value={formatTokens(agent.session_tokens)}
        gradient="from-amber-400 to-orange-500"
        className="p-4"
      />
      <FancyStatCard
        icon={XCircle}
        label="Errors"
        value={agent.session_errors}
        gradient="from-rose-400 to-red-500"
        className="p-4"
      />
    </div>
  );
}
