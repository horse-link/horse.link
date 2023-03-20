import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { VaultTransaction } from "../../types/subgraph";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";
import { useVaultContract } from "../contracts";
import { useConfig } from "../../providers/Config";
import { useProvider } from "wagmi";
import constants from "../../constants";

type Response = {
  vaultTransactions: VaultTransaction[];
};

export const useVaultStatistics = () => {
  const config = useConfig();
  const provider = useProvider();
  const { totalAssetsLocked } = useVaultContract();
  const yesterdayFilter = useMemo(
    () =>
      Math.floor(
        Date.now() / constants.time.ONE_SECOND_MS -
          constants.time.TWENTY_FOUR_HOURS_S
      ),
    []
  );
  // This is the last 24 hours of data
  const { data, loading } = useSubgraph<Response>(
    utils.queries.getVaultStatsQuery({
      timestamp_gte: yesterdayFilter
    })
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
    if (!totalVaultDeposits || !totalVaultWithdrawals)
      return ethers.constants.Zero;
    return totalVaultDeposits.add(totalVaultWithdrawals);
  }, [vaultsTransactionData, totalVaultDeposits, totalVaultWithdrawals]);

  const [totalVaultsExposure, setTotalVaultsExposure] = useState<BigNumber>();

  useEffect(() => {
    if (!config) return;

    (async () => {
      const assets = await Promise.all(
        config.vaults.map(async v => {
          const balance = await totalAssetsLocked(v, provider);
          return ethers.utils.formatUnits(balance, v.asset.decimals);
        })
      );
      const exposure = assets.reduce(
        (sum, cur) => sum.add(ethers.utils.parseEther(cur)),
        ethers.constants.Zero
      );
      setTotalVaultsExposure(exposure);
    })();
  }, [config, provider]);

  return {
    totalVaultDeposits,
    totalVaultWithdrawals,
    totalVaultVolume,
    totalVaultsExposure
  };
};
