import React from "react";
import Api from "../apis/Api";
import { ApiContext } from "../providers/Api";

const useApi = (): Api => {
  return React.useContext(ApiContext);
};

export default useApi;
