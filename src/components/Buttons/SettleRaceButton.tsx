import React, { useCallback } from "react";
import { BaseButton } from ".";
import { Config, MarketInfo } from "../../types/config";
import { BetHistory } from "../../types/bets";
import { Signer } from "ethers";
import { useMarketContract } from "../../hooks/contracts";

type Props = {
  betHistory?: BetHistory[];
  loading: boolean;
  isConnected: boolean;
  config?: Config;
  signer?: Signer | null;
  setIsSettledMarketModalOpen: (state: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSettleHashes: (hashes?: string[]) => void;
};

export const SettleRaceButton: React.FC<Props> = props => {
  const {
    config,
    betHistory,
    loading,
    isConnected,
    signer,
    setIsSettledMarketModalOpen,
    setSettleHashes,
    setLoading
  } = props;
  const { settleBet, setResult } = useMarketContract();

  const settleRace = useCallback(async () => {
    if (
      !betHistory ||
      !betHistory.length ||
      !config ||
      !isConnected ||
      loading ||
      !signer ||
      !config
    )
      return;

    setIsSettledMarketModalOpen(false);
    setSettleHashes(undefined);
    setLoading(true);
    try {
      // try to set results for both markets
      await Promise.all(
        config.markets.map(market =>
          setResult(
            market,
            signer,
            // find a bet that matches the market, will always be defined
            betHistory.find(
              bet =>
                bet.marketAddress.toLowerCase() === market.address.toLowerCase()
            )!,
            config
          )
        )
      );
      // settle all bets and collect hashes
      const hashes = await Promise.all(
        betHistory.map(async bet =>
          settleBet(
            // we only need the address
            {
              address: bet.marketAddress
            } as MarketInfo,
            bet,
            signer,
            config
          )
        )
      );
      // set hashes and show success modal
      setSettleHashes(hashes);
      setIsSettledMarketModalOpen(true);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [props]);

  return (
    <BaseButton
      className="!w-auto !px-6 !py-3 !text-md"
      loading={!config || !betHistory || loading}
      loaderSize={20}
      onClick={settleRace}
      disabled={!isConnected || !signer || !betHistory?.length}
    >
      Settle Race
    </BaseButton>
  );
};
