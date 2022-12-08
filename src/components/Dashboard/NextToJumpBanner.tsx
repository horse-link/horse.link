import { HorseHeadIcon } from "../../icons";
import { NextToJump } from "../../types/meets";

type Props = {
  NextToJump?: NextToJump[];
};

export const NextToJumpBanner: React.FC<Props> = ({ NextToJump }) => {
  console.log(NextToJump, "JASMIN");
  return (
    <div className="bg-indigo-500 text-white mt-5">
      <div className="max-w-screen-2xl mx-auto sm:px-6 lg:px-8">
        <div className="flex justify-between p-5">
          <div className="flex">
            <div className="hidden sm:-my-px sm:flex sm:space-x-8">
              <HorseHeadIcon className="w-5 h-5" />
              {NextToJump?.map(jumper => (
                <tr>
                  <td className="text-white">
                    {jumper?.jumperMeetingName} {jumper?.location}
                  </td>
                  <td></td>
                </tr>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
