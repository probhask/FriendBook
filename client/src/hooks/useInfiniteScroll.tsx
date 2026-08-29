import { useCallback, useRef } from "react";

type Props = {
  callback: () => void;
  isLoading: boolean;
  hasMore: boolean;
};

/**
 * Returns a callback ref. Attach it to the LAST item of a list; when that item
 * scrolls into view `callback()` fires. Being a callback ref, it re-observes
 * whatever element is currently last, so paging keeps working as items append.
 * React calls it with `null` on unmount, which disconnects the observer.
 */
function useInfiniteScroll<T extends HTMLElement = HTMLElement>({
  callback,
  hasMore,
  isLoading,
}: Props) {
  const observer = useRef<IntersectionObserver | null>(null);

  // Latest values without re-creating the ref callback.
  const state = useRef({ callback, isLoading, hasMore });
  state.current = { callback, isLoading, hasMore };

  return useCallback((node: T | null) => {
    observer.current?.disconnect();
    if (!node) return;
    observer.current = new IntersectionObserver(
      (entries) => {
        const { callback: cb, isLoading: loading, hasMore: more } =
          state.current;
        if (entries[0].isIntersecting && !loading && more) cb();
      },
      { rootMargin: "200px" }
    );
    observer.current.observe(node);
  }, []);
}

export default useInfiniteScroll;
