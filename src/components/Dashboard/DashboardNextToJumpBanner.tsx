import { useNextToJumpData } from "../../hooks/data";
import { Loader } from "../Loader";
import { DashboardBannerRow } from ".";
import { useConfig } from "../../providers/Config";

export const DashboardNextToJumpBanner: React.FC = () => {
  const { nextMeets } = useNextToJumpData();
  const config = useConfig();

  return (
    <div className="flex lg:divide-x-2 divide-indigo-800 p-5 bg-indigo-600 rounded-lg mb-5 mt-1 text-white text-xs shadow-md overflow-hidden">
      {nextMeets && config ? (
        nextMeets.map(meet => (
          <DashboardBannerRow
            meet={meet}
            key={meet.jumperRaceStartTime}
            config={config}
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
