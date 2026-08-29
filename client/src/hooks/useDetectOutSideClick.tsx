import React, { useEffect, useRef } from "react";

/**
 * Calls `callback` when a click/tap lands outside the returned ref's element.
 * Ignores events during the same tick it mounts, so the very click that opened
 * the popover doesn't immediately close it.
 */
const useDetectOutSideClick = <T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> => {
  const outsideRef = useRef<T>(null);
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    let armed = false;
    const arm = () => {
      armed = true;
    };
    const timer = window.setTimeout(arm, 0);

    const checkClick = (e: MouseEvent | TouchEvent) => {
      if (
        armed &&
        outsideRef.current &&
        !outsideRef.current.contains(e.target as Node)
      ) {
        cbRef.current();
      }
    };

    window.addEventListener("mousedown", checkClick, true);
    window.addEventListener("touchstart", checkClick, true);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousedown", checkClick, true);
      window.removeEventListener("touchstart", checkClick, true);
    };
  }, []);

  return outsideRef;
};

export default useDetectOutSideClick;
