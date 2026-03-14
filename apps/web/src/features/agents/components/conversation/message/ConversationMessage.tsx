import { memo } from 'react';
import { cn, formatTime } from '../../../../../lib/utils';
import type { EnrichedConversationTurn } from '../../../hooks/useAgentConversation';
import { MessageAvatar } from './MessageAvatar';
import { MessageContent } from './MessageContent';
import { MessageTokens } from './MessageTokens';

interface ConversationMessageProps {
  turn: EnrichedConversationTurn;
}

export const ConversationMessage = memo(function ConversationMessage({ turn }: ConversationMessageProps) {
  const isUser = turn.role === 'user';
  const isFromWeb = turn.source === 'web';
  const content = turn.content_plain || turn.content;

  return (
    <div
      className={cn(
        'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 min-w-0 w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && <MessageAvatar isUser={false} />}

      <div className="flex flex-col max-w-[75%] min-w-0 gap-1">
        {isFromWeb && (
          <div className="text-xs text-muted-foreground px-2">Sent from Web UI</div>
        )}

        <div
          className={cn(
            'rounded-lg px-4 py-3 break-words',
            isUser ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
          )}
        >
          <MessageContent content={content} isUser={isUser} />

          <div
            className={cn(
              'text-xs mt-2 pt-2 border-t',
              isUser
                ? 'opacity-70 border-primary-foreground/20'
                : 'text-muted-foreground border-border/50'
            )}
          >
            {formatTime(turn.timestamp)}
          </div>

          {turn.tokens && <MessageTokens tokens={turn.tokens} isUser={isUser} />}
        </div>
      </div>

      {isUser && <MessageAvatar isUser={true} />}
    </div>
  );
});
