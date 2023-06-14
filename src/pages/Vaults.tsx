import React, { useState } from "react";
import { NewVaultHistoryTable, NewVaultsTable } from "../components/Tables";
import { useSubgraphVaults } from "../hooks/subgraph";
import { DepositVaultModal, WithdrawVaultModal } from "../components/Modals";
import { VaultModalState, VaultTransactionType } from "../types/vaults";
import { Card, PageLayout } from "../components";
import utils from "../utils";
import { ethers } from "ethers";
import { useVaultStatistics } from "../hooks/stats";

const Vaults: React.FC = () => {
  const [modal, setModal] = useState<VaultModalState>();
  const vaultHistory = useSubgraphVaults();

  const closeModal = () => setModal(undefined);
  const {
    totalVaultDeposits,
    totalVaultWithdrawals,
    totalVaultVolume,
    totalVaultsExposure
  } = useVaultStatistics();

  return (
    <PageLayout>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
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
      <div className="mt-10">
        <p>VAULTS & LIQUIDITY POOLS</p>
      </div>
      <div className="mt-4">
        <NewVaultsTable setIsModalOpen={setModal} />
      </div>
      <div className="mt-10">
        <p>HISTORY</p>
      </div>
      <div className="mt-4">
        <NewVaultHistoryTable vaultHistory={vaultHistory} />
      </div>
      {modal &&
        (modal.type === VaultTransactionType.DEPOSIT ? (
          <DepositVaultModal
            isModalOpen={!!modal}
            closeModal={closeModal}
            vault={modal.vault}
          />
        ) : (
          <WithdrawVaultModal
            isModalOpen={!!modal}
            closeModal={closeModal}
            vault={modal.vault}
          />
        ))}
      <div className="block py-10 lg:hidden" />
    </PageLayout>
  );
};

export default Vaults;
