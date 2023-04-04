import React, { useState } from "react";
import { VaultHistoryTable, VaultsTable } from "../components/Tables";
import { useSubgraphVaults } from "../hooks/subgraph";
import { useConfig } from "../providers/Config";
import { DepositVaultModal, WithdrawVaultModal } from "../components/Modals";
import { VaultModalState, VaultTransactionType } from "../types/vaults";
import { Card, PageLayout } from "../components";
import utils from "../utils";
import { ethers } from "ethers";
import { useVaultStatistics } from "../hooks/stats";

const Vaults: React.FC = () => {
  const [modal, setModal] = useState<VaultModalState>();
  const vaultHistory = useSubgraphVaults();
  const config = useConfig();

  const closeModal = () => setModal(undefined);
  const {
    totalVaultDeposits,
    totalVaultWithdrawals,
    totalVaultVolume,
    totalVaultsExposure
  } = useVaultStatistics();

  return (
    <PageLayout>
      <div className="mb-4 flex w-full flex-col justify-center gap-x-1 gap-y-2 text-left md:flex-row lg:justify-between lg:gap-x-4">
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
              ethers.utils.formatEther(totalVaultsExposure)
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
      <VaultsTable setIsModalOpen={setModal} config={config} />
      <VaultHistoryTable history={vaultHistory} />
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

export default Vaults;
