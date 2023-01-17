import { ReactNode } from "react";

export type TableHeader = {
  title: ReactNode;
  classNames?: string;
};

export type TableData = {
  title: ReactNode;
  classNames?: string;
  props?: React.HTMLAttributes<HTMLTableCellElement>;
};

export type TableRow = {
  data: TableData[];
  row?: {
    classNames?: string;
    props?: React.HTMLAttributes<HTMLTableRowElement>;
  };
};
