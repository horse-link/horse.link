import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useAccount } from "wagmi";
import api from "../apis/Api";
import { Toggle, PageLayout } from "../components";
import {
  DashboardOverallStats,
  DashboardTable,
  DashboardUserStats
} from "../components/Dashboard";
import { useWalletModal } from "../providers/WalletModal";
import { SignedMeetingsResponse } from "../types/meets";
import utils from "../utils";

export const Dashboard: React.FC = () => {
  const [response, setResponse] = useState<SignedMeetingsResponse>();
  const [myPlayEnabled, setMyPlayEnabled] = useState(false);
  const { openWalletModal } = useWalletModal();
  const { isConnected } = useAccount();

  useEffect(() => {
    (async () => {
      const response = await api.getMeetings();
      setResponse(response);
    })();
  }, []);

  useEffect(() => {
    if (myPlayEnabled && !isConnected) {
      openWalletModal();
    }
  }, [myPlayEnabled, isConnected]);

  const onMyPlayToggle = () => setMyPlayEnabled(prev => !prev);

  return (
    <PageLayout>
      <div className="grid gap-6">
        <div>
          <div className="container-fluid px-4 py-5 bg-emerald-700 shadow rounded-lg overflow-hidden sm:p-6">
            <div className="flex flex-wrap justify-between">
              <img
                loading="lazy"
                alt="Horse-Link"
                src="/images/horse-link.png"
                className="mt-2 mb-8"
              />
              <img
                loading="lazy"
                alt="Horse"
                src="/images/horse.png"
                className="h-20"
              />
            </div>
            <h2 className="text-lg mb-3 font-medium text-gray-900">
              Horse Link is an Ethereum AMM protocol that allows participants to
              wager on sports markets using ERC20 tokens.
            </h2>
            <p className="text-xs my-2">
              Horse Link&apos;s smart contract guaranteed bets are always placed
              within the slippage band of the constant product function. Like
              other AMM protocols based on curve functions, bets based within
              the range of slippage based on the payout will be placed.
            </p>
          </div>
          {myPlayEnabled ? <DashboardUserStats /> : <DashboardOverallStats />}
        </div>
        <div className="flex gap-3 self-end justify-self-end">
          <Toggle enabled={myPlayEnabled} onChange={onMyPlayToggle} />
          <div>My Stats</div>
        </div>
        <div className="-mt-12">
          <DashboardTable
            meets={response?.data.meetings || utils.mocks.getMockMeets()}
          />
        </div>
        <div className="flex justify-center px-4 py-5 bg-white shadow rounded-lg sm:p-6">
          <div className="w-4/5 max-w-2xl">
            <div className="flex flex-col items-center">
              <h2 className="text-lg">Signature :</h2>
              <h2 className="break-all">
                {response?.signature || <Skeleton width={"25em"} count={2} />}
              </h2>
            </div>
            <div className="mt-3 flex flex-col items-center">
              <h2 className="text-lg">Owner Address :</h2>
              <h2 className="break-all">
                {response?.owner || <Skeleton width={"25em"} />}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
