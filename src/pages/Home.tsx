import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { PageLayout } from "../components";
import {
  HomeOverallStats,
  // HomeUserStats,
  HomeFilterGroup,
  HomeNextToJumpBanner
} from "../components/Home";
import { HomeTable } from "../components/Tables";
import { SignedMeetingsResponse, MeetFilters, Meet } from "../types/meets";
import constants from "../constants";
import { useApi } from "../providers/Api";

const Home: React.FC = () => {
  const [response, setResponse] = useState<SignedMeetingsResponse>();
  const [meets, setMeets] = useState<Meet[]>();
  const [meetsFilter, setMeetsFilter] = useState<MeetFilters>("ALL");

  const api = useApi();

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

  const onFilterChange = (option: MeetFilters) => {
    setMeetsFilter(option);
  };

  const isLoading = !response;

  return (
    <PageLayout>
      <div className="grid w-full gap-6">
        <HomeOverallStats />
        <HomeNextToJumpBanner />
        <div className="flex w-full justify-between gap-x-3 md:justify-end">
          <HomeFilterGroup
            value={meetsFilter}
            onChange={onFilterChange}
            disabled={isLoading}
          />
        </div>
        <HomeTable meets={meets} />
        <div className="flex justify-center rounded-lg bg-white px-4 py-5 shadow sm:p-6 lg:mb-10">
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

export default Home;
