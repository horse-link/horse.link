import { useContext } from "react";
import { GlobalErrorContext, GlobalErrorType } from "../providers/GlobalError";

const useGlobalError = (): GlobalErrorType => {
  return useContext(GlobalErrorContext) as GlobalErrorType;
};

export default useGlobalError;
