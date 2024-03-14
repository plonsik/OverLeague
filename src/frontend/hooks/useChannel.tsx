import { useEffect } from "react";

export const useChannel = <T = any>(channel: string, handler: (data: T) => void) => {
  useEffect(() => {
    window.electronAPI.addListener(channel, handler);

    return () => {
      window.electronAPI.removeListener(channel, handler);
    };
  }, [channel, handler]);
};
