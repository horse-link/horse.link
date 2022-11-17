import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { Loader, PageLayout } from "../../components";
import { FaucetModal } from "./FaucetModal";
import { AiOutlineCopy } from "react-icons/ai";
import api from "../../apis/Api";
import { StaticConfig } from "../../providers/Config";

export const FaucetPage = () => {
  const { address } = useAccount();

  const [isClaimUsdtLoading, setIsClaimUsdtLoading] = useState(false);
  const [isClaimDiaLoading, setIsClaimDiaLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClickClaim = useCallback(
    async (tokenAddress: string, tokenName: string) => {
      if (!address || isClaimUsdtLoading || isClaimDiaLoading) return;
      if (tokenName === "Mock USDT") {
        setIsClaimUsdtLoading(true);
      } else {
        setIsClaimDiaLoading(true);
      }
      try {
        const res = await api.requestTokenFromFaucet(address, tokenAddress);
        setTxHash(res.tx);
        setIsModalOpen(true);
      } catch (error: any) {
        alert(error?.message ?? "Something went wrong");
      }
      setIsClaimUsdtLoading(false);
      setIsClaimDiaLoading(false);
    },
    [address]
  );
  const onModalClose = () => {
    setIsModalOpen(false);
    setTxHash("");
  };
  return (
    <PageLayout requiresAuth={false}>
      <FaucetModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        txHash={txHash}
      />
      <div className="w-full text-center bg-green-700 rounded-md p-5 my-10">
        <h2>Welcome to the Horse Link Faucet!</h2>
        <h2 className="p-1">
          These tokens are to be used to test the beta functionality of the app.
          Please make sure you are connected to Goerli network.
        </h2>
        <p className="p-1">
          To connect to the Goerli network, select your Metamask extension and
          click the Network tab at the top. Select the Goerli test network (this
          will be there by default, otherwise please enable test networks in
          your Metamask settings).
        </p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <img
          loading="lazy"
          src="/images/goerli-test-network.png"
          alt="Goerli network option in Metamask Networks tab"
          width="300"
          height="300"
        />
        <div className="flex flex-col gap-5 w-full md:w-56">
          {Object.keys(StaticConfig.tokenAddresses).map(key => (
            <ClaimButton
              key={key}
              tokenName={key}
              onClick={() =>
                onClickClaim(StaticConfig.tokenAddresses[key], key)
              }
              isLoading={isClaimUsdtLoading || isClaimDiaLoading}
            />
          ))}
        </div>
        <div className="flex flex-col gap-5 md:w-65">
          {Object.keys(StaticConfig.tokenAddresses).map(key => {
            return (
              <div className="flex bg-gray-100 rounded-md p-5 md:w-155">
                {key} Address - {StaticConfig.tokenAddresses[key]}
                <button
                  className="flex rounded-xl hover:bg-green-400 p-1"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      StaticConfig.tokenAddresses[key]
                    )
                  }
                >
                  <AiOutlineCopy />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

type ClaimButtonProps = {
  tokenName: string;
  onClick: () => void;
  isLoading: boolean;
};
const ClaimButton = ({ tokenName, onClick, isLoading }: ClaimButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="px-5 h-16 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-500 shadow-md "
    >
      {isLoading ? <Loader /> : `Claim ${tokenName}`}
    </button>
  );
};
