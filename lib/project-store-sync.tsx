import { useEffect } from "react";
import { useProjectStore } from "./project-store";

export function ProjectStoreSync() {
  const state = useProjectStore((state) => state); // entire state

  useEffect(() => {
    console.log("Store updated:", state);
  }, [state]);

  return null;
}
