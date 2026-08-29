import React, { useCallback, useEffect, useRef } from "react";

type Props = {
  callback: () => void;
  isLoading: boolean;
  hasMore: boolean;
};

function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>({
  callback,
  hasMore,
  isLoading,
}: Props): React.RefObject<T> {
  const itemRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Keep the latest callback / flags without re-creating the observer.
  const callbackRef = useRef(callback);
  const stateRef = useRef({ isLoading, hasMore });
  callbackRef.current = callback;
  stateRef.current = { isLoading, hasMore };

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const { isLoading: loading, hasMore: more } = stateRef.current;
      if (entries[0].isIntersecting && !loading && more) {
        callbackRef.current();
      }
    },
    []
  );

  useEffect(() => {
    const node = itemRef.current;
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
    if (node) observerRef.current.observe(node);
    return () => observerRef.current?.disconnect();
  }, [handleIntersect]);

  return itemRef;
}

export default useInfiniteScroll;
