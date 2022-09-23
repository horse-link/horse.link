import { useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

import BackView from "./Back_View";
import { WalletModalContext } from "../../providers/WalletModal";

import { Back } from "../../types";

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
    odds: odds ? parseFloat(odds) / 1000 : 0,
    proposition_id: propositionId || "",
    signature: signature || ""
  };

  return (
    <BackView
      back={back}
      openWalletModal={openWalletModal}
      isWalletConnected={isWalletConnected}
    />
  );
};

export default BackLogic;
