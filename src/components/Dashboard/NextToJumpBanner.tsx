import moment from "moment";
import { NextToJump } from "../../types/meets";

type Props = {
  NextToJump?: NextToJump[];
};

export const NextToJumpBanner: React.FC<Props> = ({ NextToJump }) => {
  {
    NextToJump?.filter(jumper =>
      console.log(jumper.jumperRaceStartTime, "JASMIN")
    );
    // console.log(NextToJump., "COOPER");
  }
  return (
    <div className="bg-indigo-500  mt-5 rounded-lg mb-5 overflow-x-scroll">
      <div className="mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between p-5">
          <div className="flex flex-row divide-x-2 pl-2 divide-indigo-700">
            {NextToJump?.map(jumper => (
              <div className="text-xs px-5 font-medium ">
                {`${jumper.meeting.jumperMeetingName} (${jumper.meeting.location}) - R${jumper.jumperRaceNumber}
                `}
                <div className="box-border text-sx font-bold">
                  {` ${moment(jumper.jumperRaceStartTime).fromNow(true)}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
