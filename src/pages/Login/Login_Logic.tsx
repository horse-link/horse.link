import * as React from "react";
import { useHistory } from "react-router";
import useApi from "../../hooks/useApi";
import useAuth from "../../hooks/useAuth";
import useGlobalError from "../../hooks/useGlobalError";
import LoginView from "./Login_View";

const Login: React.FC = () => {
  const { login: authLogin } = useAuth();
  const api = useApi();
  const history = useHistory();
  const { setGlobalError } = useGlobalError();
  const [error, setError] = React.useState<string>();

  const login = async (data: any) => {
    try {
      const token = await api.login(data);
      await authLogin(token);
      history.push("/");
    } catch (err: any) {
      if (err.statusCode) {
        const error: any = err;
        if (error.statusCode === 404) {
          const notFoundError = error as any;
          if (notFoundError.resource === "user") {
            return setError("Account not found. Please try again.");
          }
        }
      }

      setGlobalError(err.message);
    }
  };

  return <LoginView login={login} error={error} />;
};

export default Login;
