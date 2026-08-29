import { useCallback, useRef } from "react";

type Props = {
  callback: () => void;
  isLoading: boolean;
  hasMore: boolean;
};

/**
 * Returns a callback ref for the LAST item of a list. When that item is in view
 * `callback()` fires to load the next page.
 *
 * The ref identity changes whenever `isLoading` / `hasMore` change, so React
 * re-runs it: it disconnects the old observer and observes the (still last)
 * node again. `observe()` immediately reports the current intersection state,
 * so a page that was already scrolled to the bottom keeps loading once the
 * previous fetch settles — an IntersectionObserver alone only fires on
 * transitions and would stall.
 */
function useInfiniteScroll<T extends HTMLElement = HTMLElement>({
  callback,
  hasMore,
  isLoading,
}: Props) {
  const observer = useRef<IntersectionObserver | null>(null);
  const cbRef = useRef(callback);
  cbRef.current = callback;

  return useCallback(
    (node: T | null) => {
      observer.current?.disconnect();
      if (!node || isLoading || !hasMore) return;
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) cbRef.current();
        },
        { rootMargin: "300px" }
      );
      observer.current.observe(node);
    },
    [isLoading, hasMore]
  );
}

export default useInfiniteScroll;
