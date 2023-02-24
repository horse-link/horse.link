import React from "react";
import { PageLayout } from "../components";
import { useLeaderboardStatistics } from "../hooks/stats";
import ClipLoader from "react-spinners/ClipLoader";
import { ethers } from "ethers";
import utils from "../utils";

const Leaderboard: React.FC = () => {
  const { stats, balances } = useLeaderboardStatistics();

  return (
    <PageLayout>
      <div className="flex w-full justify-center">
        <div className="rounded-md bg-white p-6">
          <h1 className="w-full text-center text-3xl font-bold">Leaderboard</h1>
          <br />
          {stats && balances ? (
            <React.Fragment>
              <div className="mb-2 grid grid-cols-8 gap-x-4 font-semibold">
                <text className="col-span-1 text-center">Rank</text>
                <text className="col-span-3 text-center">Address</text>
                <text className="col-span-2 text-center">Earnings</text>
                <text className="col-span-2 text-center">Balance</text>
              </div>
              <div className="grid grid-cols-8 gap-x-4 gap-y-2">
                {stats.map((stat, i) => {
                  const addressBalance = balances.find(
                    b => b.address.toLowerCase() === stat.address.toLowerCase()
                  )!;

                  return (
                    <React.Fragment>
                      <text className="col-span-1 text-center">{i + 1}</text>
                      <text className="col-span-3 text-center">
                        {stat.address}
                      </text>
                      <text className="col-span-2 text-center">
                        {utils.formatting.formatToFourDecimalsRaw(
                          ethers.utils.formatEther(stat.value)
                        )}{" "}
                        HL
                      </text>
                      <text className="col-span-2 text-center">
                        {utils.formatting.formatToFourDecimals(
                          addressBalance.formatted
                        )}{" "}
                        HL
                      </text>
                    </React.Fragment>
                  );
                })}
              </div>
            </React.Fragment>
          ) : (
            <div className="flex w-full justify-center">
              <ClipLoader />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Leaderboard;
