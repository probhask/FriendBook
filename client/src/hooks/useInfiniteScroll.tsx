import React, { useCallback, useEffect, useRef } from "react";

type Props = {
  callback: () => void;
  isLoading: boolean;
  hasMore: boolean;
};

const useInfiniteScroll = ({
  callback,
  hasMore,
  isLoading,
}: Props): React.RefObject<HTMLDivElement> => {
  const itemRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>();

  const handleIntersect = useCallback(
    (enteries: IntersectionObserverEntry[]) => {
      if (enteries[0].isIntersecting && !isLoading && hasMore) {
        callback();
      }
    },

    [isLoading, hasMore]
  );

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
    if (itemRef.current) {
      observerRef.current.observe(itemRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, handleIntersect]);

  return itemRef;
};

export default useInfiniteScroll;
