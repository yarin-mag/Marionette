import type { AgentSnapshot } from "@marionette/shared";
import { X, Activity, MessagesSquare, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../components/ui/tabs";
import { DeepInspectionPanel } from "../DeepInspectionPanel";
import { AgentConversationPanel } from "../conversation/AgentConversationPanel";
import { useAgentDisplay } from "../../hooks/useAgentDisplay";
import { AgentDetailHeader } from "./AgentDetailHeader";
import { AgentDetailHero } from "./AgentDetailHero";
import { AgentOverviewTab } from "./AgentOverviewTab";

type TabValue = 'overview' | 'conversation' | 'inspect';

interface AgentDetailPanelProps {
  agent: AgentSnapshot;
  onClose: () => void;
  hideCloseButton?: boolean;
}

export function AgentDetailPanel({ agent, onClose, hideCloseButton }: AgentDetailPanelProps) {
  const { statusConfig } = useAgentDisplay(agent);
  const [activeTab, setActiveTab] = useState<TabValue>('overview');

  return (
    <div className="space-y-4 w-full overflow-x-hidden min-w-0">
      {!hideCloseButton && (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AgentDetailHeader agent={agent} />
      <AgentDetailHero agent={agent} statusLabel={statusConfig.label} />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="conversation" className="flex items-center gap-2">
            <MessagesSquare className="h-4 w-4" />
            Conversation
          </TabsTrigger>
          <TabsTrigger value="inspect" className="flex items-center gap-2" disabled aria-label="Inspect (coming soon)">
            <Search className="h-4 w-4" />
            Inspect
            <span className="text-[10px] text-muted-foreground/60 font-normal leading-none">soon</span>
          </TabsTrigger>
        </TabsList>

        {/* forceMount keeps all tabs in the DOM — scroll position is preserved when switching */}
        <TabsContent forceMount value="overview" className="data-[state=inactive]:hidden">
          <AgentOverviewTab agent={agent} />
        </TabsContent>

        <TabsContent forceMount value="conversation" className="data-[state=inactive]:hidden">
          <AgentConversationPanel agentId={agent.agent_id} />
        </TabsContent>

        <TabsContent forceMount value="inspect" className="data-[state=inactive]:hidden">
          <DeepInspectionPanel agentId={agent.agent_id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
