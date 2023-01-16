import React, { useState } from "react";
import { VaultHistoryTable, VaultListRow } from "../components/Vaults";
import { useSubgraphVaults } from "../hooks/subgraph";
import { useConfig } from "../providers/Config";
import { DepositVaultModal, WithdrawVaultModal } from "../components/Modals";
import { useAccount } from "wagmi";
import { useWalletModal } from "../providers/WalletModal";
import { VaultModalState, VaultTransactionType } from "../types/vaults";
import { Card, PageLayout } from "../components";
import utils from "../utils";
import { ethers } from "ethers";
import { useVaultStatistics } from "../hooks/stats/useVaultStatistics";

export const Vaults: React.FC = () => {
  const [modal, setModal] = useState<VaultModalState>();
  const vaultHistory = useSubgraphVaults();
  const config = useConfig();
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const closeModal = () => setModal(undefined);
  const {
    totalVaultDeposits,
    totalVaultWithdrawals,
    totalVaultVolume,
    totalVaultsExposure
  } = useVaultStatistics();

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row w-full justify-center text-left gap-x-1 gap-y-2 lg:gap-x-4 mb-4 lg:justify-between">
        <Card
          title="24H Vault Volume"
          data={
            totalVaultVolume &&
            `$${utils.formatting.formatToFourDecimals(
              ethers.utils.formatEther(totalVaultVolume)
            )}`
          }
        />
        <Card
          title="Total Vault Exposure"
          data={
            totalVaultsExposure &&
            `$${utils.formatting.formatToFourDecimals(
              totalVaultsExposure.toString()
            )}`
          }
        />
        <Card
          title="24H Deposits"
          data={
            totalVaultDeposits &&
            `$${utils.formatting.formatToFourDecimals(
              ethers.utils.formatEther(totalVaultDeposits)
            )}`
          }
        />
        <Card
          title="24H Withdrawals"
          data={
            totalVaultWithdrawals &&
            `$${utils.formatting.formatToFourDecimals(
              ethers.utils.formatEther(totalVaultWithdrawals)
            )}`
          }
        />
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg mb-3 font-medium text-gray-900">
          Vaults / Liquidity Pools
        </h3>
        <div className="bg-gray-50 rounded-xl">
          <div className="shadow-sm overflow-x-scroll mt-2 mb-5">
            <table className="border-collapse table-auto w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Token
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    TVL
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Vault Address
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Deposit / Withdraw
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {config ? (
                  config.vaults.map(vault => (
                    <VaultListRow
                      key={vault.address}
                      vault={vault}
                      setIsModalOpen={setModal}
                      isConnected={isConnected}
                      openWalletModal={openWalletModal}
                    />
                  ))
                ) : (
                  <td className="p-2 select-none">loading...</td>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <VaultHistoryTable history={vaultHistory} config={config} />
      </div>
      {modal?.type === VaultTransactionType.DEPOSIT && (
        <DepositVaultModal
          isModalOpen={!!modal}
          closeModal={closeModal}
          vault={modal.vault}
        />
      )}
      {modal?.type === VaultTransactionType.WITHDRAW && (
        <WithdrawVaultModal
          isModalOpen={!!modal}
          closeModal={closeModal}
          vault={modal.vault}
        />
      )}
    </PageLayout>
  );
};
