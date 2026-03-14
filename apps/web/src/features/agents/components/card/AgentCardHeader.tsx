import type { AgentSnapshot } from "@marionette/shared";
import { FolderOpen, Terminal } from "lucide-react";
import { CardHeader } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { EditableText } from "../../../../components/ui/editable-text";
import { formatDuration } from "../../../../lib/utils";
import { useAgentDisplay } from "../../hooks/useAgentDisplay";
import { useAgentUpdate } from "../../hooks/useAgentUpdate";

interface AgentCardHeaderProps {
  agent: AgentSnapshot;
  now: number;
}

export function AgentCardHeader({ agent, now }: AgentCardHeaderProps) {
  const { displayName, hasCustomName, statusConfig } = useAgentDisplay(agent);
  const { mutate: updateName } = useAgentUpdate(agent.agent_id);

  return (
    <CardHeader className="pb-4">
      <div className="flex items-start gap-3">
        {/* Icon with background */}
        <div className="flex-shrink-0 p-2.5 rounded-lg bg-primary/10 border border-primary/20">
          <FolderOpen className="h-5 w-5 text-primary" />
        </div>

        {/* Name and metadata */}
        <div className="flex-1 min-w-0 space-y-2">
          <div
            className="flex items-center gap-2 flex-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            <EditableText
              value={displayName}
              onSave={updateName}
              className="font-semibold text-base truncate"
            />
            {hasCustomName && (
              <Badge variant="primary" size="sm">
                Custom
              </Badge>
            )}
          </div>

          {/* Status badge with optional dot for working status */}
          <div className="flex items-center gap-2">
            <Badge
              variant={statusConfig.badge}
              size="sm"
              showDot={agent.status === "working"}
            >
              {statusConfig.label}
            </Badge>
            {agent.status_since && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatDuration(now - new Date(agent.status_since).getTime())}
              </span>
            )}
          </div>

          {/* Terminal + CWD info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3 w-3 flex-shrink-0" />
              <span>{agent.terminal ?? "unknown"}</span>
            </div>
            {agent.cwd && (
              <div
                className="flex items-center gap-1.5 min-w-0"
                title={agent.cwd}
              >
                <FolderOpen className="h-3 w-3 flex-shrink-0" />
                <span className="truncate max-w-[120px]">
                  {agent.cwd.split(/[/\\]/).filter(Boolean).pop() ?? agent.cwd}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardHeader>
  );
}
