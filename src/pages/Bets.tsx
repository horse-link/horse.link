import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useBets from "../hooks/bet/useBets";
import { BetHistory, FilterOptions } from "../types";
import { PageLayout } from "../components";
import Toggle from "../components/Toggle";
import { BetTable } from "../components/Bets";
import { SettleBetModal } from "../components/Modals";
import { useWalletModal } from "src/providers/WalletModal";
import classNames from "classnames";

const Bets: React.FC = () => {
  const [myBetsEnabled, setMyBetsEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState<BetHistory>();
  const [betTableFilter, setBetTableFilter] =
    useState<FilterOptions>("ALL_BETS");

  const { isConnected } = useAccount();
  const { openWalletModal } = useWalletModal();

  const { betHistory, refetch } = useBets(myBetsEnabled, betTableFilter);

  const onClickBet = (betData?: BetHistory) => {
    if (!betData) return;
    if (!isConnected) return openWalletModal();
    setSelectedBet(betData);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setMyBetsEnabled(isConnected);
  }, [isConnected]);

  const onMyBetToggle = () => setMyBetsEnabled(prev => !prev);
  const onFilterChange = (option: FilterOptions) => setBetTableFilter(option);

  const isLoading = !betHistory;
  return (
    <PageLayout requiresAuth={false}>
      <div className="w-full flex justify-between col-span-2 p-5">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          Bets History
        </h3>
        <div className="flex gap-5">
          <FilterGroup
            value={betTableFilter}
            onChange={onFilterChange}
            disabled={isLoading}
          />
          <div className="flex gap-3 self-end justify-self-end items-center">
            <Toggle enabled={myBetsEnabled} onChange={onMyBetToggle} />
            <div className="font-semibold">My Bets</div>
          </div>
        </div>
      </div>
      <BetTable
        myBetsEnabled={myBetsEnabled}
        onClickBet={onClickBet}
        betHistory={betHistory}
      />
      <SettleBetModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedBet={selectedBet}
        refetch={refetch}
      />
    </PageLayout>
  );
};

const options: Map<FilterOptions, string> = new Map([
  ["ALL_BETS", "All Bets"],
  ["PENDING", "Pending"],
  ["RESULTED", "Resulted"],
  ["SETTLED", "Settled"]
]);
type FilterGroupProps = {
  value: FilterOptions;
  onChange: (option: FilterOptions) => void;
  disabled: boolean;
};
const FilterGroup = ({
  value: currentOption,
  onChange,
  disabled
}: FilterGroupProps) => {
  return (
    <div className="flex gap-3">
      {[...options].map(([key, text]) => (
        <button
          onClick={() => {
            onChange(key);
          }}
          className={classNames("bg-white rounded px-2 shadow ", {
            "bg-blue-500": key === currentOption,
            "disabled:opacity-75": key !== currentOption
          })}
          disabled={disabled}
        >
          {text}
        </button>
      ))}
    </div>
  );
};

export default Bets;
