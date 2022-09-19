import { createContext } from "react";
import Api from "../apis/Api";

export const ApiContext = createContext<Api>(null as any);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const api = new Api();
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
