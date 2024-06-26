import React, { useEffect, useState } from "react";
import { PageLayout } from "../components";
import {
  HomeOverallStats,
  // HomeUserStats,
  HomeFilterGroup,
  HomeNextToJumpBanner
} from "../components/Home";
import constants from "../constants";
import { useApi } from "../providers/Api";
import { HomeTable } from "../components/Tables";
import { Button } from "../components/Buttons";
import { Meet, SignedMeetingsResponse, MeetFilters } from "horselink-sdk";

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
        <div className="hidden lg:block">
          <HomeOverallStats />
        </div>
        <HomeNextToJumpBanner />
        <div className="flex w-full justify-between">
          <Button text="today" onClick={() => {}} disabled />
          <div className="hidden lg:block">
            <HomeFilterGroup
              value={meetsFilter}
              onChange={onFilterChange}
              disabled={isLoading}
            />
          </div>
        </div>
        <HomeTable meets={meets} />
        <div className="block py-10 lg:hidden" />
      </div>
    </PageLayout>
  );
};

export default Home;
