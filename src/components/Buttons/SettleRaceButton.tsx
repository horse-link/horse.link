import React, { useCallback, useMemo } from "react";
import { Button } from ".";
import { Config } from "../../types/config";
import { BetHistoryResponse2 } from "../../types/bets";
import { ContractTransaction, Signer } from "ethers";
import { useWalletModal } from "../../providers/WalletModal";
import { MarketOracle__factory, Market__factory } from "../../typechain";
import { BYTES_16_ZERO } from "../../constants/blockchain";
import utils from "../../utils";
import { useApi } from "../../providers/Api";

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
  const api = useApi();

  // Get list of bets that are not settled
  const processableBets = useMemo(
    () => betHistory?.filter(bet => bet.status !== "SETTLED"),
    [betHistory]
  );

  // TODO: investigate to fix
  const settleRace = useCallback(async () => {
    if (!processableBets?.length || !config || loading || !config) return;
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

      // get signed data for bets
      const settlableBets = await Promise.all(
        processableBets.map(async bet => {
          const marketId = utils.markets.getMarketIdFromPropositionId(
            bet.propositionId
          );
          const signedData = await api.getWinningResultSignature(
            marketId,
            true
          );

          return {
            ...bet,
            ...signedData,
            scratched: signedData.scratchedRunners?.find(
              runner =>
                runner.b16propositionId.toLowerCase() ===
                utils.formatting
                  .formatBytes16String(bet.propositionId)
                  .toLowerCase()
            )
          };
        })
      );

      // get winning data (all bets should have data and have the same data)
      const { marketOracleResultSig, winningPropositionId } = settlableBets[0];
      const marketId = utils.markets.getMarketIdFromPropositionId(
        settlableBets[0].propositionId
      );

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
          utils.formatting.formatBytes16String(marketId),
          winningPropositionId,
          marketOracleResultSig!
        );
      }

      const marketContractAddresses = new Set(
        settlableBets.map(bet => {
          // get market address
          const vault = config.vaults.find(
            v => v.asset.address.toLowerCase() === bet.asset.toLowerCase()
          );
          const market = config.markets.find(
            m => m.vaultAddress.toLowerCase() === vault?.address.toLowerCase()
          );

          if (!market)
            throw new Error(`Could not find market for bet asset ${bet.asset}`);

          return market.address;
        })
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
  }, [props, processableBets]);

  const buttonLoading = !config || loading;

  return (
    <Button
      disabled={!processableBets?.length || buttonLoading}
      onClick={settleRace}
      text={buttonLoading ? "loading..." : "settle race"}
      active={!buttonLoading && !!processableBets?.length}
    />
  );
};
