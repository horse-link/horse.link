import validator from "validator";

type Payload = any & { confirmPassword: string };

const signupValidator = ({
  email,
  password,
  firstName,
  lastName
}: Payload): Partial<Payload> => {
  const errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  } = {};
  if (!validator.isEmail(email)) errors.email = "Please enter a valid email";
  if (!password) errors.password = "Please enter a password";
  if (!validator.isStrongPassword(password))
    errors.password =
      "Your password should be at least 1 uppercase, 1 lowercase, 1 number, 1 symbol and a minimum of 8 characters";
  if (!firstName) errors.firstName = "Please enter your first name";
  if (!lastName) errors.lastName = "Please enter your last name";

  return errors;
};

export default signupValidator;
