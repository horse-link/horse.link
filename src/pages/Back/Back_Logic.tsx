import { Back } from "../../types";
import BackView from "./Back_View";
import { useLocation, useParams } from "react-router-dom";
import { useMemo } from "react";

type Props = {};

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const BackLogic: React.FC<Props> = () => {
  const { propositionId } = useParams();
  const query = useQuery();

  const odds = query.get("odds");
  const signature = query.get("signature");

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

  return <BackView back={back} />;
};

export default BackLogic;
