import { useNextToJumpData } from "../../hooks/data";
import { Loader } from "../Loader";
import { DashboardBannerRow } from ".";

export const DashboardNextToJumpBanner: React.FC = () => {
  const { nextMeets } = useNextToJumpData();

  return (
    <div className="flex lg:divide-x-2 divide-indigo-800 p-5 bg-indigo-700 rounded-lg mb-5 mt-1 text-white text-xs shadow-md overflow-hidden">
      {nextMeets ? (
        nextMeets.map(meet => (
          <DashboardBannerRow
            meet={meet}
            key={meet.meeting.jumperMeetingName}
          />
        ))
      ) : (
        <div className="w-full flex flex-col items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
