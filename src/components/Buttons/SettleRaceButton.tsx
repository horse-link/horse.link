import React, { useCallback, useMemo, useRef } from "react";
import { NewButton } from ".";
import { Config } from "../../types/config";
import { BetHistoryResponse2 } from "../../types/bets";
import { ContractTransaction, Signer } from "ethers";
import { useWalletModal } from "../../providers/WalletModal";
import { MarketOracle__factory, Market__factory } from "../../typechain";
import { BYTES_16_ZERO } from "../../constants/blockchain";

type Props = {
  betHistory?: BetHistoryResponse2[];
  loading: boolean;
  isConnected: boolean;
  config?: Config;
  signer?: Signer | null;
  setIsSettledMarketModalOpen: (state: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSettleHashes: (hashes?: string[]) => void;
};

// TODO: fix when signing is a thing

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

  // Get list of bets that are not settled
  const settlableBets = useMemo(
    () => betHistory?.filter(bet => bet.status !== "SETTLED"),
    [betHistory]
  );

  const settleRace = useCallback(async () => {
    if (!settlableBets?.length || !config || loading || !config) return;
    if (!isConnected || !signer) return openWalletModal();

    setIsSettledMarketModalOpen(false);
    setSettleHashes(undefined);
    setLoading(true);

    try {
      // connect to oracle
      const oracleContract = MarketOracle__factory.connect(
        config.addresses.marketOracle,
        signer
      );
      // get winning data (all bets should have data and have the same data)
      const { marketId, marketOracleResultSig, winningPropositionId } =
        settlableBets[0];

      // add result
      const result = await oracleContract.getResult(marketId);

      if (
        result.winningPropositionId === BYTES_16_ZERO &&
        winningPropositionId
      ) {
        if (!marketOracleResultSig) {
          throw new Error(
            "Something went wrong trying to register the result for this race. Please refresh the page and try again."
          );
        }
        await oracleContract.setResult(
          marketId,
          winningPropositionId,
          marketOracleResultSig!
        );
      }

      const marketContractAddresses = new Set(
        settlableBets.map(bet => bet.market)
      );
      const txs: ContractTransaction[] = [];
      for (const marketAddress of marketContractAddresses) {
        const marketContract = Market__factory.connect(marketAddress, signer);
        const tx = await marketContract.settleMarket(marketId);
        txs.push(tx);
      }
      await Promise.all(txs.map(tx => tx.wait()));

      // get hashes from transactions
      const hashes = txs.map(tx => tx.hash);
      // set hashes and show success modal
      setSettleHashes(hashes);

      setIsSettledMarketModalOpen(true);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [props, settlableBets]);

  const buttonLoading = !config || loading;

  return (
    <NewButton
      disabled={!settlableBets?.length || buttonLoading}
      onClick={settleRace}
      text={buttonLoading ? "loading..." : "settle race"}
      active={!buttonLoading && !!settlableBets?.length}
    />
  );
};
