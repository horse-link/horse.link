import moment from "moment";
import { NextToJump } from "../../types/meets";
import { Loader } from "../Loader";

type Props = {
  nextToJump?: NextToJump[];
};

export const DashboardNextToJumpBanner: React.FC<Props> = ({ nextToJump }) => (
  <div className="flex divide-x-2 divide-emerald-600 p-5 bg-white rounded-lg my-5 overflow-x-scroll">
    {nextToJump ? (
      nextToJump.map(jumper => (
        <div className="w-1/2 lg:w-1/5 shrink-0 flex flex-col items-center">
          <span className="block text-xs">
            {`${jumper.meeting.jumperMeetingName} (${jumper.meeting.location}) - R${jumper.jumperRaceNumber}`}
          </span>
          <span className="block">
            {` ${moment(jumper.jumperRaceStartTime).fromNow(true)}`}
          </span>
        </div>
      ))
    ) : (
      <div className="w-full flex flex-col items-center">
        <Loader />
      </div>
    )}
  </div>
);
