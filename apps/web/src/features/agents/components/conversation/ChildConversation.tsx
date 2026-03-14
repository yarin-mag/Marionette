import { useState } from 'react';
import { Loader2, GitBranch, ChevronDown, ChevronUp } from 'lucide-react';
import { useAgentConversation } from '../../hooks/useAgentConversation';
import { ConversationMessage } from './ConversationMessage';
import { formatTokens, cn, getStatusDotClass } from '../../../../lib/utils';

export function ChildConversation({ child }: { child: import('@marionette/shared').AgentSnapshot }) {
  const [open, setOpen] = useState(false);
  const { turns, totals, isLoading } = useAgentConversation(child.agent_id);
  const label = child.current_task ?? child.agent_name ?? 'sub-agent';
  const childTokens = totals ? totals.input_tokens + totals.output_tokens : (child.session_tokens ?? 0);

  return (
    <div className="border border-border/60 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs bg-muted/40 hover:bg-muted/70 transition-colors text-left"
      >
        <GitBranch className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        <span className={cn(
          'h-1.5 w-1.5 rounded-full flex-shrink-0',
          getStatusDotClass(child.status)
        )} />
        <span className="flex-1 truncate font-medium" title={label}>{label}</span>
        <span className="text-amber-500 tabular-nums flex-shrink-0">{formatTokens(childTokens)}</span>
        {open ? <ChevronUp className="h-3 w-3 flex-shrink-0" /> : <ChevronDown className="h-3 w-3 flex-shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-border/40 pl-4 bg-background">
          {isLoading ? (
            <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading...
            </div>
          ) : turns.length === 0 ? (
            <p className="p-3 text-xs text-muted-foreground">No messages.</p>
          ) : (
            <div className="space-y-3 py-3 pr-4">
              {turns.map((turn) => (
                <ConversationMessage key={turn.id} turn={turn} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
