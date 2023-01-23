import React, { useEffect, useState } from "react";
import { useBetSlipContext } from "../context/BetSlipContext";
import classnames from "classnames";
import { ethers } from "ethers";
import utils from "../utils";
import { useConfig } from "../providers/Config";
import { PlaceBetSlipButton, ClearBetSlipButton } from "./Buttons";
import constants from "../constants";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const BetSlip: React.FC = () => {
  const [currentTimestamp, setCurrentTimestamp] = useState(
    Math.floor(Date.now() / 1000)
  );

  useEffect(() => {
    const setTime = () => setCurrentTimestamp(Math.floor(Date.now() / 1000));
    // set time every 5 seconds
    const interval = setInterval(setTime, constants.time.ONE_SECOND_MS * 5);

    return () => clearInterval(interval);
  }, []);

  const config = useConfig();
  const { bets, removeBet } = useBetSlipContext();

  return (
    <div className="mx-4 w-full shadow-lg sticky top-4">
      <h2 className="w-full bg-indigo-600 p-6 rounded-t-lg text-center font-bold text-3xl text-white">
        Bet Slip
      </h2>
      <div className="bg-white p-2 rounded-b-lg">
        <div className="py-4 px-2 border-emerald-500 border-2 rounded-b-lg">
          {!bets?.length ? (
            <div className="w-full text-center">No Bets</div>
          ) : (
            <div className="flex flex-col divide-y divide-black max-h-[calc(50vh)] overflow-y-scroll px-4 scrollbar-thin scrollbar-thumb-indigo-600">
              {bets.map((bet, _, array) => (
                <div
                  key={`${bet.back.proposition_id}-${bet.timestamp}`}
                  className={classnames(
                    "w-full grid grid-cols-10 grid-rows-1",
                    {
                      "pt-4": bet.id !== 0,
                      "pb-4": bet.id !== array.length - 1
                    }
                  )}
                >
                  <div className="col-span-1 pr-6 flex flex-col justify-center items-center text-black/50 font-semibold">
                    {bet.id}
                  </div>
                  <div className="col-span-8 flex flex-col">
                    <div className="flex justify-between">
                      <h4 className="font-bold">{bet.runner.name}</h4>
                      <span className="font-normal block italic text-black/50">
                        {/* take away 5 seconds to prevent "in a few seconds" bug */}
                        {dayjs(dayjs.unix(bet.timestamp - 5)).from(
                          dayjs.unix(currentTimestamp)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="block">
                        {utils.formatting.formatToFourDecimals(
                          ethers.utils.formatUnits(
                            bet.wager,
                            utils.config.getVaultFromMarket(bet.market, config)
                              ?.asset.decimals
                          )
                        )}{" "}
                        {
                          utils.config.getVaultFromMarket(bet.market, config)
                            ?.asset.symbol
                        }
                      </span>
                      <span className="block">
                        {utils.formatting.formatToTwoDecimals(
                          bet.back.odds.toString()
                        )}{" "}
                        Win
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 pl-5 flex flex-col justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="black"
                      className="h-5 cursor-pointer"
                      onClick={() => removeBet(bet.id)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {bets?.length && (
          <div className="mt-2 grid grid-cols-5 grid-rows-1 gap-x-2">
            <div className="col-span-4">
              <PlaceBetSlipButton />
            </div>
            <div className="col-span-1">
              <ClearBetSlipButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
