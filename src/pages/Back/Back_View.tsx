import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { ethers } from "ethers";
import { useContractRead } from "wagmi";

import { PageLayout } from "../../components";
import { Back } from "../../types";

import marketContractJson from "../../abi/Market.json";

type Props = {
  back: Back;
  openWalletModal: () => void;
  isWalletConnected: boolean;
  DECIMALS: number;
  targetOdds: number;
};

const BackView: React.FC<Props> = ({
  back,
  openWalletModal,
  isWalletConnected,
  DECIMALS,
  targetOdds
}) => {
  const [wagerAmount, setWagerAmount] = useState<number>(0);
  const [debouncedWagerAmount] = useDebounce(wagerAmount, 500);

  const b32PropositionId = useMemo(
    () => ethers.utils.formatBytes32String(back.proposition_id),
    [back.proposition_id]
  );
  const bnOdds = useMemo(
    () => ethers.utils.parseUnits(targetOdds.toString(), DECIMALS),
    [targetOdds]
  );
  const bnWager = useMemo(
    () => ethers.utils.parseUnits(debouncedWagerAmount.toString(), DECIMALS),
    [debouncedWagerAmount]
  );
  const { data: bnPotentialPayout } = useContractRead({
    addressOrName: "0xe9BC1f42bF75C59b245d39483E97C3A70c450c9b",
    contractInterface: marketContractJson.abi,
    functionName: "getPotentialPayout",
    args: [b32PropositionId, bnWager, bnOdds]
  });

  const potentialPayout = useMemo(() => {
    if (!bnPotentialPayout) return 0;
    return ethers.utils.formatUnits(bnPotentialPayout, DECIMALS);
  }, [bnPotentialPayout]);

  const backTheRace = () => {
    alert("TODO: call API");
    // setLoading
    // const receipt = await contract.back()
    // setFinished
    // const transaction = await receipt.wait(1)
    // setConfirm
  };

  const updateWagerAmount = (amount: number) => {
    setWagerAmount(amount || 0); // handle NaN
  };

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
              {isWalletConnected ? (
                <button
                  className="rounded-md border shadow-md border-gray-500  px-5 py-1"
                  onClick={backTheRace}
                >
                  Back
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
      </div>
    </PageLayout>
  );
};

export default BackView;
