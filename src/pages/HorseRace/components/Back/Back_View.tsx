import ContractWriteResultCard from "../../../../components/ContractWriteResultCard/ContractWriteResultCard_View";
import RequireWalletButton from "../../../../components/RequireWalletButton/RequireWalletButton_View";
import { Back } from "../../../../types";
import useMarketDetail from "../../../../hooks/market/useMarketDetail";
import { Loader } from "../../../../components";
import { formatToTwoDecimals } from "../../../../utils/formatting";

type Props = {
  back: Back;
  markets: string[];
  selectedMarket: string;
  setSelectedMarket: (address: string) => void;
  wagerAmount: number;
  updateWagerAmount: (amount: number) => void;
  potentialPayout: string;
  shouldButtonDisabled: boolean;
  contract: {
    approveContractWrite?: () => void;
    errorMsg: string | undefined;
  };
  txStatus: {
    isLoading: boolean;
    isSuccess: boolean;
    hash?: string;
  };
  isEnoughAllowance: boolean;
  handleBackContractWrite: () => Promise<void>;
  balanceData?: any;
};

const BackView: React.FC<Props> = ({
  back,
  markets,
  selectedMarket,
  setSelectedMarket,
  wagerAmount,
  updateWagerAmount,
  potentialPayout,
  shouldButtonDisabled,
  contract,
  txStatus,
  isEnoughAllowance,
  handleBackContractWrite,
  balanceData
}) => {
  return (
    <div className="w-96 md:w-152">
      <div className="px-10 pt-5 pb-5 rounded-md bg-white border-gray-200 sm:rounded-lg">
        <div className="text-3xl mb-4">
          Target odds {formatToTwoDecimals(back.odds.toString())}
        </div>

        <div className="flex flex-col">
          <label>Market</label>
          <select
            value={selectedMarket}
            onChange={e => setSelectedMarket(e.target.value)}
            name="markets"
            id="markets"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-2"
          >
            {markets.map(address => (
              <MarketOption key={address} contractAddress={address} />
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label>
            <span>Wager amount</span>
            <input
              type="number"
              onChange={e => {
                updateWagerAmount(e.target.valueAsNumber);
              }}
              value={wagerAmount || ""}
              placeholder="0.0"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-2"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="py-1">
                Payout: <span>{potentialPayout}</span>
              </span>
            </div>
            <div>
              <span className="py-1">
                Balance:{" "}
                <span>{balanceData ? balanceData.formatted : "0"}</span>
              </span>
            </div>
          </div>
        </div>
        <br></br>
        <div className="flex flex-col">
          <RequireWalletButton
            actionButton={
              isEnoughAllowance ? (
                <button
                  className="px-5 py-1 hover:bg-gray-100 rounded-md border border-gray-500 shadow-md"
                  onClick={() => handleBackContractWrite()}
                  disabled={shouldButtonDisabled}
                >
                  {txStatus.isLoading ? <Loader /> : "Bet"}
                </button>
              ) : (
                <button
                  className={
                    "px-5 py-1 hover:bg-gray-100 rounded-md border border-gray-500 shadow-md" +
                    (!selectedMarket ? " opacity-50 cursor-not-allowed" : "")
                  }
                  onClick={() => contract.approveContractWrite?.()}
                  disabled={!selectedMarket}
                >
                  {txStatus.isLoading ? <Loader /> : "Approve"}
                </button>
              )
            }
          />
        </div>
      </div>
      <div className="mt-5">
        <ContractWriteResultCard
          hash={txStatus.hash}
          isSuccess={txStatus.isSuccess}
          errorMsg={contract.errorMsg}
        />
      </div>
    </div>
  );
};

export default BackView;

type marketOptionProps = {
  contractAddress: string;
};

const MarketOption = ({ contractAddress }: marketOptionProps) => {
  const marketDetail = useMarketDetail(contractAddress);
  const { name } = marketDetail || {};
  return <option value={contractAddress}>{name}</option>;
};
