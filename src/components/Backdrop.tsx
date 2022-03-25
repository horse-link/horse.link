import React from "react";

export type BackdropProps = React.HTMLAttributes<HTMLDivElement>;

const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  function Backdrop(props, ref) {
    const { className, ...other } = props;
    return <div className="fixed inset-0 z-40 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center" ref={ref} {...other}></div>;
  }
);

export default Backdrop;
