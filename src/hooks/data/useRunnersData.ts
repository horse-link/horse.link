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
    return data.data;
  }, [data, error]);

  return {
    race,
    isLoading,
    error
  };
};
