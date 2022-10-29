import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { Loader, PageLayout } from "../../components";
import useApi from "../../hooks/useApi";
import { FaucetModal } from "./FaucetModal";

const faucetTokens = [
  {
    name: "Mock DIA",
    address: "0x70b481B732822Af9beBc895779A6e261DC3D6C8B"
  },
  {
    name: "Mock USDT",
    address: "0xaF2929Ed6758B0bD9575e1F287b85953B08E50BC"
  }
];

export const FaucetPage = () => {
  const { address } = useAccount();
  const api = useApi();

  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClickClaim = useCallback(
    async (tokenAddress: string) => {
      if (!address || isLoading) return;
      setIsLoading(true);
      try {
        const res = await api.requestTokenFromFaucet(address, tokenAddress);
        setTxHash(res.tx);
        setIsModalOpen(true);
      } catch (error: any) {
        alert(error?.message ?? "Something went wrong");
      }
      setIsLoading(false);
    },
    [address, api]
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
      <div className="flex flex-wrap gap-20 sm:justify-center">
        <div className="flex flex-col gap-5 w-full md:w-56">
          {faucetTokens.map(({ name, address }) => (
            <ClaimButton
              tokenName={name}
              onClick={() => onClickClaim(address)}
              isLoading={isLoading}
            />
          ))}
        </div>
        <div className="w-full md:w-64 bg-gray-100 rounded-md p-5 ">
          <h2>
            Welcome to the Horse Link Faucet.
            <br />
            These tokens are to be used to test the beta functionality of the
            app.
          </h2>
          <br />
          <h2>Please make sure you are connected to Goerli network.</h2>
          <br />
          <p>
            To connect to Goerli, within Metamask dropdown the Network tab at
            the top and scroll and select Goerli test network (this will be
            there by default).
          </p>
        </div>
        <div className="w-96 mx-auto md:mx-0">
          <img
            loading="lazy"
            src="/images/goerli-test-network.png"
            alt="Goerli network option in Metamask Networks tab"
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 mt-6 md:w-5/6 mx-auto">
        {faucetTokens.map(token => {
          return (
            <div className="bg-gray-100 rounded-md p-5 sm:w-152">
              {token.name} Address - {token.address}
            </div>
          );
        })}
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
