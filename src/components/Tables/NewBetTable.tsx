import React from "react";
import { BetHistory } from "../../types/bets";
import { Config } from "../../types/config";
import { useAccount } from "wagmi";
import { useWalletModal } from "../../providers/WalletModal";
import { NewTable } from "./NewTable";
import classNames from "classnames";
import utils from "../../utils";
import { ethers } from "ethers";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Props = {
  allBetsEnabled: boolean;
  paramsAddressExists: boolean;
  betHistory?: Array<BetHistory>;
  config?: Config;
  setSelectedBet: (bet?: BetHistory) => void;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const NewBetTable: React.FC<Props> = ({
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

  const headers = [
    "#",
    "Punter",
    "Amount",
    "Time",
    "Race",
    "Proposition",
    "Status",
    "Result"
  ].map((text, i) => (
    <div
      key={`racetable-${text}-${i}`}
      className={classNames(
        "w-full py-4 text-left font-semibold text-hl-primary",
        {
          "!text-hl-secondary": [1, 4].includes(i)
        }
      )}
    >
      {text}
    </div>
  ));

  const rows =
    betHistory && config
      ? betHistory.map((bet, i) => {
          const formattedAmount =
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
          const isWinning =
            bet && bet.winningPropositionId
              ? bet.winningPropositionId.toLowerCase() ===
                bet.propositionId.toLowerCase()
              : undefined;

          const raceDetails =
            bet &&
            utils.id.getMarketDetailsFromId(
              utils.formatting.parseBytes16String(bet.marketId)
            );

          const style = "w-full text-left py-4 text-hl-tertiary";

          return [
            <div
              key={`racetable-bet-${bet.index}-${i}-index`}
              className={classNames(style, "font-basement")}
              onClick={() => onClickBet(bet)}
            >
              {bet.index}
            </div>,
            <div
              key={`racetable-bet-${bet.index}-${i}-punter`}
              className={classNames(
                style,
                "max-w-[20ch] truncate !text-hl-secondary"
              )}
              onClick={() => onClickBet(bet)}
            >
              {bet.punter}
            </div>,
            <div
              key={`racetable-bet-${bet.index}-${i}-formattedAmount`}
              className={style}
              onClick={() => onClickBet(bet)}
            >
              {formattedAmount}
            </div>,
            <div
              key={`racetable-bet-${bet.index}-${i}-blockNumber`}
              className={style}
              onClick={() => onClickBet(bet)}
            >
              {dayjs.unix(bet.blockNumber).fromNow()}
            </div>,
            <div
              key={`racetable-bet-${bet.index}-${i}-date`}
              className={classNames(style, "!text-hl-secondary")}
              onClick={() => onClickBet(bet)}
            >
              {raceDetails.date} {raceDetails.location} Race{" "}
              {raceDetails.raceNumber}
            </div>,
            <div
              key={`racetable-bet-${bet.index}-${i}-winningPropositionId`}
              className={style}
              onClick={() => onClickBet(bet)}
            >
              Horse {winningPropositionId} win
            </div>,
            <div
              key={`racetable-bet-${bet.index}-${i}-status`}
              className={style}
              onClick={() => onClickBet(bet)}
            >
              {bet.status}
            </div>,
            <div
              key={`racetable-bet-${bet.index}-${i}-isWinning`}
              className={style}
              onClick={() => onClickBet(bet)}
            >
              {isWinning ? "WON" : isWinning === undefined ? "IN PLAY" : "LOST"}
            </div>
          ];
        })
      : [];

  const notAllBetsAndNoParamAddress = [
    [
      <div key="bettable-notall-blank" />,
      <div className="py-4" key="bettable-notall-message">
        Connect your wallet or add an address to the URL
      </div>
    ]
  ];

  const noBets = [
    [
      <div key="bettable-nobets-blank" />,
      <div className="py-4" key="bettable-nobets-message">
        No bets!
      </div>
    ]
  ];

  const loading = [
    [
      <div key="bettable-loading-blank" />,
      <div className="py-4" key="bettable-loading-message">
        Loading...
      </div>
    ]
  ];

  return (
    <NewTable
      headers={headers}
      headerStyles="font-basement tracking-wider"
      rows={
        !allBetsEnabled && !paramsAddressExists
          ? notAllBetsAndNoParamAddress
          : !betHistory
          ? loading
          : !betHistory.length
          ? noBets
          : rows
      }
      rowStyles={classNames({
        "hover:bg-hl-primary cursor-pointer hover:!text-hl-secondary": !closed
      })}
    />
  );
};