import { Back } from "../../types";
import BackView from "./Back_View";
import { useParams, useSearchParams } from "react-router-dom";

const BackLogic: React.FC = () => {
  const { propositionId } = useParams();
  const [searchParams] = useSearchParams();

  const odds = searchParams.get("odds");
  const signature = searchParams.get("signature");

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
