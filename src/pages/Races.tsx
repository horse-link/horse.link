import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRunnersData, useMeetData } from "../hooks/data";
import { NewButton, RacesButton } from "../components/Buttons";
import { NewBetTable, NewRaceTable } from "../components/Tables";
import { PlaceBetModal, SettleBetModal } from "../components/Modals";
import { Runner, SignedMeetingsResponse } from "../types/meets";
import { PageLayout } from "../components"; // Loader
import { useSubgraphBets } from "../hooks/subgraph";
import { BetHistory } from "../types/bets";
import { makeMarketId } from "../utils/markets";
import { useConfig } from "../providers/Config";
import constants from "../constants";
import dayjs from "dayjs";
import utils from "../utils";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import { Disclosure } from "@headlessui/react";
import { useApi } from "../providers/Api";

const Races: React.FC = () => {
  const params = useParams();
  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;
  const meetRaces = useMeetData(params.track || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner>();
  const [selectedBet, setSelectedBet] = useState<BetHistory>();
  const [closed, setClosed] = useState(false);
  const { race } = useRunnersData(track, raceNumber);
  const config = useConfig();
  const api = useApi();
  const [meetingsResponse, setMeetingsResponse] =
    useState<SignedMeetingsResponse>();

  useEffect(() => {
    api.getMeetings().then(setMeetingsResponse);
  }, []);

  // const { meetDate } = useMemo(() => {
  //   const meetDate = dayjs().format("DD-MM-YY");
  //   return { config, meetDate };
  // }, []);

  const marketId = makeMarketId(new Date(), track, raceNumber.toString());
  const {
    betData: betHistory,
    totalBetsOnPropositions,
    refetch
  } = useSubgraphBets("ALL_BETS", marketId);

  const margin = useMemo(() => {
    if (!race || !race.runners.length) return;

    const validRunners = race.runners.filter(
      runner => !utils.races.isScratchedRunner(runner)
    );

    return utils.races.calculateRaceMargin(validRunners.map(r => r.odds));
  }, [race]);

  useEffect(() => {
    const interval = setInterval(() => {
      setClosed(dayjs().unix() > (race?.raceData.close || 0));
    }, constants.time.ONE_SECOND_MS);

    return () => clearInterval(interval);
  });

  return (
    <PageLayout>
      <div className="flex flex-col gap-6">
        <div className="w-full">
          <Disclosure as={React.Fragment}>
            {({ open }) => (
              <React.Fragment>
                <Disclosure.Button as={React.Fragment}>
                  {open ? (
                    <div className="flex w-full cursor-pointer items-center border border-hl-primary p-2">
                      <h1 className="w-full text-left font-basement text-hl-secondary">
                        {race?.track.name} ({race?.track.code})
                      </h1>
                      <div className="flex w-[6rem] justify-end">
                        <HiChevronUp size={30} color="white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full cursor-pointer border border-hl-primary p-2">
                      <div className="flex w-full items-center">
                        <h1 className="w-full text-left font-basement text-hl-secondary lg:w-auto lg:whitespace-nowrap">
                          {race?.track.name} ({race?.track.code})
                        </h1>
                        <div className="w-auto whitespace-nowrap text-sm text-hl-tertiary lg:ml-10 lg:w-full">
                          Margin:{" "}
                          {utils.formatting.formatToTwoDecimals(
                            (+(margin || "0") * 100).toString()
                          )}
                          %
                        </div>
                        <div className="flex w-[6rem] justify-end">
                          <HiChevronDown size={30} color="white" />
                        </div>
                      </div>
                      <p className="mt-1 w-full text-sm">
                        {race?.raceData.name} | {race?.raceData.class}
                      </p>
                    </div>
                  )}
                </Disclosure.Button>

                <Disclosure.Panel>
                  {meetingsResponse?.data.meetings
                    .filter(
                      m =>
                        m.name.toLowerCase() !== race?.track.name.toLowerCase()
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
        </div>
        <RacesButton params={params} meetRaces={meetRaces?.raceInfo} />
        <NewRaceTable
          runners={race?.runners}
          setSelectedRunner={setSelectedRunner}
          setIsModalOpen={setIsModalOpen}
          totalBetsOnPropositions={totalBetsOnPropositions}
          closed={closed}
        />
      </div>
      <div className="mt-10">
        <NewButton text="history" onClick={() => {}} disabled active={false} />
      </div>
      <div className="mt-4">
        <NewBetTable
          paramsAddressExists={true}
          allBetsEnabled={true}
          betHistory={betHistory}
          config={config}
          setSelectedBet={setSelectedBet}
          setIsModalOpen={setIsSettleModalOpen}
        />
      </div>
      <div className="block py-10 lg:hidden" />
      <PlaceBetModal
        runner={selectedRunner}
        race={race}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <SettleBetModal
        isModalOpen={isSettleModalOpen}
        setIsModalOpen={setIsSettleModalOpen}
        selectedBet={selectedBet}
        refetch={refetch}
        config={config}
      />
    </PageLayout>
  );
};

export default Races;
