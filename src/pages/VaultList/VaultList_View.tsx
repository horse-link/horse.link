import { useContractReads } from "wagmi";
import { PageLayout } from "../../components";
import vaultContractJson from "../../abi/Vault.json";
import mockTokenContractJson from "../../abi/MockToken.json";
import { ethers } from "ethers";
import Skeleton from "react-loading-skeleton";
import VaultLogic from "./components/Vault/Vault_Logic";
import Modal from "../../components/Modal";

type Props = {
  vaultAddressList: string[];
  onClickVault: (vaultAddress: string) => void;
  isDialogOpen: boolean;
  onCloseDialog: () => void;
  selectedVaultAddress: string;
};

const VaultListView: React.FC<Props> = ({
  vaultAddressList,
  onClickVault,
  isDialogOpen,
  onCloseDialog,
  selectedVaultAddress
}) => {
  // TODO: Do we want to make this table responsive?
  return (
    <PageLayout requiresAuth={false}>
      <div className="flex flex-col">
        <h3 className="text-lg mb-3 font-medium text-gray-900">
          Vaults / Liquidity Pools
        </h3>
        <div className="bg-gray-50 rounded-xl overflow-auto">
          <div className="shadow-sm overflow-hidden mt-2 mb-5">
            <table className="border-collapse table-fixed w-full divide-y divide-gray-200">
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
                    TLV
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vaultAddressList.map(v => (
                  <Row
                    vaultAddress={v}
                    key={v}
                    onClick={() => onClickVault(v)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <VaultModal
        isOpen={isDialogOpen}
        onClose={onCloseDialog}
        vaultAddress={selectedVaultAddress}
      />
    </PageLayout>
  );
};

export default VaultListView;

type VaultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  vaultAddress: string;
};

const VaultModal = ({ isOpen, onClose, vaultAddress }: VaultModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <VaultLogic vaultAddress={vaultAddress} />
    </Modal>
  );
};

type rowProp = {
  vaultAddress: string;
  onClick: () => void;
};

const Row: React.FC<rowProp> = ({ vaultAddress, onClick }) => {
  const vaultContract = {
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi
  };

  const { data: vaultData } = useContractReads({
    contracts: [
      {
        ...vaultContract,
        functionName: "totalAssets"
      },
      {
        ...vaultContract,
        functionName: "asset"
      }
    ]
  });
  const [bNTotalAssets, tokenAddress] = vaultData ?? [];
  const tokenContract = {
    addressOrName: tokenAddress?.toString() || "",
    contractInterface: mockTokenContractJson.abi
  };
  const { data: tokenData } = useContractReads({
    contracts: [
      {
        ...tokenContract,
        functionName: "name"
      },
      {
        ...tokenContract,
        functionName: "symbol"
      },
      {
        ...tokenContract,
        functionName: "decimals"
      }
    ],
    enabled: !!tokenAddress
  });
  let rowData = {
    id: "",
    symbol: "",
    totalAssets: "",
    vaultAddress: ""
  };
  if (bNTotalAssets && tokenData) {
    const [name, symbol, decimals] = tokenData;
    rowData = {
      id: name as unknown as string,
      symbol: symbol as unknown as string,
      totalAssets: ethers.utils.formatUnits(bNTotalAssets, decimals),
      vaultAddress
    };
  }

  return (
    <tr
      key={rowData.id}
      onClick={() => alert("im click too")}
      className="cursor-pointer hover:bg-gray-100"
    >
      <td className="pl-5 pr-2 py-4">{rowData.id || <Skeleton />}</td>
      <td className="px-2">{rowData.symbol || <Skeleton />}</td>
      <td className="px-2 ">{rowData.totalAssets || <Skeleton />}</td>
      <td className="px-2 truncate">{rowData.vaultAddress || <Skeleton />}</td>
      <td className="px-2">
        <button
          onClick={e => {
            e.stopPropagation();
            onClick();
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Deposit / Withdraw
        </button>
      </td>
    </tr>
  );
};
