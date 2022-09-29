import { useContractReads } from "wagmi";
import { PageLayout } from "../../components";
import vaultContractJson from "../../abi/Vault.json";
import mockTokenContractJson from "../../abi/MockToken.json";
import { ethers } from "ethers";

type Props = {
  vaultAddressList: string[];
  onClickVault: (vaultAddress: string) => void;
};

const VaultsView: React.FC<Props> = ({ vaultAddressList, onClickVault }) => {
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
                      Supplied
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
      </div>
    </PageLayout>
  );
};

export default VaultsView;

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
        functionName: "totalSupply"
      },
      {
        ...vaultContract,
        functionName: "owner"
      },
      {
        ...vaultContract,
        functionName: "asset"
      }
    ]
  });
  const tokenAddress = vaultData?.[2].toString();
  const tokenContract = {
    addressOrName: tokenAddress || "",
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
    ]
  });
  let rowData = {
    id: "loading...",
    symbol: "loading...",
    supplied: "loading...",
    ownerAddress: "loading..."
  };
  if (vaultData && tokenData) {
    const [bNTotalSupply, ownerAddress] = vaultData;
    const [name, symbol, decimals] = tokenData;
    rowData = {
      id: name as unknown as string,
      symbol: symbol as unknown as string,
      supplied: ethers.utils.formatUnits(bNTotalSupply, decimals),
      ownerAddress: ownerAddress as unknown as string
    };
  }

  return (
    <tr key={rowData.id} onClick={onClick} className="cursor-pointer">
      <td className="px-2 py-4 whitespace-nowrap"> {rowData.id} </td>
      <td className="flex px-2 py-4 items-center">
        <span> {rowData.symbol} </span>
      </td>
      <td className="px-2 py-4 whitespace-nowrap">{rowData.supplied}</td>
      <td className="px-2 py-4 whitespace-nowrap">{rowData.ownerAddress}</td>
    </tr>
  );
};
