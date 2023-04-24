import dayjs from "dayjs";
import React from "react";
import { Params, useNavigate } from "react-router-dom";
import { RaceInfo } from "../../types/meets";
import { RaceStatus } from "../../constants/status";
import { NewButton } from "./NewButton";

type Props = {
  meetRaces?: RaceInfo[];
  params: Params<string>;
};

export const RacesButton: React.FC<Props> = ({ meetRaces, params }) => {
  const navigate = useNavigate();
  const currentRace = Number(params.number) || 0;

  return params && meetRaces ? (
    <div className="flex flex-wrap gap-2">
      {meetRaces.map(race => (
        <NewButton
          key={`race${race.raceNumber}`}
          text={`R${race.raceNumber}`}
          onClick={() =>
            navigate(
              race.raceStatus === RaceStatus.NORMAL
                ? `/races/${params.track || ""}/${race.raceNumber}`
                : race.raceStatus === RaceStatus.PAYING
                ? `/results/${dayjs().format("YYYY-MM-DD")}_${params.track}_${
                    race.raceNumber
                  }_W1`
                : // race raceStatus in any other condition other than normal or paying
                  ""
            )
          }
          disabled={
            race.raceStatus === RaceStatus.INTERIM ||
            race.raceStatus === RaceStatus.ABANDONED
          }
          active={currentRace === race.raceNumber}
        />
      ))}
    </div>
  ) : null;
};
