import React from "react";
import classnames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { NavbarRouting } from "../Routing";
import { useNetwork } from "wagmi";
import { goerli } from "@wagmi/chains";

export const Navbar: React.FC = () => {
  const { pathname: currentPath } = useLocation();
  const { chain } = useNetwork();
  const isGoerli = chain?.id === goerli.id;

  const Routes = NavbarRouting.filter(r => {
    if (!isGoerli) {
      const withoutLeaderboard = !r.path.includes("leaderboard");
      const withoutFaucet = !r.path.includes("faucet");

      return withoutLeaderboard && withoutFaucet;
    }

    return true;
  });

  return (
    <Disclosure as="nav" className="border-b border-emerald-200 bg-white">
      {({ open }) => (
        <React.Fragment>
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="hidden sm:-my-px sm:flex sm:space-x-8">
                  {Routes.map(item => {
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

                          "inline-flex items-center border-b-4 px-1 pt-1 text-sm font-medium"
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
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:bg-gray-100 hover:text-gray-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {Routes.map(item => {
                const active = item.path === currentPath;

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={classnames(
                      {
                        "border-indigo-500 bg-indigo-50 text-indigo-700":
                          active,
                        "border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700":
                          !active
                      },
                      "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </Disclosure.Panel>
        </React.Fragment>
      )}
    </Disclosure>
  );
};
