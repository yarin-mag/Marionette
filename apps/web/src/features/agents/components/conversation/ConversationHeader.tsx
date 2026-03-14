import type { ConversationTotals } from '../../hooks/useAgentConversation';
import { formatTokens } from '../../../../lib/utils';

interface ConversationHeaderProps {
  turnCount: number;
  totals: ConversationTotals | null;
}

export function ConversationHeader({ turnCount, totals }: ConversationHeaderProps) {
  const hasTotals = totals && (totals.input_tokens > 0 || totals.output_tokens > 0);

  return (
    <div className="p-4 border-b bg-card">
      <h2 className="text-lg font-semibold">Conversation</h2>
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">
          {turnCount} {turnCount === 1 ? 'message' : 'messages'}
        </p>
        {hasTotals && (
          <>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              ↑ {formatTokens(totals.input_tokens)} · ↓ {formatTokens(totals.output_tokens)}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
