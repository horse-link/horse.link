import React, { useEffect, useState } from "react";
import { Meet } from "../../types/meets";
import { NewTable } from "./NewTable";
import { Link } from "react-router-dom";
import utils from "../../utils";
import dayjs from "dayjs";
import constants from "../../constants";
import utc from "dayjs/plugin/utc";
import classNames from "classnames";
import { RaceStatus } from "../../constants/status";
import { Loader } from "../Loader";
import { Disclosure } from "@headlessui/react";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";

dayjs.extend(utc);

type Props = {
  meets?: Array<Meet>;
};

export const NewHomeTable: React.FC<Props> = ({ meets }) => {
  const [time, setTime] = useState(dayjs());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs());
    }, constants.time.ONE_SECOND_MS);

    return () => clearInterval(interval);
  }, []);

  const totalRaces = meets
    ? meets.reduce(
        (prev, cur) => (cur.races.length > prev ? cur.races.length : prev),
        0
      )
    : 0;

  const headers = [
    <div
      className="w-[350px] py-4 text-left font-black text-white"
      key={`hometable-race-location`}
    >
      LOCATION
    </div>,
    ...Array.from({ length: totalRaces }, (_, i) => (
      <div
        className={classNames("w-full py-4 text-center text-hl-secondary")}
        key={`hometable-race-${i}`}
      >
        R{i + 1}
      </div>
    ))
  ];

  const rows = meets
    ? meets.map(meet => [
        <div key={meet.id} className="flex w-[350px] items-center gap-x-4">
          <img
            src="/images/horse.webp"
            alt="HorseLink logo"
            className="max-w-[3rem]"
          />
          <p className="w-full py-4 text-left font-basement text-sm font-black tracking-wider text-white">
            {meet.name} ({meet.location})
          </p>
        </div>,
        ...meet.races.map(race => {
          const text = utils.races.createCellText(race, time);

          return (
            <div
              className={classNames("flex h-full w-full justify-center")}
              key={JSON.stringify(race)}
            >
              <Link
                to={utils.races.createRacingLink(race, meet)}
                className={classNames(
                  "flex h-full w-full items-center justify-center break-words text-center text-hl-tertiary",
                  {
                    "!bg-hl-primary !text-hl-background":
                      race.status === RaceStatus.PAYING,
                    "!bg-hl-secondary !text-hl-background":
                      race.status === RaceStatus.CLOSED || text === "CLSD",
                    "hover:!bg-hl-primary hover:!text-hl-secondary": ![
                      RaceStatus.CLOSED,
                      RaceStatus.PAYING
                    ].includes(race.status)
                  }
                )}
              >
                {text}
              </Link>
            </div>
          );
        }),
        ...Array.from({ length: totalRaces - meet.races.length }, (_, i) => (
          <div key={`hometable-blank-${i}`} className="w-full">
            <br />
          </div>
        ))
      ])
    : [];

  const loading = [
    [
      <div key="hometable-loading-blank" />,
      <div className="py-4" key="hometable-loading-message">
        Loading...
      </div>
    ]
  ];

  return (
    <React.Fragment>
      {/* non-mobile */}
      <div className="hidden lg:block">
        <NewTable
          headers={headers}
          headerStyles="font-basement tracking-wider"
          rows={!meets ? loading : rows}
        />
      </div>

      {/* mobile */}
      <div className="block lg:hidden">
        {!meets ? (
          <div className="flex w-full justify-center py-10">
            <Loader />
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            {meets.map(meet => (
              <Disclosure key={JSON.stringify(meet)}>
                {({ open }) => (
                  <React.Fragment>
                    <Disclosure.Button className="flex w-full items-center justify-between border-b border-hl-border py-2 font-basement text-xl tracking-wider text-hl-secondary">
                      <h2>{meet.name}</h2>
                      {open ? (
                        <HiChevronUp size={30} color="white" />
                      ) : (
                        <HiChevronDown size={30} color="white" />
                      )}
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      {meet.races.map(race => {
                        const text = utils.races.createCellText(race, time);

                        return (
                          <Link
                            key={JSON.stringify(race)}
                            to={utils.races.createRacingLink(race, meet)}
                            className="flex w-full items-center justify-between border-t border-hl-border py-2"
                          >
                            <h3 className="w-[6rem] font-basement text-xs text-hl-secondary">
                              R{race.number}
                            </h3>
                            <p className="w-full text-xs font-black text-white">
                              {race.name}
                            </p>
                            <p className="w-[6rem] whitespace-nowrap text-right text-xs text-hl-secondary">
                              {text}
                            </p>
                          </Link>
                        );
                      })}
                    </Disclosure.Panel>
                  </React.Fragment>
                )}
              </Disclosure>
            ))}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
