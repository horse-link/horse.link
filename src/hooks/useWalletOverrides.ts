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
import { useLocation } from "react-router-dom";
import { arbitrum } from "@wagmi/chains";

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
  const { pathname } = useLocation();

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

  // unsupported page check
  const isUnsupportedPage = pathname === "/unsupported";

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
  }, [chain, lastKnownConnector]);

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

    // unsupported page override
    if (isUnsupportedPage) {
      connect({
        chainId: arbitrum.id,
        connector: lastKnownConnector
      });
      return;
    }

    connect({
      chainId: lastKnownChain.id,
      connector: lastKnownConnector
    });
  }, [isConnected]);

  useEffect(() => {
    if (
      lastKnownConnector.id === previousConnector.current?.id ||
      !previousChain.current ||
      isUnsupportedPage
    )
      return;

    forceNewNetwork(previousChain.current);
  }, [lastKnownConnector]);

  return {
    lastKnownChain,
    lastKnownConnector,
    isLocalWallet,
    forceNewNetwork,
    isChainUnsupported,
    isUnsupportedPage
  };
};
