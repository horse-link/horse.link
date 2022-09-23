import { useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

import BackView from "./Back_View";
import { WalletModalContext } from "../../providers/WalletModal";

import { Back } from "../../types";

const DECIMALS = 6;

const BackLogic: React.FC = () => {
  const { propositionId } = useParams();
  const [searchParams] = useSearchParams();

  const odds = searchParams.get("odds");
  const signature = searchParams.get("signature");

  const { openWalletModal } = useContext(WalletModalContext);
  const { address } = useAccount();
  const isWalletConnected = address ? true : false;

  const back: Back = {
    number: 0,
    name: "",
    nonce: "",
    market_id: "bne",
    close: 0,
    end: 0,
    odds: odds ? parseFloat(odds) : 0,
    proposition_id: propositionId || "",
    signature: signature || ""
  };

  const targetOdds = back.odds / 1000;

  return (
    <BackView
      back={back}
      openWalletModal={openWalletModal}
      isWalletConnected={isWalletConnected}
      DECIMALS={DECIMALS}
      targetOdds={targetOdds}
    />
  );
};

export default BackLogic;
