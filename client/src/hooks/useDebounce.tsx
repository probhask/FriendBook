import { useEffect, useRef } from "react";

type Props<T> = {
  callback: (...args: []) => T;
  delay: number;
};

const useDebounce = <T,>({ callback, delay }: Props<T>) => {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear the timeout if the component is unmounted or if the delay changes
    timeoutRef.current = window.setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  // Debounced function
  function debouncedFunction() {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      callback();
    }, delay);
  }

  return debouncedFunction;
};

export default useDebounce;
