import React, { useEffect } from "react";
import { WalletModal } from "./Modals";
import { useWalletModal } from "../providers/WalletModal";
import { Navbar } from "./Navbar";
import { useNavigate } from "react-router";
import { useWalletOverrides } from "../hooks/useWalletOverrides";
import { NewAccountPanel } from "./NewAccountPanel";

type Props = {
  children: React.ReactNode;
};

export const PageLayout: React.FC<Props> = ({ children }) => {
  const { closeWalletModal, isWalletModalOpen } = useWalletModal();
  const navigate = useNavigate();
  const { isChainUnsupported, forceNewNetwork, isLocalWallet, setLoading } =
    useWalletOverrides();

  useEffect(() => {
    if (isChainUnsupported === undefined) return;

    if (isChainUnsupported)
      navigate("/unsupported", {
        replace: true
      });
  }, [isChainUnsupported]);

  return (
    <div className="min-h-screen w-screen bg-hl-background text-hl-primary">
      <Navbar />
      <main className="grid w-full grid-cols-5 p-4">
        <div className="col-span-4">{children}</div>
        <div className="col-span-1 px-4">
          <div className="sticky top-4">
            <NewAccountPanel
              forceNewNetwork={forceNewNetwork}
              isLocalWallet={isLocalWallet}
            />
            {/* Bet Slip */}
          </div>
        </div>
      </main>
      <WalletModal
        isModalOpen={isWalletModalOpen}
        closeWalletModal={closeWalletModal}
        setLoading={setLoading}
      />
    </div>
  );
};
