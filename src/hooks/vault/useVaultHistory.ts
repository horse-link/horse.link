import { BigNumber } from "ethers";
import { useEffect, useMemo } from "react";
import {
  FormattedVaultTransaction,
  VaultTransaction
} from "../../types/entities";
import { getVaultHistoryQuery } from "../../utils/queries";
import useSubgraph from "../useSubgraph";

type Response = {
  vaultTransactions: VaultTransaction[];
};

const POLL_INTERVAL = 5000;

const useVaultHistory = (vaultAddress?: string) => {
  const { data, loading, refetch } = useSubgraph<Response>(
    getVaultHistoryQuery(vaultAddress)
  );

  useEffect(() => {
    const refetchInterval = setInterval(refetch, POLL_INTERVAL);

    return () => clearInterval(refetchInterval);
  }, []);

  const formattedData = useMemo<FormattedVaultTransaction[] | undefined>(() => {
    if (loading || !data) return;

    return data.vaultTransactions.map(tx => ({
      ...tx,
      amount: BigNumber.from(tx.amount),
      timestamp: +tx.timestamp
    }));
  }, [data, loading]);

  return formattedData;
};

export default useVaultHistory;
