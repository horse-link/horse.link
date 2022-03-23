import { FormikHelpers } from "formik";

export type FormikOnSubmit<Values> = (
  values: Values,
  formikHelpers: FormikHelpers<Values>
) => void | Promise<void>;
