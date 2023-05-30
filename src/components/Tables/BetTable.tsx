import React from "react";
import { BetHistoryResponse2 } from "../../types/bets";
import { Config } from "../../types/config";
import { useAccount } from "wagmi";
import { useWalletModal } from "../../providers/WalletModal";
import { NewTable } from "./NewTable";
import classNames from "classnames";
import utils from "../../utils";
import { ethers } from "ethers";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Loader } from "../Loader";
import { useScannerUrl } from "../../hooks/useScannerUrl";

dayjs.extend(relativeTime);

type Props = {
  allBetsEnabled: boolean;
  paramsAddressExists: boolean;
  betHistory?: Array<BetHistoryResponse2>;
  config?: Config;
  // setSelectedBet: (bet?: BetHistoryResponse2) => void;
  setIsModalOpen: (isOpen: boolean) => void;
};

export const BetTable: React.FC<Props> = ({
  allBetsEnabled,
  paramsAddressExists,
  betHistory,
  config,
  // setSelectedBet,
  setIsModalOpen
}) => {
  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();
  const scanner = useScannerUrl();

  const onClickBet = (bet?: BetHistoryResponse2) => {
    if (!bet) return;
    if (!isConnected) return openWalletModal();
    // setSelectedBet(bet);
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
        "w-full py-4 text-left text-xs font-semibold text-hl-primary xl:text-base",
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
          // const formattedAmount =
          //   config &&
          //   bet &&
          //   `${utils.formatting.formatToFourDecimals(
          //     ethers.utils.formatEther(bet.amount)
          //   )} ${
          //     config.tokens.find(
          //       token =>
          //         token.address.toLowerCase() === bet.assetAddress.toLowerCase()
          //     )?.symbol
          //   }`;

          const formattedAmount =
            config &&
            bet &&
            `${utils.formatting.formatToFourDecimals(
              ethers.utils.formatEther(bet.amount)
            )} `;

          const winningPropositionId =
            bet && utils.id.getPropositionFromId(bet.proposition);

          // const isWinning =
          //   bet && bet.winningPropositionId
          //     ? bet.winningPropositionId.toLowerCase() ===
          //       bet.propositionId.toLowerCase()
          //     : undefined;

          // const raceDetails =
          //   bet && utils.id.getMarketDetailsFromId(bet.marketId);

          const raceDetails = bet.race;

          const style =
            "w-full text-left py-4 text-hl-tertiary text-xs xl:text-base";

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
                "max-w-[10ch] truncate !text-hl-secondary xl:max-w-[20ch]"
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
              {dayjs.unix(bet.time).fromNow()}
            </div>,
            <div
              key={`racetable-bet-${bet.index}-${i}-date`}
              className={classNames(style, "!text-hl-secondary")}
              onClick={() => onClickBet(bet)}
            >
              {raceDetails}
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
              {bet.status}
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
    <React.Fragment>
      {/* non-mobile */}
      <div className="hidden lg:block">
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
            "hover:bg-hl-primary cursor-pointer hover:!text-hl-secondary":
              !closed
          })}
        />
      </div>

      {/* mobile */}
      <div className="block lg:hidden">
        {!allBetsEnabled && !paramsAddressExists ? (
          <div className="flex w-full flex-col items-center gap-y-2 border-t border-hl-border py-2 text-center">
            Connect your wallet or add an address to the URL
          </div>
        ) : !betHistory || !config ? (
          <div className="flex w-full justify-center py-10">
            <Loader />
          </div>
        ) : !betHistory.length ? (
          <div className="flex w-full flex-col items-center gap-y-2 border-t border-hl-border py-2 text-center">
            No bets!
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            {betHistory.map(bet => {
              const formattedAmount =
                config &&
                bet &&
                `${utils.formatting.formatToFourDecimals(
                  ethers.utils.formatEther(bet.amount)
                )}
                }`;

              // const winningPropositionId = "";

              const raceDetails = bet && bet.race;

              return (
                <div
                  key={JSON.stringify(bet)}
                  className="flex w-full flex-col items-center gap-y-2 border-t border-hl-border py-2 text-center"
                  onClick={() => onClickBet(bet)}
                >
                  <h2 className="font-basement tracking-wider text-hl-secondary">
                    {bet.index} {bet.status}
                  </h2>
                  <p>{raceDetails}</p>
                  <p className="text-hl-secondary">{formattedAmount}</p>
                  <a
                    href={`${scanner}/address/${bet.punter}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full max-w-full truncate"
                  >
                    Punter: {bet.punter}
                  </a>
                  <a
                    href={`${scanner}/tx/${bet.tx}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full max-w-full truncate"
                  >
                    TxID: {bet.tx}
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
