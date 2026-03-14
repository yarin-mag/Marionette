import { AlertTriangle } from "lucide-react";
import { useAgentErrors } from "../../hooks/useAgentErrors";
import { formatTime } from "../../../../lib/utils";

/** Compact expandable list of recent errors for an agent */
export function AgentCardErrorList({ agentId }: { agentId: string }) {
  const { data, isLoading } = useAgentErrors(agentId, true);

  if (isLoading) {
    return <p className="text-xs text-muted-foreground px-1 py-1">Loading errors…</p>;
  }
  if (!data || data.length === 0) {
    return <p className="text-xs text-muted-foreground px-1 py-1">No error details found.</p>;
  }

  return (
    <ul className="space-y-1.5">
      {data.map((err) => (
        <li key={err.id} className="text-xs rounded-md border border-[hsl(var(--error)/30)] bg-[hsl(var(--error)/8)] px-2 py-1.5">
          <div className="flex items-start gap-1.5">
            <AlertTriangle className="h-3 w-3 text-[hsl(var(--error))] mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[hsl(var(--error))] font-medium leading-snug break-words">
                {err.summary ?? err.error ?? "Unknown error"}
              </p>
              <p className="text-muted-foreground mt-0.5">{formatTime(err.timestamp)}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
