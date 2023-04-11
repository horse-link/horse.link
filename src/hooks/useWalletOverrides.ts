import { useEffect, useRef, useState } from "react";
import {
  Chain,
  useAccount,
  useConnect,
  useNetwork,
  useSwitchNetwork
} from "wagmi";
import { LOCAL_WALLET_ID } from "../constants/wagmi";
import { useApiWithForce } from "../providers/Api";
import { useApolloWithForce } from "../providers/Apollo";
import { useLocation } from "react-router-dom";
import { arbitrum } from "@wagmi/chains";
import constants from "../constants";
import { useFirstRender } from "./useFirstRender";

// beware all ye whom enter
// here lie the dreaded overrides
// to slay the plethora of dragons wagmi spawns

export const useWalletOverrides = () => {
  const { chain } = useNetwork();
  const { connectors, connect } = useConnect();
  const { connector, isConnected } = useAccount();
  const { switchNetwork, isError } = useSwitchNetwork();
  const { forceNewChain: forceApi } = useApiWithForce();
  const { forceNewChain: forceApollo } = useApolloWithForce();
  const { pathname } = useLocation();
  const isFirstRender = useFirstRender();

  const isLocalWallet = connector?.id === LOCAL_WALLET_ID;
  const isChainUnsupported = chain?.unsupported || false;
  const isUnsupportedPage = pathname === "/unsupported";

  const [lastKnownConnector, setLastKnownConnector] = useState(
    connector || connectors[0]
  );
  useEffect(() => {
    if (!connector) return;

    setLastKnownConnector(connector);
  }, [connector]);

  // network intent
  const networkIntent = useRef<Chain>(constants.blockchain.CHAINS[0]);

  useEffect(() => {
    if (!chain || isLocalWallet || chain.id !== networkIntent.current.id)
      return;

    networkIntent.current = chain;
  }, [chain]);

  useEffect(() => {
    if (!chain || !isError) return;

    networkIntent.current = chain;
  }, [isError]);

  const forceNewNetwork = (chain: Chain) => {
    try {
      networkIntent.current = chain;
      switchNetwork?.(chain.id);
      forceApi(chain);
      forceApollo(chain);
    } catch (e) {
      console.error(e);
      networkIntent.current = constants.blockchain.CHAINS[0];
    }
  };

  // reconnect
  useEffect(() => {
    if (isConnected || isLocalWallet) return;

    // unsupported page override
    if (isUnsupportedPage) {
      connect({
        chainId: arbitrum.id,
        connector: lastKnownConnector
      });
      return;
    }

    connect({
      chainId: arbitrum.id,
      // last connector is HL connector
      connector: connectors.at(-1)
    });
  }, [isConnected]);

  useEffect(() => {
    if (isUnsupportedPage || isFirstRender) return;

    forceNewNetwork(networkIntent.current);
  }, [lastKnownConnector]);

  return {
    lastKnownConnector,
    isLocalWallet,
    forceNewNetwork,
    isChainUnsupported,
    isUnsupportedPage
  };
};
