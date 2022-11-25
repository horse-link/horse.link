import { BetHistory } from "../../types";
import { BetRows, BetTablePageSelector } from ".";
import React from "react";

type Props = {
  myBetsEnabled: boolean;
  onClickBet: (bet?: BetHistory) => void;
  page: number;
  setPage: (page: number) => void;
  totalBetHistory: BetHistory[] | undefined;
  userBetHistory: BetHistory[] | undefined;
  userMaxPages: number;
  totalMaxPages: number;
};

export const BetTable: React.FC<Props> = ({
  myBetsEnabled,
  onClickBet,
  page,
  setPage,
  totalBetHistory,
  userBetHistory,
  userMaxPages,
  totalMaxPages
}) => (
  <React.Fragment>
    <div className="col-span-2 bg-gray-50 rounded-xl overflow-auto">
      <div className="shadow-sm overflow-hidden mt-2 mb-5">
        <table className="border-collapse table-fixed w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-center">
              <th
                scope="col"
                className="pl-5 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Punter
              </th>
              <th
                scope="col"
                className="px-2 py-3 w-40 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-2 py-3 w-32 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Time
              </th>
              <th
                scope="col"
                className="px-2 py-3  text-left text-xs font-medium text-gray-500 uppercase"
              >
                Market ID
              </th>
              <th
                scope="col"
                className="pl-2 pr-5 py-3  text-left text-xs font-medium text-gray-500 uppercase"
              >
                Proposition ID
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <BetRows
              myBetsSelected={myBetsEnabled}
              bets={myBetsEnabled ? userBetHistory : totalBetHistory}
              onClickBet={onClickBet}
            />
          </tbody>
        </table>
      </div>
    </div>
    <BetTablePageSelector
      page={page}
      maxPages={myBetsEnabled ? userMaxPages : totalMaxPages}
      setPage={setPage}
    />
  </React.Fragment>
);
