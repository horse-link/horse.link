import { useState } from "react";
import { PageLayout } from "../../components";
import { Back } from "../../types";

type Props = {
  back: Back;
};

const BackView: React.FC<Props> = ({ back }) => {
  //get openWalletModal from context
  const [isWalletConnect, setIsWalletConnect] = useState<boolean>(false);
  const [wagerAmount, setWagerAmount] = useState<number>(0);

  const { odds } = back;
  const targetOdds = odds / 1000;

  const backTheRace = () => {
    setIsWalletConnect(false);
  };

  const connectWallet = () => {
    setIsWalletConnect(true);
  };

  const updateWagerAmount = (amount: number) => {
    setWagerAmount(amount || 0); // handle NaN
  };

  const potentialPayout = wagerAmount * odds;

  return (
    <PageLayout requiresAuth={false}>
      <div className="flex justify-center">
        <div className="w-96 px-10 pt-5 pb-3 rounded-md shadow border-b bg-white border-gray-200 sm:rounded-lg justify-around">
          <div className="text-3xl">Target odds {targetOdds}</div>
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
                  value={potentialPayout || ""}
                  readOnly
                  placeholder="0.0"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
            </div>
            <div className="flex justify-end mt-3">
              {isWalletConnect ? (
                <button className="rounded-md shadow-2xl border-2 border-black  px-5 py-1" onClick={backTheRace}>
                  Back
                </button>
              ) : (
                <button
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={connectWallet}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default BackView;
