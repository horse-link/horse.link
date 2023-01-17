import { ReactNode } from "react";

export type HeaderProps = {
  title: ReactNode;
  classNames?: string;
};
export type DataProps = {
  title: ReactNode;
  classNames?: string;
  props?: React.HTMLAttributes<HTMLTableCellElement>;
};
export type RowProps = {
  data: DataProps[];
  row?: {
    classNames?: string;
    props?: React.HTMLAttributes<HTMLTableRowElement>;
  };
};
