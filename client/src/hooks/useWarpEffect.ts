import { useState, useCallback } from "react";

export function useWarpEffect(initialWarpState = false) {
  const [isWarping, setIsWarping] = useState(initialWarpState);

  const triggerWarp = useCallback((onMidpoint?: () => void, duration = 2400) => {
    setIsWarping(true);

    if (onMidpoint) {
      setTimeout(() => {
        onMidpoint();
      }, duration / 2);
    }

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
