import type { AgentSnapshot } from "@marionette/shared";
import { FolderOpen, Terminal } from "lucide-react";
import { GlassCard } from "../../../../../components/ui/glass-card";
import {
  CardDescription,
} from "../../../../../components/ui/card";

interface OverviewEnvironmentProps {
  agent: AgentSnapshot;
  lastModel: string | undefined;
}

export function OverviewEnvironment({ agent, lastModel }: OverviewEnvironmentProps) {
  return (
    <GlassCard className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
          <FolderOpen className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-semibold">Environment</h3>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <CardDescription className="text-xs uppercase tracking-wide">Working Directory</CardDescription>
          <p className="font-mono text-xs mt-1 break-all">{agent.cwd || "Unknown"}</p>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div>
          <CardDescription className="text-xs uppercase tracking-wide">Terminal</CardDescription>
          <div className="flex items-center gap-2 mt-1">
            <Terminal className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs">{agent.terminal || "Unknown"}</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        {lastModel && (
          <>
            <div>
              <CardDescription className="text-xs uppercase tracking-wide">Model</CardDescription>
              <p className="font-mono text-xs mt-1 break-all">{lastModel}</p>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </>
        )}
        <div>
          <CardDescription className="text-xs uppercase tracking-wide">Agent ID</CardDescription>
          <p className="font-mono text-xs mt-1 break-all">{agent.agent_id}</p>
        </div>
      </div>
    </GlassCard>
  );
}
