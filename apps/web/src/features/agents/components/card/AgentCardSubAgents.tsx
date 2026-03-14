import { useState } from "react";
import { ChevronUp, ChevronDown, GitBranch } from "lucide-react";
import { useAgentsStore } from "../../stores/agents.store";
import { useShallow } from "zustand/react/shallow";
import { formatTokens, formatDuration, cn, getStatusDotClass } from "../../../../lib/utils";

/** Collapsed sub-agents section shown inside a parent AgentCard */
export function AgentCardSubAgents({ parentId }: { parentId: string }) {
  const [open, setOpen] = useState(false);
  const children = useAgentsStore(useShallow((s) => s.agents.filter(a => a.parent_agent_id === parentId)));

  if (children.length === 0) return null;

  const totalChildTokens = children.reduce((sum, c) => sum + (c.session_tokens ?? 0), 0);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="border-t border-border pt-3"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        <GitBranch className="h-3 w-3" />
        <span>{children.length} sub-agent{children.length !== 1 ? "s" : ""}</span>
        <span className="text-muted-foreground/60">·</span>
        <span className="text-amber-500">{formatTokens(totalChildTokens)}</span>
      </button>

      {open && (
        <ul className="mt-2 space-y-1.5">
          {children.map((child) => (
            <li
              key={child.agent_id}
              className="flex items-center gap-2 rounded-md bg-muted/40 px-2 py-1.5 text-xs"
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full flex-shrink-0",
                  getStatusDotClass(child.status)
                )}
              />
              <span className="flex-1 truncate text-muted-foreground">
                {child.current_task ?? child.agent_name ?? "sub-agent"}
              </span>
              <span className="flex-shrink-0 text-amber-500/80 tabular-nums">
                {formatTokens(child.session_tokens)}
              </span>
              {child.total_duration_ms > 0 && (
                <span className="flex-shrink-0 text-muted-foreground/60 tabular-nums">
                  {formatDuration(child.total_duration_ms)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
