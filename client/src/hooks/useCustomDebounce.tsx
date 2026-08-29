import { useEffect, useState } from "react";

const useCustomDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timeOut);
  }, [value, delay]);
  return debounceValue;
};

export default useCustomDebounce;
