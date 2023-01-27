import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRunnersData, useMeetData } from "../hooks/data";
import { RacesButton } from "../components/Buttons";
import { RaceTable, BetTable } from "../components/Tables";
import { PlaceBetModal, SettleBetModal } from "../components/Modals";
import { MeetInfo, Runner } from "../types/meets";
import { PageLayout } from "../components";
import { useSubgraphBets } from "../hooks/subgraph";
import { BetHistory } from "../types/bets";
import { makeMarketId } from "../utils/markets";
import {
  formatBytes16String,
  formattingTrackAndWeatherConditions
} from "../utils/formatting";
import { useConfig } from "../providers/Config";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import utils from "../utils";

export const Races: React.FC = () => {
  const params = useParams();
  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;
  const meetRaces = useMeetData(params.track || "");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner>();
  const [selectedBet, setSelectedBet] = useState<BetHistory>();
  const { race } = useRunnersData(track, raceNumber);
  const config = useConfig();

  const { meetDate } = useMemo(() => {
    const meetDate = dayjs().format("DD-MM-YY");
    return { config, meetDate };
  }, []);
  const marketId = makeMarketId(new Date(), track, raceNumber.toString());
  const b16MarketId = formatBytes16String(marketId);

  const { betHistory, totalBetsOnPropositions, refetch } = useSubgraphBets(
    false,
    "ALL_BETS",
    b16MarketId
  );

  console.log(1111111, meetRaces);
  const margin = useMemo(() => {
    if (!race || !race.runners.length) return;

    const validRunners = race.runners.filter(
      runner => !utils.races.isScratchedRunner(runner)
    );

    return utils.races.calculateRaceMargin(validRunners.map(r => r.odds));
  }, [race]);

  const checkForTrackAndWeatherConditions = useMemo(() => {
    formattingTrackAndWeatherConditions(meetRaces);
  }, [meetRaces]);

  return (
    <PageLayout>
      <PlaceBetModal
        runner={selectedRunner}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          <RacesButton params={params} meetRaces={meetRaces?.raceInfo} />
        </div>
        <div className="flex p-2 shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg justify-around">
          <h1>{race ? race.raceData.name : <Skeleton width={200} />}</h1>
          <h1>
            {race ? (
              `${race.track.name} - (${race.track.code})`
            ) : (
              <Skeleton width={150} />
            )}
          </h1>
          <h1>{meetDate}</h1>
          <h1>
            {race ? `${race.raceData.distance}m` : <Skeleton width={50} />}
          </h1>
          <h1>Race #: {raceNumber}</h1>
          <h1>Class: {race ? race.raceData.class : <Skeleton width={30} />}</h1>
          <h1>
            Margin:{" "}
            {margin ? (
              `${utils.formatting.formatToTwoDecimals(
                (+margin * 100).toString()
              )}%`
            ) : (
              <Skeleton width={50} />
            )}
          </h1>
          <h1>
            {formattingTrackAndWeatherConditions(meetRaces) || <Skeleton />}
          </h1>
        </div>
        <RaceTable
          runners={race?.runners}
          setSelectedRunner={setSelectedRunner}
          setIsModalOpen={setIsModalOpen}
          totalBetsOnPropositions={totalBetsOnPropositions}
        />
      </div>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold mt-4">History</h1>
        <BetTable
          myBetsEnabled={false}
          betHistory={betHistory}
          config={config}
          setSelectedBet={setSelectedBet}
          setIsModalOpen={setIsSettleModalOpen}
        />
      </div>
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
