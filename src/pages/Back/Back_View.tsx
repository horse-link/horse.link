import { PageLayout } from "../../components";
import { Back } from "../../types";

type Props = {
  back: Back;
  openWalletModal: () => void;
  isWalletConnected: boolean;
  wagerAmount: number;
  updateWagerAmount: (amount: number) => void;
  potentialPayout: string;
  contract: {
    write?: () => void;
    isError: boolean;
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
  openWalletModal,
  isWalletConnected,
  wagerAmount,
  updateWagerAmount,
  potentialPayout,
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
              {isWalletConnected ? (
                <button
                  className="rounded-md border shadow-md border-gray-500 px-5 py-1"
                  onClick={contract.write}
                  disabled={!contract.write || txStatus.isLoading}
                >
                  {txStatus.isLoading ? "Backing..." : "Back"}
                </button>
              ) : (
                <button
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={openWalletModal}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </form>
        </div>
        {txStatus.isSuccess && (
          <div className="mt-5 w-96 px-10 py-5 rounded-md shadow border-b bg-white border-gray-200 break-all">
            Success <br />
            Transaction Hash : {txStatus.hash}
          </div>
        )}
        {contract.isError && (
          <div className="mt-5 w-96 px-10 py-5 rounded-md shadow border-b bg-white border-gray-200 text-red-700 break-words">
            {contract.errorMsg}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default BackView;
