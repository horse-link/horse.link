import { FormattedVaultTransaction } from "../../types/entities";
import { VaultHistoryRow } from ".";
import { Config } from "../../types/config";

type Props = {
  history?: FormattedVaultTransaction[];
  config?: Config;
};

export const VaultHistoryTable: React.FC<Props> = ({ history, config }) => {
  return (
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
                Type
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Time
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Vault Name
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                TxID
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!history ? (
              <td className="p-2 select-none">loading...</td>
            ) : (
              history.map(vault => (
                <VaultHistoryRow vault={vault} key={vault.id} config={config} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)};
