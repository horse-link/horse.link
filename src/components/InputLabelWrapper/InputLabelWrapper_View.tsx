import * as React from "react";

type Props = {
  label: string;
  htmlFor: string;
  children?: React.ReactNode;
};

const InputView: React.FC<Props> = props => {
  const { label, htmlFor } = props;

  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1">{props.children}</div>
    </div>
  );
};

export default InputView;
