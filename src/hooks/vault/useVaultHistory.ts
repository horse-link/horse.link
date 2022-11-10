import { BigNumber } from "ethers";
import { useMemo } from "react";
import {
  FormattedVaultTransaction,
  VaultTransaction
} from "../../types/entities";
import useSubgraph from "../useSubgraph";

type Response = {
  vaultTransactions: VaultTransaction[];
};

const useVaultHistory = (vaultAddress?: string) => {
  const query = `{
    vaultTransactions(
      first: 1000
      ${vaultAddress ? `where: { vaultAddress: "${vaultAddress}" }` : ""}
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      type
      vaultAddress
      depositerAddress
      amount
      timestamp
    }
  }`;

  const { data, loading } = useSubgraph<Response>(query);

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
