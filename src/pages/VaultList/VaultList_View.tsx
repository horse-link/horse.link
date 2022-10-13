import { useContractReads } from "wagmi";
import { PageLayout } from "../../components";
import vaultContractJson from "../../abi/Vault.json";
import mockTokenContractJson from "../../abi/MockToken.json";
import { ethers } from "ethers";

type Props = {
  vaultAddressList: string[];
  onClickVault: (vaultAddress: string) => void;
};

const VaultListView: React.FC<Props> = ({ vaultAddressList, onClickVault }) => {
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
    </PageLayout>
  );
};

export default VaultListView;

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
    id: "loading...",
    symbol: "loading...",
    totalAssets: "loading...",
    vaultAddress: "loading..."
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
      onClick={onClick}
      className="cursor-pointer hover:bg-gray-100"
    >
      <td className="pl-5 pr-2 py-4 whitespace-nowrap"> {rowData.id} </td>
      <td className="flex px-2 py-4 items-center">
        <span> {rowData.symbol} </span>
      </td>
      <td className="px-2 py-4 whitespace-nowrap">{rowData.totalAssets}</td>
      <td className="px-2 py-4 whitespace-nowrap">{rowData.vaultAddress}</td>
    </tr>
  );
};
