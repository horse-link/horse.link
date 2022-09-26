import { useState } from "react";
import { useParams } from "react-router-dom";
import DepositView from "./Deposit_View";

const DepositLogic = () => {
  const { vaultId } = useParams();

  const [depositAmount, setDepositAmount] = useState(0);
  const updateDepositAmount = (amount: number) => {
    setDepositAmount(amount);
  };
  const symbol = "USDT";
  const contract = {
    write: () => {
      //TODO
    },
    isError: false,
    errorMsg: ""
  };
  const txStatus = {
    isLoading: false,
    isSuccess: false,
    hash: ""
  };

  return (
    <DepositView
      symbol={symbol || ""}
      depositAmount={depositAmount}
      updateDepositAmount={updateDepositAmount}
      contract={contract}
      txStatus={txStatus}
    />
  );
};

export default DepositLogic;
