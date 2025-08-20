import { useEffect } from "react";

export function useLocalStorageListener(callback: (key: string, value: string | null) => void) {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea === localStorage) {
        callback(event.key || "", event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [callback]);
}
