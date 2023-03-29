import React from "react";
import { BaseTable } from ".";
import { BetHistory } from "../../types/bets";
import { Config } from "../../types/config";
import { useAccount } from "wagmi";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { useWalletModal } from "../../providers/WalletModal";
import utils from "../../utils";
import classnames from "classnames";
import Skeleton from "react-loading-skeleton";
import { ethers } from "ethers";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Props = {
  allBetsEnabled: boolean;
  paramsAddressExists: boolean;
  betHistory?: BetHistory[];
  config?: Config;
  setSelectedBet: (bet?: BetHistory) => void;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const BetTable: React.FC<Props> = ({
  allBetsEnabled,
  paramsAddressExists,
  betHistory,
  config,
  setSelectedBet,
  setIsModalOpen
}) => {
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const onClickBet = (bet?: BetHistory) => {
    if (!bet) return;
    if (!isConnected) return openWalletModal();
    setSelectedBet(bet);
    setIsModalOpen(true);
  };

  const getBetHistoryData = (bet?: BetHistory): TableData[] => {
    const formattedAmount = () =>
      config &&
      bet &&
      `${utils.formatting.formatToFourDecimals(
        ethers.utils.formatEther(bet.amount)
      )} ${
        config.tokens.find(
          token =>
            token.address.toLowerCase() === bet.assetAddress.toLowerCase()
        )?.symbol
      }`;

    const winningPropositionId =
      bet &&
      utils.id.getPropositionFromId(
        utils.formatting.parseBytes16String(bet.propositionId)
      );

    const raceDetails =
      bet &&
      utils.id.getMarketDetailsFromId(
        utils.formatting.parseBytes16String(bet.marketId)
      );

    return [
      {
        title: bet?.index ?? <Skeleton />,
        classNames: "bg-gray-200"
      },
      {
        title: bet?.punter ?? <Skeleton />,
        classNames: "!pl-5 !pr-2 !py-4 truncate"
      },
      {
        title: formattedAmount() ?? <Skeleton />
      },
      {
        title: bet ? dayjs.unix(bet.blockNumber).fromNow() : <Skeleton />
      },
      {
        title: raceDetails ? (
          `${raceDetails.date} ${raceDetails.location} Race ${raceDetails.raceNumber}`
        ) : (
          <Skeleton />
        ),
        classNames: "truncate"
      },
      {
        title: winningPropositionId ? (
          `Horse ${winningPropositionId} win`
        ) : (
          <Skeleton />
        ),
        classNames: "truncate"
      },
      {
        title: bet?.status ?? <Skeleton />
      }
    ];
  };

  const HEADERS: TableHeader[] = [
    {
      title: "#",
      classNames: "!px-1 !w-10 !bg-gray-200"
    },
    {
      title: "Punter"
    },
    {
      title: "Amount"
    },
    {
      title: "Time"
    },
    {
      title: "Race"
    },
    {
      title: "Proposition"
    },
    {
      title: "Status"
    }
  ];

  const ROWS: TableRow[] = (betHistory || utils.mocks.getMockBetHistory()).map(
    bet => {
      const data = getBetHistoryData(bet);
      return {
        data,
        row: {
          classNames: classnames("cursor-pointer hover:bg-gray-200", {
            "bg-emerald-300": bet?.status === "RESULTED",
            "bg-gray-300": bet?.status === "SETTLED",
            "bg-yellow-300": bet?.status === "SCRATCHED",
            // invalid bets are highlighted -- results from a bet that is settled, but has no result set
            "bg-red-600": bet?.status === "INVALID"
          }),
          props: {
            onClick: () => onClickBet(bet)
          }
        }
      };
    }
  );

  const TERNARY_ROWS =
    allBetsEnabled && paramsAddressExists
      ? utils.tables.getBlankRow(
          "Connect your wallet or add an address to the URL",
          HEADERS.length
        )
      : !betHistory
      ? utils.tables.getBlankRow("Loading...", HEADERS.length)
      : !betHistory.length
      ? utils.tables.getBlankRow("No bets", HEADERS.length)
      : ROWS;

  return <BaseTable headers={HEADERS} rows={TERNARY_ROWS} />;
};
