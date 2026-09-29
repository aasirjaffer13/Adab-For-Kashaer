import { useRef, useCallback } from "react";

export type UndoAction<TItem = unknown> =
  | { type: "add"; itemId: string }
  | { type: "delete"; item: TItem }
  | { type: "update"; itemId: string; prev: Record<string, unknown> };

const MAX_HISTORY = 50;

export function useUndoStack<TItem = unknown>() {
  const stackRef = useRef<UndoAction<TItem>[]>([]);

  const push = useCallback((action: UndoAction<TItem>) => {
    stackRef.current.push(action);
    if (stackRef.current.length > MAX_HISTORY) {
      stackRef.current.shift();
    }
  }, []);

  const pop = useCallback((): UndoAction<TItem> | undefined => {
    return stackRef.current.pop();
  }, []);

  return { push, pop };
}
