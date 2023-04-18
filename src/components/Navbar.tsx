import React from "react";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
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
    <div className="flex w-full items-center gap-x-20 bg-hl-background-secondary px-10 py-6 font-basement text-hl-tertiary">
      <h2 className="text-3xl font-black">
        <span className="text-hl-secondary">HORSE</span>LINK
      </h2>
      {Routes.map(r => (
        <Link
          key={r.path}
          to={r.path}
          className={classNames("text-sm", {
            "underline decoration-hl-secondary underline-offset-4":
              r.path === currentPath
          })}
        >
          {r.name.toUpperCase()}
        </Link>
      ))}
    </div>
  );
};
