import React, { useEffect, useState } from "react";
import { Meet } from "../../types/meets";
import { NewTable } from "./NewTable";
import { Link } from "react-router-dom";
import utils from "../../utils";
import dayjs from "dayjs";
import constants from "../../constants";
import utc from "dayjs/plugin/utc";
// import classNames from "classnames";

// TODO: use for text coloring
dayjs.extend(utc);

type Props = {
  meets: Array<Meet>;
};

export const NewHomeTable: React.FC<Props> = ({ meets }) => {
  const [time, setTime] = useState(dayjs());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs());
    }, constants.time.ONE_SECOND_MS);

    return () => clearInterval(interval);
  }, []);

  const totalRaces = meets.reduce(
    (prev, cur) => (cur.races.length > prev ? cur.races.length : prev),
    0
  );

  const headers = [
    <div className="w-full py-4 text-left font-basement font-black text-white">
      LOCATION
    </div>,
    ...Array.from({ length: totalRaces }, (_, i) => (
      <div className="w-full py-4 text-right text-hl-secondary">R{i + 1}</div>
    ))
  ];

  const rows = meets.map(meet => [
    <div className="w-full py-4 text-left font-basement font-black text-white">
      {meet.name} ({meet.location})
    </div>,
    ...meet.races.map(race => (
      <div className="h-full w-full">
        <Link
          to={utils.races.createRacingLink(race, meet)}
          // TODO: fix hovering
          className="flex h-full w-full items-center justify-end text-hl-tertiary hover:bg-hl-primary hover:text-hl-secondary"
        >
          {utils.races.createCellText(race, time)}
        </Link>
      </div>
    )),
    ...Array.from({ length: totalRaces - meet.races.length }, () => <div />)
  ]);

  return <NewTable headers={headers} rows={rows} />;
};
