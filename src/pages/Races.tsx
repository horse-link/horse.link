import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useRunnersData, useMeetData } from "../hooks/data";
import { RacesButton } from "../components/Buttons";
import { RaceTable, BetTable } from "../components/Tables";
import { PlaceBetModal, SettleBetModal } from "../components/Modals";
import { Runner } from "../types/meets";
import { PageLayout, Toggle } from "../components";
import { useSubgraphBets } from "../hooks/subgraph";
import { BetHistory } from "../types/bets";
import { makeMarketId } from "../utils/markets";
import { formatBytes16String } from "../utils/formatting";
import { useConfig } from "../providers/Config";
import { useAccount } from "wagmi";

import Skeleton from "react-loading-skeleton";
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
  const [allBetsEnabled, setAllBetsEnabled] = useState(true);
  const { race } = useRunnersData(track, raceNumber);
  const { address } = useAccount();
  const config = useConfig();

  const { meetDate } = useMemo(() => {
    const meetDate = dayjs().format("DD-MM-YY");
    return { config, meetDate };
  }, []);
  const onMyBetToggle = () => setAllBetsEnabled(prev => !prev);

  const marketId = makeMarketId(new Date(), track, raceNumber.toString());
  const b16MarketId = formatBytes16String(marketId);
  const {
    betData: betHistory,
    totalBetsOnPropositions,
    refetch
  } = useSubgraphBets(
    "ALL_BETS",
    b16MarketId,
    allBetsEnabled ? undefined : address
  );

  const margin = useMemo(() => {
    if (!race || !race.runners.length) return;

    const validRunners = race.runners.filter(
      runner => !utils.races.isScratchedRunner(runner)
    );

    return utils.races.calculateRaceMargin(validRunners.map(r => r.odds));
  }, [race]);

  const { current: now } = useRef(dayjs());
  const closed = now.isAfter(dayjs(race?.raceData.close));

  return (
    <PageLayout>
      <PlaceBetModal
        runner={selectedRunner}
        race={race}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="flex flex-col gap-6">
        <div className="flex gap-2">
          <RacesButton params={params} meetRaces={meetRaces?.raceInfo} />
        </div>
        <div className="justify-around gap-2 rounded-lg border-b border-gray-200 bg-white p-2 text-center shadow lg:flex lg:text-sm">
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
          <h2>
            {!meetRaces ? (
              <Skeleton />
            ) : !utils.formatting.formatTrackCondition(meetRaces) ? null : (
              `${utils.formatting.formatTrackCondition(meetRaces)}, ${
                meetRaces.weatherCondition
              }`
            )}
          </h2>
        </div>
        <RaceTable
          runners={race?.runners}
          setSelectedRunner={setSelectedRunner}
          setIsModalOpen={setIsModalOpen}
          totalBetsOnPropositions={totalBetsOnPropositions}
          closed={closed}
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between">
          <h1 className="mt-4 text-2xl font-bold">History</h1>
          <div className="flex items-center gap-3">
            <Toggle enabled={allBetsEnabled} onChange={onMyBetToggle} />
            <div className="font-semibold">All Bets</div>
          </div>
        </div>
        <BetTable
          paramsAddressExists={true}
          allBetsEnabled={allBetsEnabled}
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

export default Races;
