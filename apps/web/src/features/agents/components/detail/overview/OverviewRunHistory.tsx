import { TrendingUp } from "lucide-react";
import { GlassCard } from "../../../../../components/ui/glass-card";
import { formatTime, formatTokens, formatDuration } from "../../../../../lib/utils";
import type { RunHistoryItem } from "../../../hooks/useAgentRuns";

interface OverviewRunHistoryProps {
  runs: RunHistoryItem[];
}

export function OverviewRunHistory({ runs }: OverviewRunHistoryProps) {
  if (runs.length === 0) return null;

  return (
    <GlassCard className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-semibold">Run History</h3>
      </div>
      <div className="space-y-1.5">
        {runs.slice(0, 10).map((run) => (
          <div key={run.run_id} className="flex items-center gap-2 text-xs py-1 border-b border-border/40 last:border-0">
            <span className="text-muted-foreground/60">▶</span>
            <span className="flex-1 truncate max-w-[140px]" title={run.current_task ?? run.run_id}>
              {(run.current_task ?? run.run_id.slice(0, 8)).slice(0, 40)}
            </span>
            <span className="text-muted-foreground tabular-nums shrink-0">{formatTime(run.started_at)}</span>
            <span className="text-muted-foreground/60">·</span>
            <span className="tabular-nums shrink-0">{formatTokens(run.total_tokens)}</span>
            {run.ended_at && run.duration_ms != null && (
              <>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-muted-foreground tabular-nums shrink-0">{formatDuration(run.duration_ms)}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
