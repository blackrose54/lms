import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay?: number): T {
  const [debounceValue, setdebounceValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setdebounceValue(value);

    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [delay, value]);

  return debounceValue;
}
