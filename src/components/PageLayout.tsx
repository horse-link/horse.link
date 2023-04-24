import React, { useEffect } from "react";
import { WalletModal } from "./Modals";
import { useWalletModal } from "../providers/WalletModal";
import { Navbar } from "./Navbar";
import { useNavigate } from "react-router";
import { useWalletOverrides } from "../hooks/useWalletOverrides";
import { NewAccountPanel } from "./NewAccountPanel";
import { NewBetSlip } from "./NewBetSlip";
import { MobileNavbar } from "./MobileNavbar";

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
      {/* non-mobile navbar */}
      <div className="hidden w-full lg:block">
        <Navbar />
      </div>

      {/* mobile navbar */}
      <div className="block w-full lg:hidden">
        <MobileNavbar />
      </div>

      <main className="w-full grid-cols-5 p-4 lg:grid">
        <div className="col-span-4">{children}</div>
        <div className="col-span-1 hidden px-4 lg:block">
          <div className="sticky top-4 flex w-full flex-col gap-y-6">
            <NewAccountPanel
              forceNewNetwork={forceNewNetwork}
              isLocalWallet={isLocalWallet}
            />
            <NewBetSlip />
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
