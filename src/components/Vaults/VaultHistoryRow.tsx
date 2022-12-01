import { ethers } from "ethers";
import moment from "moment";
import { FormattedVaultTransaction } from "../../types/entities";
import Skeleton from "react-loading-skeleton";
import { Config } from "../../types/config";
import utils from "../../utils";
import { VaultTransactionType } from "../../types/vaults";

const txTypeMap = new Map([
  [VaultTransactionType.WITHDRAW, "Withdrawal"],
  [VaultTransactionType.DEPOSIT, "Deposit"]
]);

type Props = {
  vault: FormattedVaultTransaction;
  config?: Config;
};

export const VaultHistoryRow: React.FC<Props> = ({ vault, config }) => {
  const formattedTxType = txTypeMap.get(vault.type);
  const details = utils.config.getVault(vault.vaultAddress, config);

  return (
    <tr>
      <td className="pl-5 pr-2 py-4 whitespace-nowrap">{formattedTxType}</td>
      <td className="px-2 py-4">
        {`${formatToFourDecimals(ethers.utils.formatEther(vault.amount))}`}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {moment.unix(vault.timestamp).fromNow()}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        {details ? details.name : <Skeleton />}
      </td>
      <td className="px-2 py-4 whitespace-nowrap">
        <a
          href={`${process.env.VITE_SCANNER_URL}/tx/${vault.id.toLowerCase()}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-blue-600"
        >
          {utils.formatting.shortenHash(vault.id)}
        </a>
      </td>
    </tr>
  );
};
