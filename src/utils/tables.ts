import { ReactNode } from "react";
import { TableRow } from "../types/table";

export const getBlankRow = (
  title: ReactNode,
  length: number,
  blankIndex: number = 1
): TableRow[] => [
  {
    data: Array.from({ length }, (_, i) =>
      i == blankIndex
        ? {
            title,
            classNames: "!p-2 select-none"
          }
        : {
            title: "",
            classNames: "!p-2 select-none"
          }
    )
  }
];
