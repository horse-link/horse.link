import {
  QuickForm,
  QuickFormInput,
  InputLabelWrapper,
  AuthPage
} from "../../components";
import loginValidator from "../../utils/validators/login-validator";

type Props = {
  login(data: any): Promise<void>;
  error: string | undefined;
};

const LoginView: React.FC<Props> = props => {
  return (
    <AuthPage title="Log in to your account">
      <QuickForm<any>
        initialValues={{
          email: "",
          password: ""
        }}
        validator={loginValidator}
        onSubmit={props.login}
        error={props.error}
        buttonTitle="Log in"
      >
        <div className="my-6 space-y-6">
          <InputLabelWrapper label="Email Address" htmlFor="email">
            <QuickFormInput id="email" name="email" type="email" />
          </InputLabelWrapper>

          <InputLabelWrapper label="Password" htmlFor="password">
            <QuickFormInput id="password" name="password" type="password" />
          </InputLabelWrapper>

          <div className="text-sm">
            <span className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </span>
          </div>
        </div>
      </QuickForm>
    </AuthPage>
  );
};

export default LoginView;
