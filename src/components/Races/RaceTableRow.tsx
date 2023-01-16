import classnames from "classnames";
import React from "react";
import Skeleton from "react-loading-skeleton";
import { TotalBetsOnPropositions } from "../../types/bets";
import { Runner } from "../../types/meets";
import utils from "../../utils";
import {
  formatBytes16String,
  formatNumberWithCommas,
  formatToFourDecimals
} from "../../utils/formatting";

type Props = {
  runner?: Runner;
  isScratched?: boolean;
  openWalletModal: () => void;
  isConnected: boolean;
  setSelectedRunner: (runner?: Runner) => void;
  setIsModalOpen: (open: boolean) => void;
  totalBetsOnPropositions?: TotalBetsOnPropositions;
};

export const RaceTableRow: React.FC<Props> = ({
  runner,
  isScratched,
  setIsModalOpen,
  setSelectedRunner,
  openWalletModal,
  isConnected,
  totalBetsOnPropositions
}) => {
  const openDialog = () => {
    if (!isConnected) return openWalletModal();

    setIsModalOpen(true);
  };
  const onClickRunner = (runner?: Runner) => {
    if (!runner) return;
    setSelectedRunner(runner);
    openDialog();
  };
  const {
    number,
    name,
    barrier,
    odds,
    handicapWeight,
    last5Starts,
    proposition_id
  } = runner || {};

  const b16PropositionId = formatBytes16String(proposition_id ?? "");
  const betData = totalBetsOnPropositions?.[b16PropositionId];

  return (
    <tr
      className={classnames({
        "cursor-pointer hover:bg-gray-100": !isScratched
      })}
      onClick={() => {
        if (!isScratched) {
          onClickRunner(runner);
        }
      }}
    >
      <td className="px-1 py-4 whitespace-nowrap bg-gray-200">
        {number ?? <Skeleton />}
      </td>
      <td
        className={classnames("px-2 py-4 whitespace-nowrap", {
          "line-through": isScratched
        })}
      >
        {name ? `${name} (${barrier ?? "?"})` : <Skeleton width="10em" />}
      </td>
      <td
        className={classnames("px-2 py-4 whitespace-nowrap", {
          "line-through": isScratched
        })}
      >
        {name ? `${last5Starts ?? "-"}` : <Skeleton width="2em" />}
      </td>

      <td
        className={classnames("px-2 py-4 whitespace-nowrap", {
          "line-through": isScratched
        })}
      >
        {name ? `${handicapWeight}` : <Skeleton width="2em" />}
      </td>
      <td
        className={classnames("px-2 py-4 whitespace-nowrap", {
          "line-through": isScratched
        })}
      >
        {odds ? (
          utils.formatting.formatToTwoDecimals(odds.toString())
        ) : (
          <Skeleton width="2em" />
        )}
      </td>
      <td
        className={classnames("px-2 py-4 whitespace-nowrap", {
          "line-through": isScratched
        })}
      >
        {totalBetsOnPropositions ? (
          `$ ${formatNumberWithCommas(betData?.amount?.toString() ?? "0")}`
        ) : (
          <Skeleton width="2em" />
        )}
      </td>
      <td
        className={classnames("px-2 py-4 whitespace-nowrap", {
          "line-through": isScratched
        })}
      >
        {totalBetsOnPropositions ? (
          `${formatToFourDecimals(betData?.percentage?.toString() ?? "0")} %`
        ) : (
          <Skeleton width="2em" />
        )}
      </td>
    </tr>
  );
};
