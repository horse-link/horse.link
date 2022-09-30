import { PageLayout } from "../../components";
import ContractWriteResultCard from "../../components/ContractWriteResultCard/ContractWriteResultCard_View";
import RequireWalletButton from "../../components/RequireWalletButton/RequireWalletButton_View";
import { Back } from "../../types";

type Props = {
  back: Back;
  wagerAmount: number;
  updateWagerAmount: (amount: number) => void;
  potentialPayout: string;
  shouldButtonDisabled: boolean;
  contract: {
    write?: () => void;
    errorMsg?: string;
  };
  txStatus: {
    isLoading: boolean;
    isSuccess: boolean;
    hash?: string;
  };
};

const BackView: React.FC<Props> = ({
  back,
  wagerAmount,
  updateWagerAmount,
  potentialPayout,
  shouldButtonDisabled,
  contract,
  txStatus
}) => {
  return (
    <PageLayout requiresAuth={false}>
      <div className="grid place-content-center">
        <div className="w-96 px-10 pt-5 pb-3 rounded-md shadow border-b bg-white border-gray-200 sm:rounded-lg">
          <div className="text-3xl">Target odds {back.odds}</div>
          <form>
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
                  <button
                    className="px-5 py-1 hover:bg-gray-100 rounded-md border border-gray-500 shadow-md"
                    onClick={contract.write}
                    disabled={shouldButtonDisabled}
                  >
                    {txStatus.isLoading ? "Backing..." : "Back"}
                  </button>
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
