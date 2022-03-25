import { useField } from "formik";
import React from "react";
import { Input } from "../";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const QuickFormInput: React.FC<Props> = props => {
  const [field, meta] = useField(props as any);

  const error = meta.error && meta.touched ? meta.error : undefined;

  return <Input {...props} {...field} error={error} />;
};

export default QuickFormInput;
