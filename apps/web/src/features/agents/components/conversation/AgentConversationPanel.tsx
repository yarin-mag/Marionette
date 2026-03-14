import { useEffect, useRef, memo } from 'react';
import { Loader2, AlertCircle, GitBranch } from 'lucide-react';
import { useAgentConversation } from '../../hooks/useAgentConversation';
import { useAgentsStore } from '../../stores/agents.store';
import { useShallow } from 'zustand/react/shallow';
import { ConversationHeader } from './ConversationHeader';
import { ChildConversation } from './ChildConversation';
import { ConversationMessage } from './ConversationMessage';

interface AgentConversationPanelProps {
  agentId: string;
}

export const AgentConversationPanel = memo(function AgentConversationPanel({ agentId }: AgentConversationPanelProps) {
  const { turns, totals, isLoading, error } = useAgentConversation(agentId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const children = useAgentsStore(useShallow((s) => s.agents.filter(a => a.parent_agent_id === agentId)));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-border overflow-hidden min-w-0 w-full">
      {/* Header */}
      <ConversationHeader turnCount={turns.length} totals={totals} />

      {/* Error banner */}
      {error && (
        <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/20 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Messages */}
      <div className="max-h-[55vh] overflow-y-auto overflow-x-hidden p-4 space-y-4 bg-background min-w-0">
        {turns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground">No conversation recorded yet.</p>
          </div>
        ) : (
          <>
            {turns.map((turn) => (
              <ConversationMessage key={turn.id} turn={turn} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      {/* Sub-agent conversations */}
      {children.length > 0 && (
        <div className="p-4 border-t bg-muted/20 space-y-2">
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <GitBranch className="h-3 w-3" />
            Sub-agents ({children.length})
          </p>
          {children.map((child) => (
            <ChildConversation key={child.agent_id} child={child} />
          ))}
        </div>
      )}
    </div>
  );
});