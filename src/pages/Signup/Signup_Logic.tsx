import * as React from "react";
import useApi from "../../hooks/useApi";
import useAuth from "../../hooks/useAuth";
import useGlobalError from "../../hooks/useGlobalError";
import { getApiError, getBadRequestMessage } from "../../utils/error";
import SignupView from "./Signup_View";

const Signup: React.FC = () => {
  const { login } = useAuth();
  const api = useApi();
  const { setGlobalError } = useGlobalError();
  const [error, setError] = React.useState<string>();

  const signup = async (data: any) => {
    try {
      const token = await api.signup({
        email: data.email.toLowerCase(),
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      });

      await login(token);
    } catch (error: any) {
      const apiError = getApiError(error);

      if (apiError?.reason === "bad_request" && apiError.type === "general") {
        return setError(getBadRequestMessage(apiError));
      }

      setGlobalError(error);
    }
  };

  return <SignupView signup={signup} error={error} />;
};

export default Signup;
