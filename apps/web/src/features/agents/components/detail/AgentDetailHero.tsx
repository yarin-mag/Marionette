import type { AgentSnapshot } from "@marionette/shared";
import { Zap, TrendingUp } from "lucide-react";
import { FancyHeroSection } from "../../../../components/ui/fancy-hero-section";
import { formatTokens, formatDuration } from "../../../../lib/utils";

interface AgentDetailHeroProps {
  agent: AgentSnapshot;
  statusLabel: string;
}

export function AgentDetailHero({ agent, statusLabel }: AgentDetailHeroProps) {
  return (
    <FancyHeroSection
      title={`Status: ${statusLabel}`}
      status={agent.status}
      duration={
        agent.status_since
          ? `for ${formatDuration(Date.now() - new Date(agent.status_since).getTime())}`
          : (agent.total_duration_ms > 0 ? formatDuration(agent.total_duration_ms) : undefined)
      }
      stats={[
        { icon: TrendingUp, label: "Runs", value: agent.session_runs, color: "bg-indigo-500/10" },
        { icon: Zap, label: "Tokens", value: formatTokens(agent.session_tokens), color: "bg-purple-500/10" },
      ]}
      className="p-6"
    />
  );
}
