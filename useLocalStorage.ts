import { useState, useEffect } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // 1. Use useState to hold the state, initializing it from localStorage or the initial value.
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  // 2. Use useEffect to update localStorage whenever the state value changes.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
      }
    }
  }, [key, value]); // This effect runs only when the key or value changes.

  return [value, setValue];
}

export default useLocalStorage;
