import { BigNumber } from "ethers";
import { Deposit, Withdraw, Borrow, Repay } from "../../types/subgraph";
import utils from "../../utils";
import useSubgraph from "../useSubgraph";
import { VaultTransactionType } from "../../types/vaults";

type Response = {
  deposits: Array<Deposit>;
  withdraws: Array<Withdraw>;
  borrows: Array<Borrow>;
  repays: Array<Repay>;
};

export type VaultHistory = {
  type: VaultTransactionType;
  amount: BigNumber;
  createdAt: number;
  vaultAddress: string;
  tx: string;
}[];

export const useSubgraphVaults = () => {
  const { data, loading } = useSubgraph<Response>(
    utils.queries.getVaultHistory()
  );

  if (loading) return;
  if (!data) return [];

  const history: VaultHistory = [];
  data.borrows.forEach(borrow => {
    history.push({
      type: VaultTransactionType.BORROW,
      amount: borrow.amount,
      createdAt: borrow.createdAt,
      vaultAddress: borrow.vault,
      tx: borrow.id
    });
  });
  data.repays.forEach(repay => {
    history.push({
      type: VaultTransactionType.REPAY,
      amount: repay.amount,
      createdAt: repay.createdAt,
      vaultAddress: repay.vault,
      tx: repay.id
    });
  });
  data.deposits.forEach(deposit => {
    history.push({
      type: VaultTransactionType.DEPOSIT,
      amount: deposit.assets,
      createdAt: deposit.createdAt,
      vaultAddress: deposit.vault,
      tx: deposit.id
    });
  });
  data.withdraws.forEach(withdraw => {
    history.push({
      type: VaultTransactionType.WITHDRAW,
      amount: withdraw.assets,
      createdAt: withdraw.createdAt,
      vaultAddress: withdraw.vault,
      tx: withdraw.id
    });
  });

  history.sort((a, b) => b.createdAt - a.createdAt);

  return history;
};
