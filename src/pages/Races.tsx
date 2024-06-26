import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRunnersData, useMeetData, useBetsData } from "../hooks/data";
import { RacesButton } from "../components/Buttons";
import { BetTable, RaceTable } from "../components/Tables";
import { BetModal, SettleBetModal } from "../components/Modals";
import { Loader, PageLayout } from "../components";
import { useSubgraphBets } from "../hooks/subgraph";
import { useConfig } from "../providers/Config";
import constants from "../constants";
import dayjs from "dayjs";
import utils from "../utils";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { Disclosure } from "@headlessui/react";
import { useApi } from "../providers/Api";
import { BetHistoryResponse2 } from "../types/bets";
import { Runner, SignedMeetingsResponse, markets } from "horselink-sdk";

const Races: React.FC = () => {
  const params = useParams();
  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;
  const meetRaces = useMeetData(params.track || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner>();
  const [closed, setClosed] = useState(false);
  const { data } = useRunnersData(track, raceNumber);
  const config = useConfig();
  const api = useApi();

  const [meetingsResponse, setMeetingsResponse] =
    useState<SignedMeetingsResponse>();
  const [selectedBet, setSelectedBet] = useState<BetHistoryResponse2>();

  useEffect(() => {
    api.getMeetings().then(setMeetingsResponse);
  }, []);

  // note: this left in because it may be required for future redesigns
  // const { meetDate } = useMemo(() => {
  //   const meetDate = dayjs().format("DD-MM-YY");
  //   return { config, meetDate };
  // }, []);

  const winMarketId = markets.makeMarketId(
    new Date(),
    track,
    raceNumber.toString(),
    "W"
  );

  const placeMarketId = markets.makeMarketId(
    new Date(),
    track,
    raceNumber.toString(),
    "P"
  );

  const { totalBetsOnPropositions } = useSubgraphBets("ALL_BETS", winMarketId);

  const winBetHistory = useBetsData({
    marketId: winMarketId
  });

  const placeBetHistory = useBetsData({
    marketId: placeMarketId
  });

  console.log("placeBetHistory", placeBetHistory);

  const betHistory = winBetHistory; // ?.concat(placeBetHistory || []);

  // TODO: FETCH FROM API
  const margin = 115;

  useEffect(() => {
    const interval = setInterval(() => {
      setClosed(dayjs().unix() > (data?.raceData.race.close_unix || 0));
    }, constants.time.ONE_SECOND_MS);

    return () => clearInterval(interval);
  });

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="w-full">
          {data?.raceData && betHistory && meetingsResponse ? (
            <Disclosure as={React.Fragment}>
              {({ open }) => (
                <React.Fragment>
                  <Disclosure.Button as={React.Fragment}>
                    {open ? (
                      <div className="flex w-full cursor-pointer items-center border border-hl-primary p-2">
                        <h1 className="w-full text-left font-basement text-hl-secondary">
                          {data?.raceData?.track.name} (
                          {data?.raceData?.track.code})
                        </h1>
                        <div className="flex w-[6rem] justify-end">
                          <HiChevronUp size={30} color="white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full cursor-pointer border border-hl-primary p-2">
                        <div className="flex w-full">
                          <h1 className="w-full text-left font-basement text-hl-secondary lg:w-auto lg:whitespace-nowrap">
                            {data?.raceData?.track.name} (
                            {data?.raceData?.track.code})
                          </h1>
                          <div className="w-auto whitespace-nowrap text-sm text-hl-tertiary lg:ml-10 lg:w-full">
                            Margin: {margin}
                          </div>
                          <div className="flex w-[6rem] justify-end">
                            <HiChevronDown
                              size={30}
                              color="white"
                              className="relative bottom-1"
                            />
                          </div>
                        </div>
                        <p className="mt-1 w-full text-sm">
                          {/* {data?.data?.raceData.name} | {data?.data?.raceData.class} */}
                          {data?.raceData?.race?.name}
                        </p>
                      </div>
                    )}
                  </Disclosure.Button>

                  <Disclosure.Panel>
                    {meetingsResponse.data.meetings
                      .filter(
                        m =>
                          m.name.toLowerCase() !==
                          data?.raceData?.track.name.toLowerCase()
                      )
                      .map(m => (
                        <Link
                          to={utils.races.createRacingLink(m.races[0], m)} // use first race
                          className="block w-full bg-hl-primary px-2 py-1 font-basement text-hl-background"
                          key={JSON.stringify(m)}
                        >
                          {m.name}
                        </Link>
                      ))}
                  </Disclosure.Panel>
                </React.Fragment>
              )}
            </Disclosure>
          ) : (
            <div className="flex w-full justify-center border border-hl-primary py-2">
              <Loader />
            </div>
          )}
        </div>
        <RacesButton params={params} meetRaces={meetRaces?.raceInfo} />
        <RaceTable
          runners={data?.raceData?.runners}
          setSelectedRunner={setSelectedRunner}
          setIsModalOpen={setIsModalOpen}
          totalBetsOnPropositions={totalBetsOnPropositions}
          closed={closed}
        />
      </div>
      <div className="mt-10">
        <h2>HISTORY</h2>
      </div>
      <div className="mt-4">
        <BetTable
          paramsAddressExists={true}
          allBetsEnabled={true}
          betHistory={betHistory}
          config={config}
          setSelectedBet={setSelectedBet}
          setIsModalOpen={setIsSettleModalOpen}
        />
      </div>
      <div className="block py-10 lg:hidden" />
      <BetModal
        runner={selectedRunner}
        race={data?.raceData?.race}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <SettleBetModal
        isModalOpen={isSettleModalOpen}
        setIsModalOpen={setIsSettleModalOpen}
        selectedBet={selectedBet}
        config={config}
      />
    </PageLayout>
  );
};

export default Races;
