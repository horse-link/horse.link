import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { Network } from "../types/general";
import { useWagmiNetworkRefetch } from "./WagmiNetworkRefetch";
import { useAccount, useConnect, useNetwork } from "wagmi";
import constants from "../constants";
import { useHorseLinkConnector } from "../hooks/useHorseLinkConnector";

export const NetworkToggleContext = createContext<Network | undefined>(
  undefined
);

export const useNetworkToggle = () => useContext(NetworkToggleContext);

export const NetworkToggleProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // global chain consumer from WagmiNetworkRefetch
  const { globalChainId } = useWagmiNetworkRefetch();
  const { connect } = useConnect();
  const { chain: currentChain, chains } = useNetwork();
  const globalChain = useMemo(
    () => chains.find(c => c.id === globalChainId),
    [globalChainId]
  );

  // local wallet toggle
  const { connector } = useAccount();
  const isLocalWallet = useMemo(
    () =>
      connector ? connector?.id === constants.wagmi.LOCAL_WALLET_ID : undefined,
    [connector]
  );

  // state
  const [selectedChain, setSelectedChain] = useState<Network>();

  // connector instance
  const HorseLinkConnector = useHorseLinkConnector(chains);

  // reconnect local wallet fix
  useEffect(() => {
    if (!connector && isLocalWallet === undefined) {
      connect({ connector: HorseLinkConnector });
    }
  }, [isLocalWallet, connector]);

  // connection logic
  useEffect(() => {
    if (!connector) return;

    if (isLocalWallet) {
      setSelectedChain(globalChain || currentChain);
      return;
    }

    setSelectedChain(currentChain);
  });

  return (
    <NetworkToggleContext.Provider value={selectedChain}>
      {children}
    </NetworkToggleContext.Provider>
  );
};
