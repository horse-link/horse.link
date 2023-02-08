import { useCallback, useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { FaucetModal } from "../components/Modals";
import { AiOutlineCopy } from "react-icons/ai";
import api from "../apis/Api";
import { useConfig } from "../providers/Config";
import { useWalletModal } from "../providers/WalletModal";
import { Loader, PageLayout } from "../components";
import { ClaimTokensButton } from "../components/Buttons";

const FAUCET_ADDRESS = "0xf919eaf2e37aac718aa19668b9071ee42c02c081";

const Faucet: React.FC = () => {
  const config = useConfig();
  const { address } = useAccount();
  const { openWalletModal } = useWalletModal();
  const { isConnected } = useAccount();

  const [isClaimUsdtLoading, setIsClaimUsdtLoading] = useState(false);
  const [isClaimDiaLoading, setIsClaimDiaLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClickClaim = useCallback(
    async (tokenAddress: string, tokenName: string) => {
      if (!address || isClaimUsdtLoading || isClaimDiaLoading) return;
      if (tokenName === "Mock USDT") {
        setIsClaimUsdtLoading(true);
      }
      if (tokenName === "Mock DAI") {
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

  const { data } = useBalance({
    address: FAUCET_ADDRESS
  });

  useEffect(() => {
    if (!isConnected) {
      openWalletModal();
    }
  }, [isConnected]);

  return (
    <PageLayout>
      {txHash && (
        <FaucetModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          txHash={txHash}
        />
      )}
      <div className="my-10 w-full rounded-md bg-emerald-700 p-5 text-center">
        <h1>Welcome to the Horse Link Faucet!</h1>
        <p>
          These tokens are to be used to test the beta functionality of the app.
          Please make sure you are connected to Goerli network. To connect to
          the Goerli network, select your Metamask extension and click the
          Network tab at the top. Select the Goerli test network (this will be
          there by default, otherwise please enable test networks in your
          Metamask settings).
        </p>
        <p>
          Current ETH balance for the faucet&nbsp;
          <a
            href={`${process.env.VITE_SCANNER_URL}/address/${FAUCET_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all underline"
          >
            {FAUCET_ADDRESS}
          </a>
        </p>
        &nbsp;is:&nbsp;
        {`${data ? `${data.formatted} ${data.symbol}` : <Loader />}`}
      </div>
      <div className="flex flex-wrap gap-3">
        <img
          loading="lazy"
          src="/images/goerli-test-network.png"
          alt="Goerli network option in Metamask Networks tab"
          width="300"
          height="300"
        />
        <div className="flex w-full flex-col gap-5 md:w-56">
          {config?.tokens.map(token => (
            <ClaimTokensButton
              key={token.name}
              tokenName={token.name}
              onClick={() => onClickClaim(token.address, token.name)}
              isLoading={isClaimUsdtLoading || isClaimDiaLoading || !config}
            />
          ))}
        </div>
        <div className="mb-5 flex w-full max-w-md flex-col gap-5 md:max-w-2xl">
          {config?.tokens.map(token => {
            return (
              <div className="flex flex-wrap rounded-md bg-gray-100 p-5 px-3 text-xs sm:text-base">
                {token.name} Address - {token.address}
                <button
                  className="flex flex-wrap rounded-xl p-1 hover:bg-emerald-400"
                  onClick={() => navigator.clipboard.writeText(token.address)}
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

export default Faucet;
