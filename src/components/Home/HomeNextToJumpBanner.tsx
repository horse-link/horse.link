import { useNextToJumpData } from "../../hooks/data";
import { HomeBannerRow } from ".";

export const HomeNextToJumpBanner: React.FC = () => {
  const { nextMeets, missingLocations } = useNextToJumpData();
  missingLocations?.forEach(console.error);

  return nextMeets ? (
    <div className="flex w-full justify-between gap-4 overflow-scroll lg:grid lg:grid-cols-6 lg:grid-rows-1 lg:overflow-auto">
      {[...nextMeets].map(meet => (
        <HomeBannerRow
          meet={meet}
          key={
            // no unique key in meet
            JSON.stringify(meet)
          }
        />
      ))}
    </div>
  ) : (
    <div className="w-full rounded-xl border border-hl-border py-4 text-center">
      loading...
    </div>
  );
};
