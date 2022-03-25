import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

const ModalBody = React.forwardRef<HTMLDivElement, Props>(function ModalBody(
  props,
  ref
) {
  const { children, className, ...other } = props;

  return (
    <div className="mb-6 text-sm text-gray-700 dark:text-gray-400" ref={ref} {...other}>
      {children}
    </div>
  );
});

export default ModalBody;
