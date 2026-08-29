import { useCallback, useRef } from "react";

/**
 * Returns a stable function whose identity never changes but which always calls
 * the latest `fn` passed in. Handy for event listeners that shouldn't be
 * re-bound on every render but still need fresh closures.
 */
export function useCallbackRef<A extends unknown[], R>(
  fn: (...args: A) => R
): (...args: A) => R {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args: A) => ref.current(...args), []);
}
