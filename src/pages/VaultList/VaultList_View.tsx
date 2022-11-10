import { PageLayout } from "../../components";
import Skeleton from "react-loading-skeleton";
import VaultLogic from "./components/Vault/Vault_Logic";
import Modal from "../../components/Modal";
import useVaultDetail from "../../hooks/vault/useVaultDetail";
import { FormattedVaultTransaction } from "../../types/entities";
import { ethers } from "ethers";
import { shortenAddress } from "../../utils/shortenAddress";

type Props = {
  vaultAddressList: string[];
  onClickVault: (vaultAddress: string) => void;
  isDialogOpen: boolean;
  onCloseDialog: () => void;
  selectedVaultAddress: string;
  vaultHistory?: FormattedVaultTransaction[];
};

const VaultListView: React.FC<Props> = ({
  vaultAddressList,
  onClickVault,
  isDialogOpen,
  onCloseDialog,
  selectedVaultAddress,
  vaultHistory
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
                    TLV
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Vault Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vaultAddressList.map((v, i) => (
                  <Row
                    vaultAddress={v}
                    key={v || i}
                    onClick={() => onClickVault(v)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <HistoryTable history={vaultHistory} />
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
  const vaultDetail = useVaultDetail(vaultAddress);
  const { name, symbol, totalAssets, address } = vaultDetail || {};
  return (
    <tr
      key={name}
      onClick={onClick}
      className="cursor-pointer hover:bg-gray-100"
    >
      <td className="pl-5 pr-2 py-4 whitespace-nowrap">
        {name || <Skeleton />}
      </td>
      <td className="px-2 py-4">{symbol || <Skeleton />}</td>
      <td className="px-2 py-4 whitespace-nowrap">
        {totalAssets || <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">{address || <Skeleton />}</td>
    </tr>
  );
};

type HistoryTableProps = {
  history: FormattedVaultTransaction[] | undefined;
};

const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => (
  <div className="w-full flex flex-col mt-8">
    <h3 className="text-lg mb-3 font-medium text-gray-900">History</h3>
    <div className="bg-gray-50 rounded-xl overflow-auto">
      <div className="shadow-sm overflow-hidden mt-2 mb-5">
        <table className="border-collapse table-auto w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Desposit / Withdraw
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                amount
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                block
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                vault name
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                txid
              </th>
            </tr>
          </thead>
          {!history ? (
            <tbody className="bg-white divide-y divide-gray-200">
              loading...
            </tbody>
          ) : (
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map(v => (
                <tr key={v.id} className="cursor-pointer hover:bg-gray-100">
                  <td className="pl-5 pr-2 py-4 whitespace-nowrap uppercase">
                    {v.type}
                  </td>
                  <td className="px-2 py-4">
                    {ethers.utils.formatEther(v.amount)}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">{v.timestamp}</td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {shortenAddress(v.vaultAddress)}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    {shortenAddress(v.id)}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  </div>
);
