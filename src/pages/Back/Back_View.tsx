import { useContext, useMemo, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { PageLayout } from "../../components";
import { WalletModalContext } from "../../providers/WalletModal";
import { Back } from "../../types";
import marketContractJson from "../../abi/Market.json";
import { ethers } from "ethers";
import { useDebounce } from "use-debounce";

const DECIMALS = 6;

type Props = {
  back: Back;
};

const BackView: React.FC<Props> = ({ back }) => {
  const { openWalletModal } = useContext(WalletModalContext);

  const { address } = useAccount();

  const [wagerAmount, setWagerAmount] = useState<number>(0);
  const [debouncedWagerAmount] = useDebounce(wagerAmount, 500);
  const [potentialPayout, setPotentialPayout] = useState<number>(0);

  // const { data: signer, isError, isLoading } = useSigner();

  const { proposition_id, odds } = back;
  // const proposition_id = "1"
  // const odds = 5000;
  const targetOdds = 5;

  const b32PropositionId = useMemo(
    () => ethers.utils.formatBytes32String(proposition_id),
    [proposition_id]
  );
  const bnOdds = useMemo(() => ethers.utils.parseUnits("5", DECIMALS), []);
  const bnWager = useMemo(
    () => ethers.utils.parseUnits(debouncedWagerAmount.toString(), DECIMALS),
    [debouncedWagerAmount]
  );
  console.log({
    b32PropositionId,
    bnWager: bnWager.toNumber(),
    bnOdds: bnWager.toNumber()
  });

  const { data, isError, isLoading } = useContractRead({
    addressOrName: "0x9745295850097f3E2a82E493B296dA2aE0d0AdC5",
    contractInterface: marketContractJson.abi,
    functionName: "getPotentialPayout",
    args: [b32PropositionId, bnWager, bnOdds]
  });

  console.log({ data, isError, isLoading });

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

  const isWalletConnected = address ? true : false;

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
