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
    <div className="bg-indigo-500  mt-5 rounded-lg mb-5">
      <div className="max-w-screen-2xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between p-5">
          <div className="flex">
            <div className="overflow-x-scroll sm:-my-px sm:flex sm:space-x-2">
              <div className="flex flex-row divide-x-4 pl-2 divide-indigo-700 mx-2 ml-4">
                {NextToJump?.map(jumper => (
                  <div className="text-xs">
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
    </div>
  );
};

// ${moment
//   .utc(jumper.jumperRaceStartTime)
//   .local()
//   .format("H:mm")}
