import React from "react";
import { BaseTable } from ".";
import { TableData, TableHeader, TableRow } from "../../types/table";
import { Meet } from "../../types/meets";
import utils from "../../utils";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { HomeTableRace } from "../Home";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(advancedFormat);

const LOADING_LENGTH = 15;

type Props = {
  meets?: Meet[];
};

export const HomeTable: React.FC<Props> = ({ meets }) => {
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
        <HomeTableRace meet={meet} race={race} key={JSON.stringify(race)} />
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
      leftColumnSticky
    />
  );
};
