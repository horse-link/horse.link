import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useAccount } from "wagmi";
import api from "../apis/Api";
import { Toggle, PageLayout } from "../components";
import {
  DashboardOverallStats,
  DashboardUserStats,
  DashboardFilterGroup,
  DashboardNextToJumpBanner
} from "../components/Dashboard";
import { DashboardTable } from "../components/Tables";
import { useWalletModal } from "../providers/WalletModal";
import { SignedMeetingsResponse, MeetFilters, Meet } from "../types/meets";
import constants from "../constants";

export const Dashboard: React.FC = () => {
  const [response, setResponse] = useState<SignedMeetingsResponse>();
  const [meets, setMeets] = useState<Meet[]>();
  const [myPlayEnabled, setMyPlayEnabled] = useState(false);
  const [meetsFilter, setMeetsFilter] = useState<MeetFilters>("ALL");
  const { openWalletModal } = useWalletModal();
  const { isConnected } = useAccount();

  useEffect(() => {
    (async () => {
      const response = await api.getMeetings();
      setResponse(response);
    })();
  }, []);

  useEffect(() => {
    if (!response) return;
    // error encountered that if meetings was empty it would return as an empty *object* rather than array
    if (!Array.isArray(response.data.meetings)) return;

    switch (meetsFilter) {
      case "AUS_NZ":
        setMeets(
          response.data.meetings.filter(meet =>
            constants.locations.AUS_NZ_LOCATIONS.includes(meet.location)
          )
        );
        break;
      case "INTERNATIONAL":
        setMeets(
          response.data.meetings.filter(
            meet =>
              !constants.locations.AUS_NZ_LOCATIONS.includes(meet.location)
          )
        );
        break;
      default:
        setMeets(response.data.meetings);
        break;
    }
  }, [response, meetsFilter]);

  useEffect(() => {
    if (myPlayEnabled && !isConnected) {
      openWalletModal();
    }
  }, [myPlayEnabled, isConnected]);

  const onMyPlayToggle = () => setMyPlayEnabled(prev => !prev);
  const onFilterChange = (option: MeetFilters) => {
    setMeetsFilter(option);
  };
  const isLoading = !response;
  return (
    <PageLayout>
      <DashboardNextToJumpBanner />
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
        <div className="flex w-full gap-x-3 justify-between md:justify-end">
          <DashboardFilterGroup
            value={meetsFilter}
            onChange={onFilterChange}
            disabled={isLoading}
          />
        </div>
        <div className="flex gap-3 self-end justify-self-end">
          <Toggle enabled={myPlayEnabled} onChange={onMyPlayToggle} />
          <div>My Stats</div>
        </div>
        <DashboardTable meets={meets} />
        <div className="flex justify-center px-4 py-5 bg-white shadow rounded-lg sm:p-6 lg:mb-10">
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
