import React from "react";
import { BaseTable } from ".";
import utils from "../../utils";
import { DataProps, HeaderProps, RowProps } from "../../types/table";
import { Runner } from "../../types/meets";
import Skeleton from "react-loading-skeleton";
import classnames from "classnames";
import { useWalletModal } from "../../providers/WalletModal";
import { useAccount } from "wagmi";

type Props = {
  runners?: Runner[];
  setSelectedRunner: (runner?: Runner) => void;
  setIsModalOpen: (open: boolean) => void;
};

export const RaceTable: React.FC<Props> = ({
  runners,
  setSelectedRunner,
  setIsModalOpen
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
  ): DataProps[] => {
    const { number, name, barrier, odds, handicapWeight, last5Starts } =
      runner || {};

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
        title: odds ? (
          utils.formatting.formatToTwoDecimals(odds.toString())
        ) : (
          <Skeleton width="2em" />
        ),
        classNames: isScratchedDataStyles(isScratched)
      }
    ];
  };

  const HEADERS: HeaderProps[] = [
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
    }
  ];

  const OPEN_BET_ROWS: RowProps[] = openBetRunners.map(runner => ({
    data: getRunnerData(false, runner),
    row: {
      classNames: isScratchedRowStyles(false),
      props: {
        onClick: () => onClickRunner(runner)
      }
    }
  }));

  const SCRATCHED_BET_ROWS: RowProps[] = scratchedRunners.map(runner => ({
    data: getRunnerData(true, runner),
    row: {
      classNames: isScratchedRowStyles(true)
    }
  }));

  return (
    <BaseTable
      headers={HEADERS}
      rows={[...OPEN_BET_ROWS, ...SCRATCHED_BET_ROWS]}
    />
  );
};
