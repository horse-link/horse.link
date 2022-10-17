import Skeleton from "react-loading-skeleton";
import { useContractReads } from "wagmi";
import { PageLayout } from "../../components";
import marketContractJson from "../../abi/Market.json";

type Props = {
  marketAddressList: string[];
  onClickMarket: (marketAddress: string) => void;
};
const MarketView = ({ marketAddressList, onClickMarket }: Props) => {
  return (
    <PageLayout requiresAuth={false}>
      <div className="flex flex-col">
        <h3 className="text-lg mb-3 font-medium text-gray-900">Markets </h3>
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
                    className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Target
                  </th>
                  <th
                    scope="col"
                    className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Total In Play
                  </th>

                  <th
                    scope="col"
                    className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Market Address
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
                {marketAddressList.map(v => (
                  <Row
                    marketAddress={v}
                    key={v}
                    onClick={() => onClickMarket(v)}
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
export default MarketView;

type RowProps = {
  marketAddress?: string;
  onClick?: () => void;
};
const Row = ({ marketAddress, onClick }: RowProps) => {
  const marketContract = {
    addressOrName: marketAddress?.toString() || "",
    contractInterface: marketContractJson.abi
  };
  const { data: marketData } = useContractReads({
    contracts: [
      {
        ...marketContract,
        functionName: "getTarget"
      },
      {
        ...marketContract,
        functionName: "getTotalInPlay"
      },
      {
        ...marketContract,
        functionName: "getVaultAddress"
      }
    ],
    enabled: !!marketAddress
  });
  const [target, totalInPlay, vaultAddress] = marketData ?? [];
  const rowData = {
    id: "",
    target: Number(target),
    totalInPlay: Number(totalInPlay),
    marketAddress,
    vaultAddress
  };
  return (
    <tr
      key={rowData.id}
      onClick={onClick}
      className="cursor-pointer hover:bg-gray-100"
    >
      <td className="pl-5 pr-2 py-4 whitespace-nowrap">
        {rowData.id || <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {rowData.target || <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {rowData.totalInPlay || <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {rowData.marketAddress || <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {rowData.vaultAddress || <Skeleton />}
      </td>
    </tr>
  );
};
