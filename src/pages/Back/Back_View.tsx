import { useContext, useEffect, useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import { PageLayout } from "../../components";
import { WalletModalContext } from "../../providers/WalletModal";
import { Back } from "../../types";
import marketContractJson from "../../abi/Market.json";
import { ethers } from "ethers";

type Props = {
  back: Back;
};

const BackView: React.FC<Props> = ({ back }) => {
  const { openWalletModal } = useContext(WalletModalContext);

  const { address } = useAccount();

  const [wagerAmount, setWagerAmount] = useState<number>(0);
  const [potentialPayout, setPotentialPayout] = useState<number>(0);

  const { data: signer, isError, isLoading } = useSigner();
  const contract = useContract({
    addressOrName: "0x9745295850097f3E2a82E493B296dA2aE0d0AdC5",
    contractInterface: marketContractJson.abi,
    signerOrProvider: signer
  });

  const { odds, proposition_id } = back;
  const targetOdds = odds / 1000;

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

  useEffect(() => {
    if (contract?.address) {
      const loadPayout = async () => {
        const bnWager = ethers.utils.parseUnits(wagerAmount.toString(), 3);

        console.log({ wagerAmount, targetOdds, proposition_id, contract });
        const bnOdds = ethers.utils.parseUnits(targetOdds.toString(), 3);
        const hash = ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(proposition_id)
        );
        console.log({ bnOdds, hash });
        const payout = await contract.getPotentialPayout(hash, bnWager, bnOdds);
        console.log("after await");
        setPotentialPayout(payout);
      };
      loadPayout();
    }
  }, [wagerAmount, targetOdds, contract, proposition_id]);
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
