import { useEffect, useState } from "react";

export const useChannelData = <T = any>({
  channel,
  defaultState,
  shouldUpdate = (prevData: T, newData: T) => true
}: {
  channel: Channel;
  defaultState: T;
  shouldUpdate?: (prevData: T, newData: T) => boolean;
}) => {
  const [data, setData] = useState<T>(defaultState);

  useEffect(() => {
    const handler = (newData: T) => {
      if (newData !== null && shouldUpdate(data, newData)) {
        setData(newData);
      }
    };

    window.electronAPI.addListener(channel, handler);

    return () => {
      window.electronAPI.removeListener(channel, handler);
    };
  }, [channel]);

  return data;
};

