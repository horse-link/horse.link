import React from "react";
import { usePromise } from "../../hooks/usePromise";
import { useApi } from "../../providers/Api";
import { NewTable } from "./NewTable";
import classNames from "classnames";

export const MarketHistoryTable: React.FC = () => {
  const api = useApi();
  const history = usePromise(api.getMarketHistory);

  const headers = ["TxID", "Vault Address", "Amount", "Time", "Type"].map(
    (text, i) => (
      <div
        key={`markethistorytable-${text}-${i}`}
        className={classNames(
          "w-full py-4 text-left font-semibold text-hl-primary",
          {
            "!text-hl-secondary": [1, 4].includes(i)
          }
        )}
      >
        {text}
      </div>
    )
  );

  return (
    <React.Fragment>
      {/* non-mobile */}
      <div className="hidden lg:block">
        <NewTable
          headers={headers}
          headerStyles="font-basement tracking-wider"
          rows={[]}
        />
      </div>

      {/* mobile */}
      <div className="block lg:hidden"></div>
    </React.Fragment>
  );
};
