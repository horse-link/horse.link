import { ReactComponent as MetaMaskIcon } from "./metamask.svg";
import { ReactComponent as WalletConnectIcon } from "./walletConnect.svg";
import { ReactComponent as HorseLinkIcon } from "./horselink.svg";

export const SVG_ICONS: Record<string, SvgIcon> = {
  MetaMask: MetaMaskIcon,
  WalletConnect: WalletConnectIcon,
  HorseLink: HorseLinkIcon
};

export { FaHorseHead as HorseHeadIcon } from "react-icons/fa";
export { default as TokenomicsChart } from "./chart.svg";

import { default as USDT } from "./tether.png";
import { default as DAI } from "./dai.png";
import { default as HL } from "./hl.png";
import { SvgIcon } from "../types/general";

export const CRYPTO_ICONS: Record<string, string> = {
  USDT,
  DAI,
  HL
};
