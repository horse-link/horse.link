import { useMemo } from "react";
import { SignedRunnersResponse } from "../../types/meets";
import useSwr from "../useSwr";

export const useRunnersData = (track: string, raceNumber: number) => {
  const { data, isLoading, error } = useSwr<SignedRunnersResponse>(
    `/runners/${track}/${raceNumber}/win`
  );

  const race = useMemo(() => {
    if (!data || error) return;

    // data.data is the SignedRunnersResponse from api
    const rData = data.data;
    if (rData.raceData.hasOdds) {
      return rData;
    }

    return {
      ...rData,
      runners: rData.runners.map(runner => {
        return {
          ...runner,
          odds: 1.0
        };
      })
    };
  }, [data, error]);

  return {
    race,
    isLoading,
    error
  };
};
