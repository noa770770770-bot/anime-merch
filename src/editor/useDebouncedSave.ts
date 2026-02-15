import { useEffect, useRef } from 'react';

export function useDebouncedSave(model: any, pageId: string, enabled: boolean) {
  const timer = useRef<any>(null);
  useEffect(() => {
    if (!enabled || !pageId || !model) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fetch(`/api/pages/${pageId}/draft`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model }),
      });
    }, 400);
    return () => clearTimeout(timer.current);
  }, [model, pageId, enabled]);
}
