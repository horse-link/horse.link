import classnames from "classnames";
import { ethers } from "ethers";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import { BetHistory } from "../../types/bets";
import { Config } from "../../types/config";
import utils from "../../utils";

type Props = {
  config?: Config;
  betData: BetHistory;
  onClick: () => void;
};

export const BetRow: React.FC<Props> = ({ config, betData, onClick }) => {
  const formattedAmount = () =>
    config ? (
      `${utils.formatting.formatToFourDecimals(
        ethers.utils.formatEther(betData.amount)
      )} ${
        config.tokens.find(
          token =>
            token.address.toLowerCase() === betData.assetAddress.toLowerCase()
        )?.symbol
      }`
    ) : (
      <Skeleton />
    );

  const winningPropositionId = utils.id.getPropositionFromId(
    utils.formatting.parseBytes16String(betData.propositionId)
  );

  const raceDetails = utils.id.getMarketDetailsFromId(
    utils.formatting.parseBytes16String(betData.marketId)
  );

  return (
    <tr
      key={betData.propositionId}
      onClick={onClick}
      className={classnames(
        "cursor-pointer hover:bg-gray-100",
        {
          "bg-emerald-300": betData.status === "RESULTED"
        },
        {
          "bg-gray-300": betData.status === "SETTLED"
        }
      )}
    >
      <td className="px-2">{betData.index}</td>
      <td className="pl-5 pr-2 py-4 truncate">
        {betData.punter ?? <Skeleton />}
      </td>
      <td className="px-2 py-4">{formattedAmount()}</td>
      <td className="px-2 py-4">
        {moment.unix(betData.blockNumber).fromNow() ?? <Skeleton />}
      </td>
      <td className="px-2 py-4 truncate">
        {`${raceDetails.date} ${raceDetails.location} Race ${raceDetails.raceNumber}` ?? (
          <Skeleton />
        )}
      </td>
      <td className="px-2 py-4 truncate">
        {winningPropositionId ? (
          `Horse ${winningPropositionId} win`
        ) : (
          <Skeleton />
        )}
      </td>
    </tr>
  );
};
