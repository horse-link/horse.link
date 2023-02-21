import { useNextToJumpData } from "../../hooks/data";
import { Loader } from "../Loader";
import { HomeBannerRow } from ".";

export const HomeNextToJumpBanner: React.FC = () => {
  const { nextMeets } = useNextToJumpData();

  return (
    <div className="mb-5 flex divide-indigo-800 overflow-hidden rounded-lg bg-indigo-600 p-5 text-xs text-white shadow-md lg:divide-x-2">
      {nextMeets ? (
        nextMeets.map(meet => (
          <HomeBannerRow
            meet={meet}
            key={
              // no unique key in meet
              JSON.stringify(meet)
            }
          />
        ))
      ) : (
        <div className="flex w-full flex-col items-center">
          <Loader />
        </div>
      )}
    </div>
  );
};
