import { useContractRead } from "wagmi";
import { PageLayout } from "../../components";
import ContractWriteResultCard from "../../components/ContractWriteResultCard/ContractWriteResultCard_View";
import RequireWalletButton from "../../components/RequireWalletButton/RequireWalletButton_View";
import { Back } from "../../types";
import marketContract from "../../abi/Market.json";
import vaultContractJson from "../../abi/Vault.json";

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
    backContractwrite?: () => void;
    approveContractWrite?: () => void;
    errorMsg?: string;
  };
  txStatus: {
    isLoading: boolean;
    isSuccess: boolean;
    hash?: string;
  };
  isEnoughAllowance: boolean;
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
  isEnoughAllowance
}) => {
  return (
    <PageLayout requiresAuth={false}>
      <div className="grid place-content-center">
        <div className="w-96 px-10 pt-5 pb-3 rounded-md shadow border-b bg-white border-gray-200 sm:rounded-lg">
          <div className="text-3xl">Target odds {back.odds}</div>
          <form>
            <div className="flex flex-col">
              <label>Market</label>
              <select
                value={selectedMarket}
                onChange={e => setSelectedMarket(e.target.value)}
                name="markets"
                id="markets"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>

              <label>
                <span>Potential Payout</span>
                <input
                  type="number"
                  value={potentialPayout}
                  readOnly
                  placeholder="0.0"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
            </div>
            <div className="flex justify-end mt-3">
              <RequireWalletButton
                actionButton={
                  isEnoughAllowance ? (
                    <button
                      className="px-5 py-1 hover:bg-gray-100 rounded-md border border-gray-500 shadow-md"
                      onClick={contract.backContractwrite}
                      disabled={shouldButtonDisabled}
                    >
                      {txStatus.isLoading ? "Backing..." : "Back"}
                    </button>
                  ) : (
                    <button
                      className="px-5 py-1 hover:bg-gray-100 rounded-md border border-gray-500 shadow-md "
                      onClick={contract.approveContractWrite}
                    >
                      {txStatus.isLoading ? "..." : "Approve"}
                    </button>
                  )
                }
              />
            </div>
          </form>
        </div>
        <ContractWriteResultCard
          hash={txStatus.hash}
          isSuccess={txStatus.isSuccess}
          errorMsg={contract.errorMsg}
        />
      </div>
    </PageLayout>
  );
};

export default BackView;

type marketOptionProps = {
  contractAddress: string;
};

const MarketOption = ({ contractAddress }: marketOptionProps) => {
  const { data: vaultAddressData } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: marketContract.abi,
    functionName: "getVaultAddress"
  });
  const { data: vaultNameData } = useContractRead({
    addressOrName: vaultAddressData?.toString() ?? "",
    contractInterface: vaultContractJson.abi,
    functionName: "name",
    enabled: !!vaultAddressData
  });
  return <option value={contractAddress}>{vaultNameData}</option>;
};
