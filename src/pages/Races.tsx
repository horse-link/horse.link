import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRunnersData } from "../hooks/data";
import moment from "moment";
import { RaceTable } from "../components/Races";
import { PlaceBetModal, SettleBetModal } from "../components/Modals";
import { Runner } from "../types/meets";
import { PageLayout } from "../components";
import { useSubgraphBets } from "../hooks/subgraph";
import { BetHistory } from "../types/bets";
import { BetTable } from "../components/Bets";
import { makeMarketId } from "../utils/markets";
import { formatBytes16String } from "../utils/formatting";
import { useConfig } from "../providers/Config";
import Skeleton from "react-loading-skeleton";
import { BigNumber } from "bignumber.js";

export const Races: React.FC = () => {
  const params = useParams();
  const track = params.track || "";
  const raceNumber = Number(params.number) || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner>();
  const [selectedBet, setSelectedBet] = useState<BetHistory>();
  const { race } = useRunnersData(track, raceNumber);
  const config = useConfig();

  const getTheOddsForARace = race?.runners.map(
    race => new BigNumber(race.odds)
  );

  // Number given from formula
  const oneOverOdds = new BigNumber(1);

  const zero = new BigNumber(0);
  const calcMarginFormula = (odds: BigNumber) =>
    oneOverOdds.div(odds).multipliedBy(100);
  const calculateMargin = getTheOddsForARace?.reduce(
    (sum, odds) => sum.plus(calcMarginFormula(odds)),
    zero
  );
  console.log(calculateMargin, "calculateMargin");

  const { meetDate } = useMemo(() => {
    const meetDate = moment().format("DD-MM-YY");
    return { config, meetDate };
  }, []);
  const marketId = makeMarketId(new Date(), track, raceNumber.toString());
  const b16MarketId = formatBytes16String(marketId);

  const { betHistory, refetch } = useSubgraphBets(
    false,
    "ALL_BETS",
    b16MarketId
  );

  return (
    <PageLayout>
      <PlaceBetModal
        runner={selectedRunner}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="flex flex-col gap-6">
        <div className="flex p-2 shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg justify-around">
          <h1>Track: {track}</h1>
          <h1>Race #: {raceNumber}</h1>
          <h1>Date: {meetDate}</h1>
          <h1>Name: {race ? race.raceData.name : <Skeleton />}</h1>
          <h1>
            Distance: {race ? `${race.raceData.distance}m` : <Skeleton />}
          </h1>
          <h1>Class: {race ? race.raceData.class : <Skeleton />}</h1>
          <h1>Margin: {race ? `${calculateMargin}%` : <Skeleton />}</h1>
        </div>
        <RaceTable
          runners={race?.runners}
          setSelectedRunner={setSelectedRunner}
          setIsModalOpen={setIsModalOpen}
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
