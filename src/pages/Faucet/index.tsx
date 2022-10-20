import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { PageLayout } from "../../components";
import useApi from "../../hooks/useApi";
import { FaucetModal } from "./FaucetModal";

const faucetTokens = [
  {
    name: "Goerli ETH",
    address: "0x0000000000000000000000000000000000000000"
  },
  {
    name: "Mock DAI",
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

  const [txHash, setTxHash] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClickClaim = useCallback(
    async (tokenAddress: string) => {
      if (!address) return;
      const res = await api.requestTokenFromFaucet(address, tokenAddress);
      setTxHash(res.tx);
      setIsModalOpen(true);
    },
    [address, api]
  );
  const onModalClose = () => {
    setIsModalOpen(false);
    setTxHash(undefined);
  };
  return (
    <PageLayout requiresAuth={false}>
      <FaucetModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        txHash={txHash}
      />
      <div className="flex flex-wrap gap-20 sm:justify-center">
        <div className="flex flex-col gap-5 w-full sm:w-56">
          {faucetTokens.map(({ name, address }) => (
            <ClaimButton
              tokenName={name}
              onClick={() => onClickClaim(address)}
            />
          ))}
        </div>
        <div className="w-full sm:w-64 bg-gray-100 rounded-md p-5 ">
          <h2>
            Welcome to the Faucet
            <br />
            These tokens are to be used to test the beta functionality of the
            app.
          </h2>
          <br />
          <h2>Please make sure you are connected top Goerli network</h2>
          <br />
          <p>
            To connect to Goerli, within Metamask dropdown the Network tab at
            the top and scroll and select Goerli test network (this will be
            there by default)
          </p>
        </div>
        <div className="w-96 mx-auto sm:mx-0">
          <img
            loading="lazy"
            src="/images/goerli-test-network.png"
            alt="Goerli network option in Metamask Networks tab"
          />
        </div>
      </div>
    </PageLayout>
  );
};

type ClaimButtonProps = {
  tokenName: string;
  onClick: () => void;
};
const ClaimButton = ({ tokenName, onClick }: ClaimButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="px-5 py-5 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-500 shadow-md "
    >
      Claim {tokenName}
    </button>
  );
};
