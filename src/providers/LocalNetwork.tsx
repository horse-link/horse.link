import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState
} from "react";
import { LocalNetworkContextType } from "../types/context";
import constants from "../constants";
import { useAccount } from "wagmi";
import { LOCAL_WALLET_ID } from "../constants/wagmi";

// default value
export const LocalNetworkContext = createContext<LocalNetworkContextType>({
  globalId: constants.blockchain.CHAINS[0].id,
  setGlobalId: (_: number) => {},
  usingLocalNetwork: false
});

export const useLocalNetworkContext = () => useContext(LocalNetworkContext);

export const LocalNetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [globalId, setGlobalId] = useState<number>(
    constants.blockchain.CHAINS[0].id
  );
  const [usingLocalNetwork, setUsingLocalNetwork] = useState(false);
  const { connector } = useAccount();

  useLayoutEffect(() => {
    if (connector && connector.id === LOCAL_WALLET_ID)
      return setUsingLocalNetwork(true);

    setUsingLocalNetwork(false);
  }, [connector]);

  const value = useMemo(
    () => ({
      globalId,
      setGlobalId,
      usingLocalNetwork
    }),
    [globalId, setGlobalId, usingLocalNetwork]
  );

  console.log(value);

  return (
    <LocalNetworkContext.Provider value={value}>
      {children}
    </LocalNetworkContext.Provider>
  );
};
