import { VaultInfo } from "../../types/config";
import { ethers } from "ethers";
import { VaultModalState, VaultTransactionType } from "../../types";
import utils from "../../utils";

type Props = {
  vault: VaultInfo;
  setIsModalOpen: (state: VaultModalState) => void;
  isConnected: boolean;
  openWalletModal: () => void;
};

export const VaultListRow: React.FC<Props> = ({
  vault,
  setIsModalOpen,
  isConnected,
  openWalletModal
}) => {
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
        {utils.formatting.formatToFourDecimals(
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
