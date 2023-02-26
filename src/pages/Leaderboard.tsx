import React from "react";
import { PageLayout } from "../components";
import { useLeaderboardStatistics } from "../hooks/stats";
import ClipLoader from "react-spinners/ClipLoader";
import { ethers } from "ethers";
import utils from "../utils";

const Leaderboard: React.FC = () => {
  const { stats, balances, userStats } = useLeaderboardStatistics();
  // check if the user is in the top ten
  const isUserInTopTen =
    stats && userStats
      ? !!stats.find(
          stat => stat.address.toLowerCase() === userStats.address.toLowerCase()
        )
      : false;

  return (
    <PageLayout>
      <div className="flex w-full justify-center">
        <div className="rounded-lg bg-white p-6">
          <h1 className="w-full text-center text-3xl font-bold">Leaderboard</h1>
          <br />
          {stats && balances ? (
            <React.Fragment>
              <div className="mb-2 grid grid-cols-8 gap-x-4 font-semibold">
                <p className="col-span-1 text-center">Rank</p>
                <p className="col-span-3 text-center">Address</p>
                <p className="col-span-2 text-center">Earnings</p>
                <p className="col-span-2 text-center">Balance</p>
              </div>
              <div className="grid grid-cols-8 gap-x-4 gap-y-2">
                {stats.map((stat, i) => {
                  const addressBalance = balances.find(
                    b => b.address.toLowerCase() === stat.address.toLowerCase()
                  )!;

                  return (
                    <React.Fragment key={stat.address}>
                      <p className="col-span-1 text-center">{i + 1}</p>
                      <p className="col-span-3 truncate text-center">
                        {stat.address}
                      </p>
                      <p className="col-span-2 text-center">
                        {utils.formatting.formatToFourDecimalsRaw(
                          ethers.utils.formatEther(stat.value)
                        )}{" "}
                        HL
                      </p>
                      <p className="col-span-2 text-center">
                        {utils.formatting.formatToFourDecimals(
                          addressBalance.formatted
                        )}{" "}
                        HL
                      </p>
                    </React.Fragment>
                  );
                })}
              </div>
              <br />
              {!isUserInTopTen && userStats && (
                <React.Fragment>
                  <h2 className="w-full text-center text-xl font-bold">
                    Your Rank
                  </h2>
                  <div className="mb-2 grid grid-cols-8 gap-x-4 font-semibold">
                    <p className="col-span-1 text-center">Rank</p>
                    <p className="col-span-3 text-center">Address</p>
                    <p className="col-span-2 text-center">Earnings</p>
                    <p className="col-span-2 text-center">Balance</p>
                  </div>
                  <div className="grid grid-cols-8 gap-x-4 gap-y-2">
                    <p className="col-span-1 text-center">
                      {userStats.rank + 1}
                    </p>
                    <p className="col-span-3 truncate text-center">
                      {userStats.address}
                    </p>
                    <p className="col-span-2 text-center">
                      {utils.formatting.formatToFourDecimalsRaw(
                        ethers.utils.formatEther(userStats.earnings.value)
                      )}{" "}
                      HL
                    </p>
                    <p className="col-span-2 text-center">
                      {utils.formatting.formatToFourDecimals(
                        userStats.balance.formatted
                      )}{" "}
                      HL
                    </p>
                  </div>
                </React.Fragment>
              )}
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
