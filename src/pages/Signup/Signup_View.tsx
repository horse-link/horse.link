import {
  QuickForm,
  QuickFormInput,
  InputLabelWrapper,
  AuthPage
} from "../../components";
import signupValidator from "../../utils/validators/signup-validator";

type Props = {
  signup(data: any): Promise<void>;
  error: string | undefined;
};

const SignupView: React.FC<Props> = props => {
  return (
    <AuthPage title="Sign Up">
      <QuickForm<any>
        initialValues={{ email: "", password: "", firstName: "", lastName: "" }}
        validator={signupValidator}
        onSubmit={props.signup}
        error={props.error}
        buttonTitle="Sign Up"
      >
        <div className="my-6 space-y-6">
          <InputLabelWrapper label="First Name" htmlFor="firstName">
            <QuickFormInput id="firstName" name="firstName" type="text" />
          </InputLabelWrapper>

          <InputLabelWrapper label="Last Name" htmlFor="lastName">
            <QuickFormInput id="lastName" name="lastName" type="text" />
          </InputLabelWrapper>

          <InputLabelWrapper label="Email Address" htmlFor="email">
            <QuickFormInput id="email" name="email" type="email" />
          </InputLabelWrapper>

          <InputLabelWrapper label="Password" htmlFor="password">
            <QuickFormInput id="password" name="password" type="password" />
          </InputLabelWrapper>
        </div>
      </QuickForm>
    </AuthPage>
  );
};

export default SignupView;
