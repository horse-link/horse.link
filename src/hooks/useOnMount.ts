import { useEffect } from "react";

const useMount = (fn: React.EffectCallback) => {
  // eslint-disable-next-line
  useEffect(fn, []);
};

export default useMount;
