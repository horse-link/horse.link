import { Deposit, Withdraw, Borrow, Repay } from "../../types/subgraph";
import utils from "../../utils";
import useSubgraph from "../useSubgraph";

type Response = {
  deposits: Array<Deposit>;
  withdraws: Array<Withdraw>;
  borrows: Array<Borrow>;
  repays: Array<Repay>;
};

export const useSubgraphVaults = (vaultAddress: string) => {
  const { data, loading } = useSubgraph<Response>(
    utils.queries.getVaultHistory()
  );

  console.log({ data });
};
