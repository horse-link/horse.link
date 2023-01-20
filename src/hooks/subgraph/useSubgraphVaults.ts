import { BigNumber } from "ethers";
import { useEffect, useMemo } from "react";
import {
  FormattedVaultTransaction,
  VaultTransaction
} from "../../types/subgraph";
import useSubgraph from "../useSubgraph";
import utils from "../../utils";
import constants from "../../constants";

type Response = {
  vaultTransactions: VaultTransaction[];
};

export const useSubgraphVaults = (vaultAddress?: string) => {
  const { data, loading, refetch } = useSubgraph<Response>(
    utils.queries.getVaultHistoryQuery({
      vaultAddress: vaultAddress ? vaultAddress.toLowerCase() : undefined
    })
  );

  useEffect(() => {
    const refetchInterval = setInterval(
      refetch,
      constants.time.ONE_SECOND_MS * 5
    );

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
