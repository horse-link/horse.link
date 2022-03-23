import React from "react";
import { AuthContext, AuthContextType } from "../providers/Auth";

const useAuth = (): AuthContextType => {
  return React.useContext(AuthContext) as AuthContextType;
};

export default useAuth;
