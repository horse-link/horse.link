import { useEffect, useState } from "react";
import { Back } from "../../types";
import BackView from "./Back_View";
import { useParams } from "react-router-dom";

type Props = {};

const BackLogic: React.FC<Props> = () => {

  const { proposition_id, signature } = useParams();

  const back: Back = {
    number: 0,
    name: "",
    nonce: "",
    market_id: "bne",
    close: 0,
    end: 0,
    odds: 0,
    proposition_id: proposition_id || "",
    signature: signature || ""
  };

  return <BackView back={back} />;
};

export default BackLogic;
