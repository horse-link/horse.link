import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRunnersData, useMeetData } from "../hooks/data";
import { NewButton, RacesButton } from "../components/Buttons";
import { NewBetTable, NewRaceTable } from "../components/Tables";
import { PlaceBetModal, SettleBetModal } from "../components/Modals";
import { Runner } from "../types/meets";
import { Loader, PageLayout } from "../components";
import { useSubgraphBets } from "../hooks/subgraph";
import { BetHistory } from "../types/bets";
import { makeMarketId } from "../utils/markets";
import { formatBytes16String } from "../utils/formatting";
import { useConfig } from "../providers/Config";
import constants from "../constants";
import dayjs from "dayjs";
import utils from "../utils";

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

  const { meetDate } = useMemo(() => {
    const meetDate = dayjs().format("DD-MM-YY");
    return { config, meetDate };
  }, []);

  const marketId = makeMarketId(new Date(), track, raceNumber.toString());
  const b16MarketId = formatBytes16String(marketId);
  const {
    betData: betHistory,
    totalBetsOnPropositions,
    refetch
  } = useSubgraphBets("ALL_BETS", b16MarketId);

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
        <div className="flex gap-2">
          <RacesButton params={params} meetRaces={meetRaces?.raceInfo} />
        </div>
        <div className="flex justify-between border border-hl-border bg-hl-background-secondary px-4 py-3 font-basement text-sm tracking-wider text-hl-primary">
          {!race || !margin || !meetRaces ? (
            <div className="flex w-full justify-center py-2">
              <Loader />
            </div>
          ) : (
            <React.Fragment>
              <h1>{race.raceData.name}</h1>
              <h2>
                {race.track.name} ({race.track.code})
              </h2>
              <h2>{meetDate}</h2>
              <h2>{race.raceData.distance}</h2>
              <h2>Race #: {raceNumber}</h2>
              <h2>Class: {race.raceData.class}</h2>
              <h2>
                Margin:{" "}
                {utils.formatting.formatToTwoDecimals(
                  (+margin * 100).toString()
                )}
                %
              </h2>
              <h2>
                {!utils.formatting.formatTrackCondition(meetRaces)
                  ? null
                  : `${utils.formatting.formatTrackCondition(meetRaces)}, ${
                      meetRaces.weatherCondition
                    }`}
              </h2>
            </React.Fragment>
          )}
        </div>
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
