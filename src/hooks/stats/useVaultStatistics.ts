import { BigNumber, ethers } from "ethers";
import { useMemo } from "react";
import { VaultTransaction } from "../../types/entities";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";
import { useVaultContract } from "../contracts";
import { useConfig } from "../../providers/Config";
import { useProvider } from "wagmi";

type Response = {
  vaultTransactions: VaultTransaction[];
};

const MILLISECONDS_TO_SECONDS_DIVISOR = 1000;
const SECONDS_TWENTYFOUR_HOURS = 86400;

export const useVaultStatistics = () => {
  const config = useConfig();
  const provider = useProvider();
  const { totalAssetsLocked } = useVaultContract();
  const yesterdayFilter = useMemo(
    () =>
      Math.floor(
        Date.now() / MILLISECONDS_TO_SECONDS_DIVISOR - SECONDS_TWENTYFOUR_HOURS
      ),
    []
  );
  // This is the last 24 hours of data
  const { data, loading } = useSubgraph<Response>(
    utils.queries.getVaultStatsQuery(yesterdayFilter)
  );

  const vaultsTransactionData = useMemo(() => {
    if (loading || !data) return;

    return data.vaultTransactions;
  }, [data, loading]);

  const totalVaultDeposits = useMemo(() => {
    if (!vaultsTransactionData) return;
    const vaultDeposits = vaultsTransactionData.filter(
      vaultsTransaction => vaultsTransaction.type === "deposit"
    );
    const amountBigNumbers = vaultDeposits.map(vaultsTransaction =>
      BigNumber.from(vaultsTransaction.amount)
    );

    return amountBigNumbers.reduce(
      (sum, value) => sum.add(value),
      ethers.constants.Zero
    );
  }, [vaultsTransactionData]);

  const totalVaultWithdrawals = useMemo(() => {
    if (!vaultsTransactionData) return;
    const vaultWithdrawals = vaultsTransactionData.filter(
      vaultsTransaction => vaultsTransaction.type === "withdraw"
    );
    const amountBigNumbers = vaultWithdrawals.map(vaultsTransaction =>
      BigNumber.from(vaultsTransaction.amount)
    );

    return amountBigNumbers.reduce(
      (sum, value) => sum.add(value),
      ethers.constants.Zero
    );
  }, [vaultsTransactionData]);

  const totalVaultVolume = useMemo(() => {
    if (!vaultsTransactionData) return;
    if (!totalVaultDeposits) return ethers.constants.Zero;
    if (!totalVaultWithdrawals) return ethers.constants.Zero;
    return totalVaultDeposits.add(totalVaultWithdrawals);
  }, [vaultsTransactionData, totalVaultDeposits, totalVaultWithdrawals]);

  const totalVaultsExposure = useMemo(async () => {
    // Call each vault to get the value of the total assets locked
    // map over the vaults and create an array of promises for the totalAssetsLocked function
    const promises = config?.vaults.map(async vault =>
      totalAssetsLocked(vault, provider)
    );
    // if there are no promises, return a zero value
    if (!promises) return ethers.constants.Zero;
    // otherwise await all promises to resolve and store the results in the variable "results"
    const results = await Promise.all(promises);
    // reduce the results to a sum, starting with a zero value
    return results.reduce(
      (sum, current) => sum.add(current),
      ethers.constants.Zero
    );
  }, [
    vaultsTransactionData,
    totalVaultDeposits,
    totalVaultWithdrawals,
    config?.vaults
  ]);

  return {
    totalVaultDeposits,
    totalVaultWithdrawals,
    totalVaultVolume,
    totalVaultsExposure
  };
};
