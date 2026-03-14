import type { AgentStatus } from "@marionette/shared";
import { Activity } from "lucide-react";
import { GlassCard } from "../../../../../components/ui/glass-card";
import { GradientBorder } from "../../../../../components/ui/gradient-border";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { formatDuration } from "../../../../../lib/utils";
import { useNow } from "../../../../../hooks/use-live-timer";

interface OverviewCurrentTaskProps {
  task: string | undefined;
  status: AgentStatus;
  statusSince: string | undefined;
}

export function OverviewCurrentTask({ task, status, statusSince }: OverviewCurrentTaskProps) {
  const now = useNow();

  return (
    <GradientBorder gradient="from-indigo-500 to-purple-600" glow>
      <GlassCard className="border-0 p-4">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-base flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Current Task
            </div>
            {status === "working" && statusSince && (
              <span className="text-xs tabular-nums font-normal text-muted-foreground">
                {formatDuration(now - new Date(statusSince).getTime())}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm">
            {task || <span className="text-muted-foreground">None</span>}
          </p>
        </CardContent>
      </GlassCard>
    </GradientBorder>
  );
}
