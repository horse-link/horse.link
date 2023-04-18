import React, { useEffect, useState } from "react";
import { Meet } from "../../types/meets";
import { NewTable } from "./NewTable";
import { Link } from "react-router-dom";
import utils from "../../utils";
import dayjs from "dayjs";
import constants from "../../constants";
import utc from "dayjs/plugin/utc";

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
    <div
      className="w-full py-4 text-left font-basement font-black text-white"
      key={`hometable-race-location`}
    >
      LOCATION
    </div>,
    ...Array.from({ length: totalRaces }, (_, i) => (
      <div
        className="w-full py-4 text-right text-hl-secondary"
        key={`hometable-race-${i}`}
      >
        R{i + 1}
      </div>
    ))
  ];

  const rows = meets.map(meet => [
    <div
      className="w-full py-4 text-left font-basement font-black text-white"
      key={meet.id}
    >
      {meet.name} ({meet.location})
    </div>,
    ...meet.races.map(race => (
      <div
        className="flex h-full w-full justify-end"
        key={JSON.stringify(race)}
      >
        <Link
          to={utils.races.createRacingLink(race, meet)}
          className="relative left-[1rem] flex h-full w-fit items-center justify-end px-4 text-hl-tertiary hover:bg-hl-primary hover:text-hl-secondary"
        >
          {utils.races.createCellText(race, time)}
        </Link>
      </div>
    )),
    ...Array.from({ length: totalRaces - meet.races.length }, (_, i) => (
      <div key={`hometable-blank-${i}`} />
    ))
  ]);

  return <NewTable headers={headers} rows={rows} title="today" />;
};
