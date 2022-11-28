import React, { useState } from "react";
import { VaultHistoryTable, VaultListRow } from "../components/Vaults";
import { PageLayout } from "../components";
import useVaultHistory from "../hooks/vault/useVaultHistory";
import { useConfig } from "../providers/Config";
import { VaultModalState, VaultTransactionType } from "../types";
import { DepositVaultModal, WithdrawVaultModal } from "../components/Modals";
import { useAccount } from "wagmi";
import { useWalletModal } from "../providers/WalletModal";

const Vaults: React.FC = () => {
  const [modal, setModal] = useState<VaultModalState>();
  const vaultHistory = useVaultHistory();
  const config = useConfig();
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const closeModal = () => setModal(undefined);

  return (
    <PageLayout>
      <div className="flex flex-col">
        <h3 className="text-lg mb-3 font-medium text-gray-900">
          Vaults / Liquidity Pools
        </h3>
        <div className="bg-gray-50 rounded-xl overflow-auto">
          <div className="shadow-sm overflow-hidden mt-2 mb-5">
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
                    Deposit/Withdraw
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

export default Vaults;
