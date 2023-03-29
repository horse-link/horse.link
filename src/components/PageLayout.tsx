import React, { useEffect } from "react";
import { WalletModal } from "./Modals";
import { useWalletModal } from "../providers/WalletModal";
import { BetSlip } from "./BetSlip";
import { Navbar } from "./Navbar";
import { AccountPanel } from "./AccountPanel";
import { useNavigate } from "react-router";
import { useWalletOverrides } from "../hooks/useWalletOverrides";

type Props = {
  children: React.ReactNode;
};

export const PageLayout: React.FC<Props> = ({ children }) => {
  const { closeWalletModal, isWalletModalOpen } = useWalletModal();
  const navigate = useNavigate();
  const { isChainUnsupported } = useWalletOverrides();

  useEffect(() => {
    if (isChainUnsupported === undefined) return;

    if (isChainUnsupported)
      navigate("/unsupported", {
        replace: true
      });
  }, [isChainUnsupported]);

  return (
    <div className="min-h-screen bg-emerald-500">
      <Navbar />
      <div className="py-4">
        <main>
          <div className="max-w-9xl mx-auto px-4 pt-1 sm:px-6 lg:grid lg:grid-cols-5 lg:px-9">
            <div className="lg:col-span-4">{children}</div>
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-4">
                <AccountPanel />
                <BetSlip />
              </div>
            </div>
          </div>
          <WalletModal
            isModalOpen={isWalletModalOpen}
            closeWalletModal={closeWalletModal}
          />
        </main>
      </div>
    </div>
  );
};
