import React, { useEffect, useState } from "react";
import { WalletModal } from "./Modals";
import { useWalletModal } from "../providers/WalletModal";
import { Navbar } from "./Navbar";
import { useNavigate } from "react-router";
import { useWalletOverrides } from "../hooks/useWalletOverrides";
import { AccountPanel } from "./AccountPanel";
import { BetSlip } from "./BetSlip";
import { MobileNavbar } from "./MobileNavbar";
import { Footer } from "./Footer";
import { Transition } from "@headlessui/react";

type Props = {
  children: React.ReactNode;
};

export const PageLayout: React.FC<Props> = ({ children }) => {
  const { closeWalletModal, isWalletModalOpen } = useWalletModal();
  const navigate = useNavigate();
  const { isChainUnsupported, forceNewNetwork, isLocalWallet, setLoading } =
    useWalletOverrides();

  const [betsPageOpen, setBetsPageOpen] = useState(false);
  const toggleBetsPage = () => setBetsPageOpen(prev => !prev);

  useEffect(() => {
    if (isChainUnsupported === undefined) return;

    if (isChainUnsupported)
      navigate("/unsupported", {
        replace: true
      });
  }, [isChainUnsupported]);

  return (
    <React.Fragment>
      <div className="min-h-screen w-screen bg-hl-background text-hl-primary">
        {/* non-mobile navbar */}
        <div className="hidden w-full lg:block">
          <Navbar />
        </div>

        {/* mobile navbar */}
        <div className="fixed top-0 z-50 block w-full lg:hidden">
          <MobileNavbar toggleBetsPage={toggleBetsPage} />
        </div>

        <main className="w-full grid-cols-5 p-4 lg:grid">
          <div className="block pt-16 lg:hidden" />
          <div className="col-span-4">{children}</div>
          <div className="col-span-1 hidden px-4 lg:block">
            <div className="sticky top-4 flex w-full flex-col gap-y-6">
              <AccountPanel
                forceNewNetwork={forceNewNetwork}
                isLocalWallet={isLocalWallet}
              />
              <BetSlip />
            </div>
          </div>
        </main>
      </div>

      {/* bets page on mobile */}
      <Transition
        show={betsPageOpen}
        enter="transition-all duration-150"
        enterFrom="right-[100%] opacity-0"
        enterTo="right-[0%] opacity-100"
        leave="transition-all duration-150"
        leaveFrom="right-[0%] opacity-100"
        leaveTo="right-[100%] opacity-0"
      >
        <Transition.Child className="fixed top-0 block h-screen w-screen overflow-y-scroll bg-hl-background p-4 pb-24 lg:hidden">
          <div className="flex min-h-full w-full flex-col items-center gap-y-6 pt-16">
            <AccountPanel
              forceNewNetwork={forceNewNetwork}
              isLocalWallet={isLocalWallet}
            />
            <BetSlip />
          </div>
        </Transition.Child>
      </Transition>

      <div className="fixed bottom-0 z-50 block w-full lg:hidden">
        <Footer />
      </div>

      <WalletModal
        isModalOpen={isWalletModalOpen}
        closeWalletModal={closeWalletModal}
        setLoading={setLoading}
      />
    </React.Fragment>
  );
};
