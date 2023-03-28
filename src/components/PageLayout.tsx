import React, { useEffect, useLayoutEffect, useState } from "react";
import { WalletModal } from "./Modals";
import { useWalletModal } from "../providers/WalletModal";
import { BetSlip } from "./BetSlip";
import { Navbar } from "./Navbar";
import { AccountPanel } from "./AccountPanel";
import { useAccount, useConnect, useNetwork } from "wagmi";
import { useNavigate } from "react-router";

type Props = {
  children: React.ReactNode;
};

export const PageLayout: React.FC<Props> = ({ children }) => {
  const { closeWalletModal, isWalletModalOpen } = useWalletModal();
  const { chain } = useNetwork();
  const navigate = useNavigate();
  const { connect, connectors } = useConnect();
  const { connector, isConnected } = useAccount();

  // last known values
  const [lastConnector, setLastConnector] = useState(
    connector || connectors[0]
  );
  useEffect(() => {
    if (!connector) return;

    setLastConnector(connector);
  }, [connector]);

  // attempt reconnect
  useLayoutEffect(() => {
    if (isConnected) return;

    connect({
      connector: lastConnector
    });
  }, [isConnected]);

  useEffect(() => {
    if (!chain) return;

    if (chain.unsupported)
      navigate("/unsupported", {
        replace: true
      });
  }, [chain]);

  console.log(isConnected);

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
