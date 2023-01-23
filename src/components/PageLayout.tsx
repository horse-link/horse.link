import React from "react";
import classnames from "classnames";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { WalletModal } from "./Modals";
import { ConnectWalletButton } from "./Buttons";
import { useWalletModal } from "../providers/WalletModal";
import { BetSlip } from "./BetSlip";

const navigation = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Vaults", path: "/vaults" },
  { name: "Markets", path: "/markets" },
  { name: "Bets", path: "/bets" },
  //{ name: "HL Token", path: "/tokens" },
  // {
  //   name: "White Paper",
  //   path: "https://github.com/horse-link/horse.link/blob/main/README.md",
  //   absolutePath: true
  // },
  { name: "Faucet", path: "/faucet" }
];

type Props = {
  children: React.ReactNode;
};

export const PageLayout: React.FC<Props> = ({ children }) => {
  const { pathname: currentPath } = useLocation();
  const { openWalletModal, closeWalletModal, isWalletModalOpen } =
    useWalletModal();

  return (
    <div className="min-h-screen bg-emerald-500">
      <Disclosure as="nav" className="bg-white border-b border-emerald-200">
        {({ open }) => (
          <React.Fragment>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="hidden sm:-my-px sm:flex sm:space-x-8">
                    {navigation.map(item => {
                      const active = item.path === currentPath;

                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={classnames(
                            {
                              "border-emerald-700 text-gray-900": active,
                              "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700":
                                !active
                            },

                            "inline-flex items-center px-1 pt-1 border-b-4 text-sm font-medium"
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden sm:flex">
                  <ConnectWalletButton openWalletModal={openWalletModal} />
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map(item => {
                  const active = item.path === currentPath;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={classnames(
                        {
                          "bg-indigo-50 border-indigo-500 text-indigo-700":
                            active,
                          "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700":
                            !active
                        },
                        "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                <ConnectWalletButton openWalletModal={openWalletModal} />
              </div>
            </Disclosure.Panel>
          </React.Fragment>
        )}
      </Disclosure>
      <div className="py-4">
        <main>
          <WalletModal
            isModalOpen={isWalletModalOpen}
            closeWalletModal={closeWalletModal}
          />
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-9 lg:grid lg:grid-cols-5 pt-1">
            <div className="lg:col-span-4">{children}</div>
            <div className="lg:col-span-1">
              <BetSlip />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
