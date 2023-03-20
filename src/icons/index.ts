import { ReactComponent as MetaMaskIcon } from "./metamask.svg";
import { ReactComponent as WalletConnectLegacyIcon } from "./walletConnectLegacy.svg";
import { ReactComponent as HorseLinkIcon } from "./horselink.svg";

export const SVG_ICONS: Record<string, SvgIcon> = {
  MetaMask: MetaMaskIcon,
  WalletConnectLegacy: WalletConnectLegacyIcon,
  HorseLink: HorseLinkIcon
};

export { FaHorseHead as HorseHeadIcon } from "react-icons/fa";
export { default as TokenomicsChart } from "./chart.svg";

import { default as fxAUD } from "./fxAUD.png";
import { default as fxUSD } from "./fxUSD.png";
import { default as USDT } from "./tether.png";
import { default as DAI } from "./dai.png";
import { default as HL } from "./hl.png";
import { SvgIcon } from "../types/general";

export const CRYPTO_ICONS: Record<string, string> = {
  fxAUD,
  fxUSD,
  USDT,
  DAI,
  HL
};
