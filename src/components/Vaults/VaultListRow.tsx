import { getVault } from "../../utils/config";
import { Config } from "../../types/config";
import { ethers } from "ethers";
import { formatToFourDecimals } from "../../utils/formatting";
import { VaultModalState, VaultTransactionType } from "../../types";

type Props = {
  vaultAddress: string;
  setIsModalOpen: (state: VaultModalState) => void;
  config: Config;
  isConnected: boolean;
  openWalletModal: () => void;
};

export const VaultListRow: React.FC<Props> = ({
  vaultAddress,
  setIsModalOpen,
  config,
  isConnected,
  openWalletModal
}) => {
  const vault = getVault(vaultAddress, config)!;
  const openModal = (type: VaultTransactionType) =>
    isConnected
      ? setIsModalOpen({
          type,
          vault
        })
      : openWalletModal();

  return (
    <tr>
      <td className="pl-5 pr-2 py-4 whitespace-nowrap">{vault.name}</td>
      <td className="px-2 py-4">{vault.asset.symbol}</td>
      <td className="px-2 py-4 whitespace-nowrap">
        $
        {formatToFourDecimals(
          ethers.utils.formatUnits(vault.totalAssets, vault.asset.decimals)
        )}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">{vault.address}</td>
      <td className="px-2 py-4 whitespace-nowrap">
        <button
          className="px-4 font-bold border-black border-2 py-1 rounded-md hover:text-white hover:bg-black transition-colors duration-100 mr-4"
          onClick={() => openModal(VaultTransactionType.DEPOSIT)}
        >
          Deposit
        </button>
        <button
          className="px-4 font-bold border-black border-2 py-1 rounded-md hover:text-white hover:bg-black transition-colors duration-100"
          onClick={() => openModal(VaultTransactionType.WITHDRAW)}
        >
          Withdraw
        </button>
      </td>
    </tr>
  );
};
