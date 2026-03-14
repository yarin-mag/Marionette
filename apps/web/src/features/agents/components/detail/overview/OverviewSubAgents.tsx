import type { AgentSnapshot } from "@marionette/shared";
import { GitBranch } from "lucide-react";
import { GlassCard } from "../../../../../components/ui/glass-card";
import { formatTokens, formatDuration, cn, getStatusDotClass } from "../../../../../lib/utils";

interface OverviewSubAgentsProps {
  children: AgentSnapshot[];
}

export function OverviewSubAgents({ children }: OverviewSubAgentsProps) {
  if (children.length === 0) return null;

  return (
    <GlassCard className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500">
          <GitBranch className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-semibold">Sub-agents</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {children.length} · {formatTokens(children.reduce((s, c) => s + (c.session_tokens ?? 0), 0))} total
        </span>
      </div>
      <div className="space-y-1.5">
        {children.map((child) => (
          <div key={child.agent_id} className="flex items-center gap-2 text-xs py-1.5 border-b border-border/40 last:border-0">
            <span className={cn(
              "h-1.5 w-1.5 rounded-full flex-shrink-0",
              getStatusDotClass(child.status)
            )} />
            <span className="flex-1 truncate" title={child.current_task ?? child.agent_name}>
              {child.current_task ?? child.agent_name ?? "sub-agent"}
            </span>
            <span className="text-amber-500 tabular-nums shrink-0">{formatTokens(child.session_tokens)}</span>
            {child.total_duration_ms > 0 && (
              <>
                <span className="text-muted-foreground/60">·</span>
                <span className="text-muted-foreground tabular-nums shrink-0">{formatDuration(child.total_duration_ms)}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
