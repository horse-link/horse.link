import React, { useCallback } from "react";
import { BaseButton } from ".";
import { Config } from "../../types/config";
import { BetHistory } from "../../types/bets";
import { Signer } from "ethers";
import { useWalletModal } from "../../providers/WalletModal";
import { MarketOracle__factory, Market__factory } from "../../typechain";

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
  const { openWalletModal } = useWalletModal();

  const settleRace = useCallback(async () => {
    if (!betHistory || !betHistory.length || !config || loading || !config)
      return;
    if (!isConnected || !signer) return openWalletModal();

    setIsSettledMarketModalOpen(false);
    setSettleHashes(undefined);
    setLoading(true);
    try {
      // connect to markets
      const markets = config.markets.map(m =>
        Market__factory.connect(m.address, signer)
      );
      // connect to oracle
      const oracleContract = MarketOracle__factory.connect(
        config.addresses.marketOracle,
        signer
      );
      // get winning data (all bets should have data and have the same data)
      const { marketId, winningPropositionId, marketOracleResultSig } =
        betHistory[0];
      // add result
      try {
        await oracleContract.setResult(
          marketId,
          winningPropositionId!,
          marketOracleResultSig!
        );
      } catch (err: any) {
        // fails if result is already set
        console.error(err);
      }
      // settle all bets for respective market
      const txs = await Promise.all(
        betHistory.map(async bet =>
          // market will always match a marketAddress
          (
            await markets
              .find(
                m => m.address.toLowerCase() === bet.marketAddress.toLowerCase()
              )!
              .settle(bet.index)
          ).wait()
        )
      );
      // get hashes from transactions
      const hashes = txs.map(tx => tx.transactionHash);
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
      disabled={!betHistory?.length}
    >
      Settle Race
    </BaseButton>
  );
};
