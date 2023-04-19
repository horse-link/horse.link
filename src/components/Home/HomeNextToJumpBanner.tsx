import { useNextToJumpData } from "../../hooks/data";
import { HomeBannerRow } from ".";

export const HomeNextToJumpBanner: React.FC = () => {
  const { nextMeets, missingLocations } = useNextToJumpData();
  missingLocations?.forEach(error => console.error(error));
  return nextMeets ? (
    <div className="flex w-full flex-wrap gap-x-12 gap-y-4 font-semibold 3xl:flex-nowrap">
      {nextMeets.map((meet, i) => (
        <HomeBannerRow
          meet={meet}
          index={i}
          key={
            // no unique key in meet
            JSON.stringify(meet)
          }
        />
      ))}
    </div>
  ) : null;
};
