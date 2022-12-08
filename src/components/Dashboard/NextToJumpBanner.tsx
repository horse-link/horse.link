import moment from "moment";
import { HorseHeadIcon } from "../../icons";
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
    <div className="bg-indigo-500 text-white mt-5 flex-end">
      <div className="max-w-screen-2xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between p-5">
          <div className="flex">
            <div className="hidden sm:-my-px sm:flex sm:space-x-8">
              {/* <HorseHeadIcon className="w-15 h-15" /> */}
              {NextToJump?.map(jumper => (
                <div className="flex flex-row text-xs">
                  {`${jumper.meeting.jumperMeetingName} (${
                    jumper.meeting.location
                  }) - R${jumper.jumperRaceNumber} 
                  ${moment(jumper.jumperRaceStartTime).fromNow(true)}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ${moment
//   .utc(jumper.jumperRaceStartTime)
//   .local()
//   .format("H:mm")}
