import React, { useEffect, useRef } from "react";

/* detect click outside the box */
const useDetectOutSideClick = <T extends HTMLElement>(
  callback: () => void
): React.RefObject<T> => {
  const outsideRef = useRef<T>(null);

  useEffect(() => {
    const checkClick = (e: MouseEvent | TouchEvent) => {
      if (
        outsideRef.current &&
        !outsideRef.current.contains(e.target as Node)
      ) {
        callback();
      }
    };

    window.addEventListener("mouseup", checkClick, true);
    window.addEventListener("touchend", checkClick, true);

    return () => {
      window.removeEventListener("click", checkClick, true);
      window.removeEventListener("touchend", checkClick, true);
    };
  }, [callback]);

  return outsideRef;
};

export default useDetectOutSideClick;
