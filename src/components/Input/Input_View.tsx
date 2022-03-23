import * as React from "react";
import classnames from "classnames";

export type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const InputView: React.FC<Props> = props => {
  const { className, error, ...restOfProps } = props;

  return (
    <div>
      <input
        className={classnames(
          className,
          {
            "border-red-600": error
          },
          "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        )}
        {...restOfProps}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputView;
