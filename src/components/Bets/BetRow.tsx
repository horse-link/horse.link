import classnames from "classnames";
import { ethers } from "ethers";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import { BetHistory } from "../../types";
import { Config } from "../../types/config";
import {
  formatToFourDecimals,
  parseBytes16String
} from "../../utils/formatting";

type Props = {
  config?: Config;
  betData: BetHistory;
  onClick?: () => void;
};

export const BetRow: React.FC<Props> = ({ config, betData, onClick }) => {
  const formattedAmount = () =>
    config ? (
      `${formatToFourDecimals(ethers.utils.formatEther(betData.amount))} ${
        config.tokens.find(
          token =>
            token.address.toLowerCase() === betData.assetAddress.toLowerCase()
        )?.symbol
      }`
    ) : (
      <Skeleton />
    );

  return (
    <tr
      key={betData.propositionId}
      onClick={onClick}
      className={classnames(
        "cursor-pointer hover:bg-gray-100",
        {
          "bg-emerald-300":
            (betData.winningPropositionId || betData.marketResultAdded) &&
            !betData.settled
        },
        {
          "bg-gray-300": betData.settled
        }
      )}
    >
      <td className="pl-5 pr-2 py-4 truncate">
        {betData.punter ?? <Skeleton />}
      </td>
      <td className="px-2 py-4">{formattedAmount()}</td>
      <td className="px-2 py-4">
        {moment.unix(betData.blockNumber).fromNow() ?? <Skeleton />}
      </td>
      <td className="px-2 py-4 truncate">
        {parseBytes16String(betData.marketId) ?? <Skeleton />}
      </td>
      <td className="px-2 py-4 truncate">
        {parseBytes16String(betData.propositionId) ?? <Skeleton />}
      </td>
    </tr>
  );
};
