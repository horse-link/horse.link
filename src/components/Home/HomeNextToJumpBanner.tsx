import { useNextToJumpData } from "../../hooks/data";
import { HomeBannerRow } from ".";

export const HomeNextToJumpBanner: React.FC = () => {
  const { nextMeets, missingLocations } = useNextToJumpData();
  missingLocations?.forEach(error => console.error(error));
  return nextMeets ? (
    <div className="flex w-full gap-x-12 rounded-lg p-4 font-semibold">
      {nextMeets.map(meet => (
        <HomeBannerRow
          meet={meet}
          key={
            // no unique key in meet
            JSON.stringify(meet)
          }
        />
      ))}
    </div>
  ) : null;
};
