import { useContractReads } from "wagmi";
import { PageLayout } from "../../components";
import vaultContractJson from "../../abi/Vault.json";
import { ethers } from "ethers";

type Props = {
  vaultAddressList: string[];
};

const VaultsView: React.FC<Props> = ({ vaultAddressList }) => {
  // TODO: Do we want to make this table responsive?
  return (
    <PageLayout requiresAuth={false}>
      <div className="flex flex-col">
        <h3 className="text-lg mb-3 font-medium text-gray-900">
          Vaults / Liquidity Pools
        </h3>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      #
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
                      Total Assets
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Owner Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vaultAddressList.map(v => (
                    <Row vaultAddress={v} key={v} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default VaultsView;

const Row: React.FC<{ vaultAddress: string }> = ({ vaultAddress }) => {
  const vaultContract = {
    addressOrName: vaultAddress,
    contractInterface: vaultContractJson.abi
  };

  const { data, isLoading } = useContractReads({
    contracts: [
      {
        ...vaultContract,
        functionName: "name"
      },
      {
        ...vaultContract,
        functionName: "symbol"
      },
      {
        ...vaultContract,
        functionName: "totalAssets"
      },
      {
        ...vaultContract,
        functionName: "owner"
      }
    ]
  });
  let rowData = {
    id: "loading...",
    symbol: "loading...",
    totalAssets: "loading...",
    ownerAddress: "loading..."
  };
  if (!isLoading && data) {
    const [name, symbol, totalAssets, ownerAddress] = data;
    rowData = {
      id: name as unknown as string,
      symbol: symbol as unknown as string,
      totalAssets: ethers.utils.formatUnits(totalAssets, 18),
      ownerAddress: ownerAddress as unknown as string
    };
  }

  return (
    <tr key={rowData.id}>
      <td className="px-2 py-4 whitespace-nowrap"> {rowData.id} </td>
      <td className="flex px-2 py-4 items-center">
        <span> {rowData.symbol} </span>
      </td>
      <td className="px-2 py-4 whitespace-nowrap">{rowData.totalAssets}</td>
      <td className="px-2 py-4 whitespace-nowrap">{rowData.ownerAddress}</td>
    </tr>
  );
};
