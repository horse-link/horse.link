import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";
import { useVaultContract } from "../contracts";
import { useConfig } from "../../providers/Config";
import { useProvider } from "wagmi";
import constants from "../../constants";
import { Deposit, Withdraw } from "../../types/subgraph";

type DepositsResponse = {
  deposits: Array<Deposit>;
};

type WithdrawResponse = {
  withdraws: Array<Withdraw>;
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
  const { data: depositData, loading: depositLoading } =
    useSubgraph<DepositsResponse>(
      utils.queries.getDepositsWithoutPagination({
        createdAt_gte: yesterdayFilter
      })
    );
  const { data: withdrawData, loading: withdrawLoading } =
    useSubgraph<WithdrawResponse>(
      utils.queries.getWithdrawsWithoutPagination({
        createdAt_gte: yesterdayFilter
      })
    );

  const vaultsTransactionData = useMemo(() => {
    if (depositLoading || !depositData || withdrawLoading || !withdrawData)
      return;

    return {
      deposits: depositData.deposits,
      withdraws: withdrawData.withdraws
    };
  }, [depositData, depositLoading, withdrawData, withdrawLoading]);

  const totalVaultDeposits = useMemo(() => {
    if (!vaultsTransactionData) return;

    return vaultsTransactionData.deposits.reduce(
      (sum, curr) => sum.add(curr.assets),
      ethers.constants.Zero
    );
  }, [vaultsTransactionData]);

  const totalVaultWithdrawals = useMemo(() => {
    if (!vaultsTransactionData) return;

    return vaultsTransactionData.withdraws.reduce(
      (sum, curr) => sum.add(curr.assets),
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
          try {
            const balance = await totalAssetsLocked(v, provider);
            return ethers.utils.formatUnits(balance, v.asset.decimals);
          } catch (e) {
            console.log(e);
            return "0";
          }
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
