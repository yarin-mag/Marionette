import type { AgentSnapshot } from "@marionette/shared";
import { PlayCircle, Zap, XCircle, ChevronUp } from "lucide-react";
import { StatDisplay } from "../../../../components/ui/stat-display";
import { formatTokens, formatBurnRate } from "../../../../lib/utils";

interface AgentCardStatsProps {
  agent: AgentSnapshot;
  now: number;
  errorsOpen: boolean;
  onToggleErrors: () => void;
}

export function AgentCardStats({ agent, now, errorsOpen, onToggleErrors }: AgentCardStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 items-start">
      <StatDisplay
        label="Runs"
        value={agent.session_runs}
        icon={PlayCircle}
      />
      <div className="flex flex-col gap-0.5">
        <StatDisplay
          label="Tokens"
          value={formatTokens(agent.session_tokens)}
          icon={Zap}
          iconColor="text-amber-500"
        />
        {agent.status === "working" && agent.session_start && (() => {
          const burnRate = formatBurnRate(
            agent.session_tokens,
            now - new Date(agent.session_start).getTime()
          );
          return burnRate ? (
            <p className="text-xs text-amber-500/80 text-center tabular-nums">{burnRate}</p>
          ) : null;
        })()}
      </div>
      <div
        onClick={
          agent.session_errors > 0
            ? (e) => {
                e.stopPropagation();
                onToggleErrors();
              }
            : undefined
        }
        className={agent.session_errors > 0 ? "cursor-pointer" : undefined}
      >
        <StatDisplay
          label="Errors"
          value={agent.session_errors}
          icon={errorsOpen && agent.session_errors > 0 ? ChevronUp : XCircle}
          iconColor={agent.session_errors > 0 ? "text-[hsl(var(--error))]" : undefined}
          variant={agent.session_errors > 0 ? "error" : "default"}
        />
      </div>
    </div>
  );
}
