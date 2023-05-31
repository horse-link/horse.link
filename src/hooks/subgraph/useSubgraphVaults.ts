import { BigNumber, ethers } from "ethers";
import { VaultTransaction } from "../../types/subgraph";
import utils from "../../utils";
import useSubgraph from "../useSubgraph";
import { VaultTransactionType } from "../../types/vaults";

type Response = {
  deposits: Array<VaultTransaction>;
  withdraws: Array<VaultTransaction>;
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

  // TODO: reintroduce when new subgraph entities are added

  // data.borrows.forEach(borrow => {
  //   history.push({
  //     type: VaultTransactionType.BORROW,
  //     amount: borrow.amount,
  //     createdAt: borrow.createdAt,
  //     vaultAddress: borrow.vault,
  //     tx: borrow.id
  //   });
  // });

  // data.repays.forEach(repay => {
  //   history.push({
  //     type: VaultTransactionType.REPAY,
  //     amount: repay.amount,
  //     createdAt: repay.createdAt,
  //     vaultAddress: repay.vault,
  //     tx: repay.id
  //   });
  // });

  data.deposits
    .map(utils.formatting.formatVaultTransactionIntoDeposit)
    .forEach(deposit => {
      history.push({
        type: VaultTransactionType.DEPOSIT,
        amount: deposit.assets || ethers.constants.Zero,
        createdAt: deposit.createdAt || 0,
        vaultAddress: deposit.vault || ethers.constants.AddressZero,
        tx: deposit.id || ""
      });
    });

  data.withdraws
    .map(utils.formatting.formatVaultTransactionIntoWithdraw)
    .forEach(withdraw => {
      history.push({
        type: VaultTransactionType.WITHDRAW,
        amount: withdraw.assets || ethers.constants.Zero,
        createdAt: withdraw.createdAt || 0,
        vaultAddress: withdraw.vault || ethers.constants.AddressZero,
        tx: withdraw.id || ""
      });
    });

  history.sort((a, b) => b.createdAt - a.createdAt);

  return history;
};
