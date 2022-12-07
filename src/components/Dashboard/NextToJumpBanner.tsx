import { NextToJump } from "../../types/meets";

type Props = {
  NextToJump: NextToJump[];
};

export const NextToJumpBanner: React.FC<Props> = ({ NextToJump }) => {
  {
    NextToJump;
  }
  return (
    <div className="flex flexrow p-5 outline-1 text-gray-500 w-full">
      <p>pony Pic</p>
      <p>meetingName</p>
      <p>location</p>
      <p>raceNumber</p>
      <p>startTime</p>;
    </div>
  );
};
