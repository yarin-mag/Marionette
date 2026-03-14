import { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { COLLAPSED_MAX_HEIGHT } from '../constants';

interface UseMessageOverflowReturn {
  contentRef: React.RefObject<HTMLDivElement>;
  isExpanded: boolean;
  isOverflowing: boolean;
  toggleExpanded: () => void;
}

export function useMessageOverflow(content: string): UseMessageOverflowReturn {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > COLLAPSED_MAX_HEIGHT);
    }
  }, [content]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((v) => !v);
  }, []);

  return { contentRef, isExpanded, isOverflowing, toggleExpanded };
}
