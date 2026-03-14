import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../../../../../lib/utils';
import { useMessageOverflow } from './hooks/useMessageOverflow';
import { COLLAPSED_MAX_HEIGHT } from './constants';

interface MessageContentProps {
  content: string;
  isUser: boolean;
}

export function MessageContent({ content, isUser }: MessageContentProps) {
  const { contentRef, isExpanded, isOverflowing, toggleExpanded } = useMessageOverflow(content);

  return (
    <div>
      <div className="relative">
        <div
          ref={contentRef}
          style={!isExpanded ? { maxHeight: COLLAPSED_MAX_HEIGHT, overflow: 'hidden' } : undefined}
        >
          <div className={cn('prose prose-sm max-w-none', isUser ? 'prose-invert' : 'dark:prose-invert')}>
            <ReactMarkdown components={markdownComponents(isUser)}>
              {content}
            </ReactMarkdown>
          </div>
        </div>

        {isOverflowing && !isExpanded && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 h-12 pointer-events-none',
              isUser
                ? 'bg-gradient-to-t from-primary to-transparent'
                : 'bg-gradient-to-t from-card to-transparent'
            )}
          />
        )}
      </div>

      {isOverflowing && (
        <button
          onClick={toggleExpanded}
          className={cn(
            'text-xs font-medium mt-2 underline-offset-2 hover:underline focus:outline-none',
            isUser ? 'opacity-80 hover:opacity-100' : 'text-primary'
          )}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

function markdownComponents(isUser: boolean): React.ComponentProps<typeof ReactMarkdown>['components'] {
  return {
    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      return language ? (
        <SyntaxHighlighter
          style={vscDarkPlus as any}
          language={language}
          PreTag="div"
          className="rounded-md text-sm"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={cn('px-1.5 py-0.5 rounded text-sm font-mono', isUser ? 'bg-primary-foreground/20' : 'bg-muted')}>
          {children}
        </code>
      );
    },
    pre({ children }) {
      return <div className="my-2">{children}</div>;
    },
    p({ children }) {
      return <p className="mb-2 last:mb-0">{children}</p>;
    },
    ul({ children }) {
      return <ul className="list-disc pl-4 mb-2">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-4 mb-2">{children}</ol>;
    },
    li({ children }) {
      return <li className="mb-1">{children}</li>;
    },
  };
}
