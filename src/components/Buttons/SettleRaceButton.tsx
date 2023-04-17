import React, { useCallback, useMemo } from "react";
import { BaseButton } from ".";
import { Config } from "../../types/config";
import { BetHistory } from "../../types/bets";
import { ContractReceipt, Signer } from "ethers";
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

  const settlableBets = useMemo(
    () => betHistory?.filter(bet => !bet.settled),
    [betHistory]
  );

  const settleRace = useCallback(async () => {
    if (!settlableBets?.length || !config || loading || !config) return;
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
        settlableBets[0];
      // add result
      const result = await oracleContract.getResult(marketId);

      if (result.winningPropositionId !== BYTES_16_ZERO) {
        throw new Error("This race does not have a result yet");
      }

      if (
        result.winningPropositionId === BYTES_16_ZERO &&
        marketOracleResultSig
      ) {
        // If result is not set, set it
        await oracleContract.setResult(
          marketId,
          winningPropositionId!,
          marketOracleResultSig!
        );
      }

      // settle all bets for respective market
      const txs: ContractReceipt[] = [];
      for (const bet of settlableBets) {
        // market will always match a marketAddress
        console.log("Settling bet", bet.index);
        const tx = await (
          await markets
            .find(
              m => m.address.toLowerCase() === bet.marketAddress.toLowerCase()
            )!
            .settle(bet.index)
        ).wait();
        txs.push(tx);
      }

      // get hashes from transactions
      const hashes = txs.map(tx => tx.transactionHash);
      // set hashes and show success modal
      setSettleHashes(hashes);
      setIsSettledMarketModalOpen(true);
    } catch (err: any) {
      console.error(err);
    } finally {
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
