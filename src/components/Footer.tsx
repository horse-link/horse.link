import React from "react";
import { FaHome } from "react-icons/fa";
import { GiCrestedHelmet, GiHorseHead } from "react-icons/gi";
import { TbCurrencyDollar } from "react-icons/tb";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => (
  <div className="grid w-full grid-cols-4 grid-rows-1 bg-white py-2">
    <Link
      to="/"
      className="flex h-fit w-full flex-col items-center justify-center"
    >
      <FaHome color="black" size={40} />
      <label className="text-hl-background">HOME</label>
    </Link>
    <Link
      to="/vaults"
      className="flex h-fit w-full flex-col items-center justify-center"
    >
      <GiCrestedHelmet color="black" size={40} />
      <label className="text-hl-background">VAULTS</label>
    </Link>
    <Link
      to="/markets"
      className="flex h-fit w-full flex-col items-center justify-center"
    >
      <TbCurrencyDollar color="black" size={40} />
      <label className="text-hl-background">MARKETS</label>
    </Link>
    <Link
      to="/bets"
      className="flex h-fit w-full flex-col items-center justify-center"
    >
      <GiHorseHead color="black" size={40} />
      <label className="text-hl-background">BETS</label>
    </Link>
  </div>
);
