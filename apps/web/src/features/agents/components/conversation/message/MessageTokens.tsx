import { useState } from 'react';
import { Info } from 'lucide-react';
import type { TokenUsage } from '@marionette/shared';
import { cn, formatTokens } from '../../../../../lib/utils';
import { SYSTEM_HINT_THRESHOLD, TOOLTIP_COPY } from './constants';

type TooltipKey = 'input' | 'output' | 'hint' | null;

interface MessageTokensProps {
  tokens: TokenUsage;
  isUser: boolean;
}

export function MessageTokens({ tokens, isUser }: MessageTokensProps) {
  const [tooltip, setTooltip] = useState<TooltipKey>(null);

  const inputTokens = tokens.input_tokens ?? 0;
  const outputTokens = tokens.output_tokens ?? 0;
  const showSystemHint = isUser && inputTokens > SYSTEM_HINT_THRESHOLD;

  return (
    <div className={cn(
      'text-xs mt-1 flex items-center gap-1.5 flex-wrap',
      isUser ? 'opacity-70' : 'text-muted-foreground/60'
    )}>
      <TooltipSpan
        label={`↑ ${formatTokens(inputTokens)}`}
        tooltipKey="input"
        activeTooltip={tooltip}
        onEnter={setTooltip}
        onLeave={() => setTooltip(null)}
        tooltipText={TOOLTIP_COPY.input}
        tooltipAlign="left"
      />

      {showSystemHint && (
        <TooltipSpan
          tooltipKey="hint"
          activeTooltip={tooltip}
          onEnter={setTooltip}
          onLeave={() => setTooltip(null)}
          tooltipText={TOOLTIP_COPY.hint}
          tooltipAlign="right"
          tooltipWidth="w-56"
        >
          <Info className="h-3 w-3 opacity-50" />
        </TooltipSpan>
      )}

      {outputTokens > 0 && (
        <>
          <span className="opacity-40">·</span>
          <TooltipSpan
            label={`↓ ${formatTokens(outputTokens)}`}
            tooltipKey="output"
            activeTooltip={tooltip}
            onEnter={setTooltip}
            onLeave={() => setTooltip(null)}
            tooltipText={TOOLTIP_COPY.output}
            tooltipAlign="left"
          />
        </>
      )}
    </div>
  );
}

interface TooltipSpanProps {
  label?: string;
  children?: React.ReactNode;
  tooltipKey: Exclude<TooltipKey, null>;
  activeTooltip: TooltipKey;
  onEnter: (key: Exclude<TooltipKey, null>) => void;
  onLeave: () => void;
  tooltipText: string;
  tooltipAlign: 'left' | 'right';
  tooltipWidth?: string;
}

function TooltipSpan({
  label,
  children,
  tooltipKey,
  activeTooltip,
  onEnter,
  onLeave,
  tooltipText,
  tooltipAlign,
  tooltipWidth = 'w-48',
}: TooltipSpanProps) {
  return (
    <span
      className="relative cursor-help"
      onMouseEnter={() => onEnter(tooltipKey)}
      onMouseLeave={onLeave}
    >
      {label ?? children}
      {activeTooltip === tooltipKey && (
        <span
          className={cn(
            'absolute top-full mt-2 rounded-md bg-popover border border-border px-2.5 py-1.5 text-[11px] leading-snug text-popover-foreground shadow-md z-50 whitespace-normal',
            tooltipWidth,
            tooltipAlign === 'left' ? 'left-0' : 'right-0'
          )}
        >
          {tooltipText}
        </span>
      )}
    </span>
  );
}
