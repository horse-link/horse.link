import React, { useCallback, useMemo, useRef } from "react";
import { BaseButton } from ".";
import { Config } from "../../types/config";
import { BetHistory } from "../../types/bets";
import { ContractReceipt, ContractTransaction, Signer } from "ethers";
import { useWalletModal } from "../../providers/WalletModal";
import classnames from "classnames";
import { MarketOracle__factory, Market__factory } from "../../typechain";
import { BYTES_16_ZERO } from "../../constants/blockchain";

type Props = {
  betHistory?: BetHistory[];
  loading: boolean;
  isConnected: boolean;
  config?: Config;
  signer?: Signer | null;
  setIsSettledMarketModalOpen: (state: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSettleHashes: (hashes?: string[]) => void;
  refetch: () => void;
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
    setLoading,
    refetch
  } = props;
  const { openWalletModal } = useWalletModal();
  const { current: now } = useRef(Math.floor(Date.now() / 1000));

  const settlableBets = useMemo(
    () =>
      betHistory?.filter(bet => {
        return !bet.settled && bet.payoutDate < now;
      }),
    [betHistory]
  );

  const settleRace = useCallback(async () => {
    if (!settlableBets?.length || !config || loading || !config) return;
    if (!isConnected || !signer) return openWalletModal();

    setIsSettledMarketModalOpen(false);
    setSettleHashes(undefined);
    setLoading(true);
    console.log(`Settling ${settlableBets.length} bets`);
    try {
      // connect to oracle
      const oracleContract = MarketOracle__factory.connect(
        config.addresses.marketOracle,
        signer
      );
      // get winning data (all bets should have data and have the same data)
      const { marketId, marketOracleResultSig } = settlableBets[0];
      // add result
      const result = await oracleContract.getResult(marketId);

      debugger;

      if (result.winningPropositionId === BYTES_16_ZERO) {
        if (!marketOracleResultSig) {
          throw new Error(
            "Something went wrong trying to register the result for this race. Please refresh the page and try again."
          );
        }

        // If result is not set, set it
        await oracleContract.setResult(
          marketId,
          result.winningPropositionId!,
          marketOracleResultSig!
        );
      }

      const marketContractAddresses = new Set(
        settlableBets.map(bet => bet.marketAddress)
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
      console.log("Finished settling bets");
      setLoading(false);
      refetch();
    }
  }, [props, settlableBets]);

  return (
    <BaseButton
      className={classnames(
        "w-full rounded-lg py-3 text-center text-lg !font-bold text-black"
      )}
      loading={!config || !settlableBets || loading}
      loaderSize={20}
      onClick={settleRace}
      disabled={!settlableBets?.length}
    >
      SETTLE RACE
    </BaseButton>
  );
};
