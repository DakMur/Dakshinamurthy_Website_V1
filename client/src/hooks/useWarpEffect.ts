import { useState, useCallback } from "react";

export function useWarpEffect(initialWarpState = false) {
  const [isWarping, setIsWarping] = useState(initialWarpState);

  const triggerWarp = useCallback((duration = 1000) => {
    setIsWarping(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsWarping(false);
        resolve();
      }, duration);
    });
  }, []);

  return {
    isWarping,
    triggerWarp,
  };
}
