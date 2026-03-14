import { memo, useState, useEffect } from "react";
import type { AgentSnapshot } from "@marionette/shared";
import { Card, CardContent } from "../../../../components/ui/card";
import { Check } from "lucide-react";
import { formatTime, formatDuration, cn } from "../../../../lib/utils";
import { useAgentDisplay } from "../../hooks/useAgentDisplay";
import { useNow } from "../../../../hooks/use-live-timer";
import { useAgentsStore } from "../../stores/agents.store";
import { AgentCardHeader } from "./AgentCardHeader";
import { AgentCardStats } from "./AgentCardStats";
import { AgentCardErrorList } from "./AgentCardErrorList";
import { AgentCardSubAgents } from "./AgentCardSubAgents";

interface AgentCardProps {
  /** Agent data snapshot */
  agent: AgentSnapshot;
  /** Callback when card is clicked */
  onClick?: () => void;
}

/**
 * AgentCard - Displays agent summary with status, stats, and current task
 * Uses new design system with elevation, status colors, and refined spacing
 * @example
 * <AgentCard agent={agentData} onClick={() => openDetail(agentData.agent_id)} />
 */
export const AgentCard = memo(function AgentCard({ agent, onClick }: AgentCardProps) {
  const { statusConfig, isDisconnected } = useAgentDisplay(agent);
  const now = useNow();
  const [errorsOpen, setErrorsOpen] = useState(false);
  const { compareSet, toggleCompare } = useAgentsStore();
  const isCompared = compareSet.includes(agent.agent_id);

  // Reset expanded errors panel when the card switches to a different agent
  useEffect(() => {
    setErrorsOpen(false);
  }, [agent.agent_id]);

  return (
    <Card
      elevation="medium"
      interactive
      onClick={onClick}
      className={cn(
        "relative group min-w-[300px] border-l-4 transition-all",
        statusConfig.border,
        statusConfig.bg,
        agent.status === "working" && "border-l-glow-working",
        isDisconnected && "opacity-60 grayscale transition-[opacity,filter] duration-500"
      )}
    >
      {/* Compare checkbox — visible on hover or when selected */}
      <div
        className={cn(
          "absolute top-2 right-2 transition-opacity z-10",
          isCompared ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
        onClick={(e) => {
          e.stopPropagation();
          toggleCompare(agent.agent_id);
        }}
      >
        <div
          className={cn(
            "h-4 w-4 rounded border flex items-center justify-center cursor-pointer",
            isCompared
              ? "bg-primary border-primary"
              : "bg-background border-border hover:border-primary"
          )}
        >
          {isCompared && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
        </div>
      </div>

      <AgentCardHeader agent={agent} now={now} />

      <CardContent className="space-y-4">
        {/* Current Task */}
        {agent.current_task && (
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-label text-muted-foreground mb-1.5 flex items-center justify-between">
              <span>Current Task</span>
              {agent.status === "working" && agent.status_since && (
                <span className="text-xs tabular-nums">
                  {formatDuration(now - new Date(agent.status_since).getTime())}
                </span>
              )}
            </p>
            <p className="text-sm leading-tight line-clamp-2">
              {agent.current_task}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <AgentCardStats
          agent={agent}
          now={now}
          errorsOpen={errorsOpen}
          onToggleErrors={() => setErrorsOpen((o) => !o)}
        />

        {/* Expandable error list */}
        {errorsOpen && agent.session_errors > 0 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="space-y-1 min-h-[52px]"
          >
            <AgentCardErrorList agentId={agent.agent_id} />
          </div>
        )}

        {/* Sub-agents */}
        <AgentCardSubAgents parentId={agent.agent_id} />

        {/* Last Activity */}
        <p className="text-xs text-muted-foreground">
          Last: {formatTime(agent.last_activity)}
        </p>
      </CardContent>
    </Card>
  );
});
