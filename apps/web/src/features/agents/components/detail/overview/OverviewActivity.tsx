import type { AgentSnapshot } from "@marionette/shared";
import { Clock } from "lucide-react";
import { GlassCard } from "../../../../../components/ui/glass-card";
import { CardDescription } from "../../../../../components/ui/card";
import { formatTime, formatDuration, formatBurnRate } from "../../../../../lib/utils";

interface OverviewActivityProps {
  agent: AgentSnapshot;
  now: number;
}

export function OverviewActivity({ agent, now }: OverviewActivityProps) {
  return (
    <GlassCard className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
          <Clock className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-semibold">Activity</h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <CardDescription className="text-xs">Session Started</CardDescription>
          <span className="text-xs">{formatTime(agent.session_start)}</span>
        </div>
        <div className="flex justify-between gap-2">
          <CardDescription className="text-xs">Last Activity</CardDescription>
          <span className="text-xs">{formatTime(agent.last_activity)}</span>
        </div>
        {agent.total_duration_ms > 0 && (
          <div className="flex justify-between gap-2">
            <CardDescription className="text-xs">Total Duration</CardDescription>
            <span className="text-xs">{formatDuration(agent.total_duration_ms)}</span>
          </div>
        )}
        {agent.status === "working" && agent.session_start && (() => {
          const burnRate = formatBurnRate(
            agent.session_tokens,
            now - new Date(agent.session_start).getTime()
          );
          return burnRate ? (
            <div className="flex justify-between gap-2">
              <CardDescription className="text-xs">Burn Rate</CardDescription>
              <span className="text-xs text-amber-500 tabular-nums">{burnRate}</span>
            </div>
          ) : null;
        })()}
      </div>
    </GlassCard>
  );
}
