import { useEffect, useRef, useState } from "react";
import {
  Chain,
  Connector,
  useAccount,
  useConnect,
  useNetwork,
  useSwitchNetwork
} from "wagmi";
import { LOCAL_WALLET_ID } from "../constants/wagmi";
import { useApiWithForce } from "../providers/Api";
import { useApolloWithForce } from "../providers/Apollo";
import { Network } from "../types/general";

// beware all ye whom enter
// here lie the dreaded overrides
// to slay the plethora of dragons wagmi spawns

export const useWalletOverrides = () => {
  const { chain, chains } = useNetwork();
  const { connectors, connect } = useConnect();
  const { connector, isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { forceNewChain: forceApi } = useApiWithForce();
  const { forceNewChain: forceApollo } = useApolloWithForce();

  const [lastKnownChain, setLastKnownChain] = useState<Network>(
    chain || chains[0]
  );
  const previousChain = useRef<Network>();
  const [lastKnownConnector, setLastKnownConnector] = useState(
    connector || connectors[0]
  );
  const previousConnector = useRef<Connector>();
  const isLocalWallet = lastKnownConnector.id === LOCAL_WALLET_ID;
  // undefined = loading, boolean = value
  const isChainUnsupported = lastKnownChain.unsupported;

  const forceNewNetwork = (chain: Chain) => {
    switchNetwork?.(chain.id);
    forceApi(chain);
    forceApollo(chain);
  };

  useEffect(() => {
    if (!chain) return;

    setLastKnownChain(prev => {
      previousChain.current = prev;
      return chain;
    });
  }, [chain]);

  useEffect(() => {
    if (!connector) return;

    setLastKnownConnector(prev => {
      previousConnector.current = prev;
      return connector;
    });
  }, [connector]);

  // reconnect
  useEffect(() => {
    if (isConnected) return;

    connect({
      chainId: lastKnownChain.id,
      connector: lastKnownConnector
    });
  }, [isConnected]);

  useEffect(() => {
    if (
      lastKnownConnector.id === previousConnector.current?.id ||
      !previousChain.current
    )
      return;

    // TODO: check if the new network is the same as the old

    forceNewNetwork(previousChain.current);
  }, [lastKnownConnector]);

  return {
    lastKnownChain,
    lastKnownConnector,
    isLocalWallet,
    forceNewNetwork,
    isChainUnsupported
  };
};
