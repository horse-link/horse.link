import React from "react";
import { Link } from "react-router-dom";

type Props = {
  toggleBetsPage: () => void;
};

export const MobileNavbar: React.FC<Props> = ({ toggleBetsPage }) => (
  <div className="flex w-full items-center justify-between bg-hl-background-secondary py-3 px-4 font-basement text-xl tracking-wider text-hl-secondary">
    <Link to="/">
      HORSE<span className="text-hl-primary">LINK</span>
    </Link>
    <button
      onClick={toggleBetsPage}
      className="font-sans text-base text-hl-tertiary"
    >
      ACCOUNT
    </button>
  </div>
);
