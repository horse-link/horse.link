import { useEffect, useState } from "react";
import { Runner, SignedRunnersResponse } from "../../types";
import BackView from "./Back_View";
import { useParams } from "react-router-dom";

type Props = {};

const Back: React.FC<Props> = () => {

  const { proposition_id, signature } = useParams();

  const runner: Runner = {
    number: 0,
    name: "",
    nonce: "",
    market_id: "bne",
    close: 0,
    end: 0,
    odds: 0,
    proposition_id: proposition_id || "",
    barrier: 0,
    signature: signature || ""
  };

  return <BackView runner={runner} />;
};

export default Back;
