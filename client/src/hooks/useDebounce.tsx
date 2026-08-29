import { useEffect, useRef } from "react";

type Props<T> = {
  callback: (...args: []) => T;
  delay: number;
};

const useDebounce = <T,>({ callback, delay }: Props<T>) => {
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      callbackRef.current();
    }, delay);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  function debouncedFunction() {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      callbackRef.current();
    }, delay);
  }

  return debouncedFunction;
};

export default useDebounce;
