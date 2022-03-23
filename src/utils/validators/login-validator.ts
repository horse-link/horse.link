import validator from "validator";

const loginValidator = ({ email, password }: any) => {
  const errors: {
    email?: string;
    password?: string;
  } = {};
  if (!validator.isEmail(email))
    errors.email = "Please enter a valid email address";
  if (!password) errors.password = "Please enter a password";
  return errors;
};

export default loginValidator;
