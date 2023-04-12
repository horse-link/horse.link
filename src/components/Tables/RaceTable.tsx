import React from "react";
import { BaseTable } from ".";
import utils from "../../utils";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { Runner } from "../../types/meets";
import Skeleton from "react-loading-skeleton";
import classnames from "classnames";
import { useWalletModal } from "../../providers/WalletModal";
import { useAccount } from "wagmi";
import { TotalBetsOnPropositions } from "../../types/bets";
import { ethers } from "ethers";

type Props = {
  runners?: Runner[];
  totalBetsOnPropositions?: TotalBetsOnPropositions;
  setSelectedRunner: (runner?: Runner) => void;
  setIsModalOpen: (open: boolean) => void;
  closed: boolean;
};

export const RaceTable: React.FC<Props> = ({
  runners,
  totalBetsOnPropositions,
  setSelectedRunner,
  setIsModalOpen,
  closed
}) => {
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const openBetRunners =
    runners?.filter(runner => !utils.races.isScratchedRunner(runner)) ??
    utils.mocks.getMockRunners();

  const scratchedRunners =
    runners?.filter(utils.races.isScratchedRunner) ??
    utils.mocks.getMockRunners();

  const isScratchedRowStyles = (isScratched: boolean) =>
    classnames({
      "cursor-pointer hover:bg-gray-100": !isScratched
    });

  const isScratchedDataStyles = (isScratched: boolean) =>
    classnames({
      "line-through": isScratched
    });

  const isClosedRowStyles = (isClosed: boolean) =>
    classnames({
      "cursor-pointer hover:bg-gray-100": !isClosed
    });

  const openDialog = () => {
    if (!isConnected) return openWalletModal();
    setIsModalOpen(true);
  };

  const onClickRunner = (runner?: Runner) => {
    if (!runner) return;
    setSelectedRunner(runner);
    openDialog();
  };

  const getRunnerData = (
    isScratched: boolean,
    runner?: Runner
  ): TableData[] => {
    const {
      number,
      name,
      barrier,
      odds = 0,
      handicapWeight,
      last5Starts,
      proposition_id
    } = runner || {};

    const stats = totalBetsOnPropositions?.[proposition_id || ""];
    const formattedBacked = stats
      ? ethers.utils.formatEther((+stats.amount).toString())
      : "0.0000";

    return [
      {
        title: number ?? <Skeleton />,
        classNames: "bg-gray-200"
      },
      {
        title: name ? `${name} (${barrier ?? "?"})` : <Skeleton width="10em" />,
        classNames: isScratchedDataStyles(isScratched)
      },
      {
        title: name ? `${last5Starts ?? "-"}` : <Skeleton width="2em" />,
        classNames: isScratchedDataStyles(isScratched)
      },
      {
        title: name ? `${handicapWeight}` : <Skeleton width="2em" />,
        classNames: isScratchedDataStyles(isScratched)
      },
      {
        title: runner ? (
          utils.formatting.formatToTwoDecimals(odds.toString())
        ) : (
          <Skeleton width="2em" />
        ),
        classNames: isScratchedDataStyles(isScratched)
      },
      {
        title: !totalBetsOnPropositions ? (
          <Skeleton width="3.5em" />
        ) : (
          `$${utils.formatting.formatToFourDecimals(formattedBacked)}`
        ),
        classNames: isScratchedDataStyles(isScratched)
      },
      {
        title: !totalBetsOnPropositions ? (
          <Skeleton width="4em" />
        ) : (
          `${utils.formatting.formatToFourDecimals(
            stats?.percentage.toString() || "0"
          )}%`
        ),
        classNames: isScratchedDataStyles(isScratched)
      }
    ];
  };

  const HEADERS: TableHeader[] = [
    {
      title: "#",
      classNames: "!px-1 !w-10 !bg-gray-200"
    },
    {
      title: "Runner (Barrier)"
    },
    {
      title: "Form"
    },
    {
      title: "Weight"
    },
    {
      title: "Win"
    },
    {
      title: "Backed"
    },
    {
      title: "Proportion"
    }
  ];

  const OPEN_BET_ROWS: TableRow[] = openBetRunners.map(runner => ({
    data: getRunnerData(false, runner),
    row: {
      classNames: isClosedRowStyles(closed),
      props: {
        onClick: () => onClickRunner(runner)
      }
    }
  }));

  const SCRATCHED_BET_ROWS: TableRow[] = scratchedRunners.map(runner => ({
    data: getRunnerData(true, runner),
    row: {
      classNames: isScratchedRowStyles(closed)
    }
  }));

  return (
    <BaseTable
      headers={HEADERS}
      rows={[...OPEN_BET_ROWS, ...SCRATCHED_BET_ROWS]}
    />
  );
};
