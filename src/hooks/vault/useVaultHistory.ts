import { BigNumber } from "ethers";
import { useMemo } from "react";
import {
  FormattedVaultTransaction,
  VaultTransaction
} from "../../types/entities";
import { getVaultHistoryQuery } from "../../utils/queries";
import useSubgraph from "../useSubgraph";

type Response = {
  vaultTransactions: VaultTransaction[];
};

const useVaultHistory = (vaultAddress?: string) => {
  const { data, loading } = useSubgraph<Response>(getVaultHistoryQuery(vaultAddress));

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
