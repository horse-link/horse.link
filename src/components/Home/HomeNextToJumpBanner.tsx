import { useNextToJumpData } from "../../hooks/data";
import { HomeBannerRow } from ".";

export const HomeNextToJumpBanner: React.FC = () => {
  const { nextMeets, missingLocations } = useNextToJumpData();
  missingLocations?.forEach(error => console.error(error));

  return nextMeets ? (
    <div className="flex w-full flex-wrap justify-between gap-y-4 font-semibold">
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
  ) : (
    <div className="w-full rounded-xl border border-hl-border py-4 text-center">
      loading...
    </div>
  );
};
