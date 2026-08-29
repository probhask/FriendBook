import { useCallbackRef } from "./useCallbackRef";
import { useEffect } from "react";

type Options = {
  callback: () => void;
  hasMore: boolean;
  isLoading: boolean;
  /** px from the bottom of the page at which to trigger the next load */
  offset?: number;
};

/**
 * Vertical infinite scroll driven by the window scroll position (not
 * IntersectionObserver, which is unreliable in headless / zero-viewport
 * environments). Fires `callback` when the viewer nears the bottom of the page,
 * and re-checks whenever a load finishes so it keeps filling a tall screen.
 */
export default function useWindowInfiniteScroll({
  callback,
  hasMore,
  isLoading,
  offset = 600,
}: Options) {
  const check = useCallbackRef(() => {
    if (!hasMore || isLoading) return;
    const scrolled = window.scrollY + window.innerHeight;
    const full = document.documentElement.scrollHeight;
    if (scrolled >= full - offset) callback();
  });

  useEffect(() => {
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [check]);

  // After each load settles, see if we're still near the bottom.
  useEffect(() => {
    if (!isLoading) {
      const id = window.setTimeout(check, 0);
      return () => window.clearTimeout(id);
    }
  }, [isLoading, check]);
}
