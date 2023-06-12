import { useEffect, useState } from "react";

export const usePromise = <T>(callback: () => Promise<T>) => {
  const [state, setState] = useState<T>();

  useEffect(() => {
    callback().then(setState).catch(console.error);
  }, []);

  return state;
};
