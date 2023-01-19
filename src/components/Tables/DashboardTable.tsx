import React from "react";
import { BaseTable } from ".";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { Meet } from "../../types/meets";
import utils from "../../utils";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import classnames from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const LOADING_LENGTH = 15;

type Props = {
  meets?: Meet[];
};

export const DashboardTable: React.FC<Props> = ({ meets }) => {
  const length = meets
    ? Math.max(...meets.map(m => m.races.length))
    : LOADING_LENGTH;

  const title = dayjs(Date.now()).format("dddd Do MMMM");

  const getDashboardData = (meet: Meet): TableData[] => [
    {
      title: `${meet.name} (${meet.location})`,
      classNames: "bg-gray-200"
    },
    ...meet.races.map(race => ({
      title: (
        <Link
          className={classnames({
            "!cursor-default":
              race.status === "Interim" ||
              race.status === "Abandoned" ||
              race.status === "Closed"
          })}
          to={
            race.status === "Normal"
              ? `/races/${meet.id}/${race.number}`
              : race.status === "Paying"
              ? `/results/${utils.markets.getPropositionIdFromRaceMeet(
                  race,
                  meet
                )}`
              : // race status in any other condition other than normal or paying
                ""
          }
        >
          <div
            className={classnames("px-3 py-4 whitespace-nowrap text-sm", {
              "bg-gray-400 hover:bg-gray-500": race.status === "Paying",
              "bg-black text-white": race.status === "Abandoned",
              "bg-emerald-400": race.status === "Interim",
              "hover:bg-gray-200": race.status === "Normal"
            })}
          >
            <p>R{race.number}</p>
            {dayjs.utc(race.start).local().format("H:mm")}
            <p>
              {race.status == "Paying"
                ? race.results?.join(" ")
                : race.status == "Abandoned"
                ? "ABND"
                : dayjs(race.close).fromNow(true)}
            </p>
          </div>
        </Link>
      ),
      classNames: "!p-0"
    })),
    ...Array.from({ length: length - meet.races.length }, () => ({
      title: ""
    }))
  ];

  const HEADERS: TableHeader[] = [
    {
      title: "Venue",
      classNames: "bg-gray-200 !w-[14rem]"
    },
    ...Array.from({ length }, (_, i) => ({
      title: `Race ${i + 1}`
    }))
  ];

  const blankDashboardRows: TableRow[] = utils.mocks
    .getMockRaces(LOADING_LENGTH)
    .map(() => ({
      data: Array.from({ length: HEADERS.length }, () => ({
        title: <Skeleton count={2} />
      }))
    }));

  const ROWS: TableRow[] = meets
    ? meets.map(meet => ({
        data: getDashboardData(meet)
      }))
    : blankDashboardRows;

  return (
    <BaseTable
      title={title}
      tableStyles="-mt-12"
      headers={HEADERS}
      rows={ROWS}
    />
  );
};
