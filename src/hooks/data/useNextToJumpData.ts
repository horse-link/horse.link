import { useMemo } from "react";
import { NextToJump } from "horselink-sdk";
import useSwr from "../useSwr";
import constants from "../../constants";

export const useNextToJumpData = () => {
  const { data, isLoading, error } = useSwr<NextToJump>(
    "/meetings/next",
    constants.time.ONE_SECOND_MS * 15
  );

  const nextMeets = useMemo(() => {
    if (!data || error) return;
    // data.slice(0, 6) so that only the next 6 races are returned
    return data.races.slice(0, 6);
  }, [data, error]);

  const missingLocations = useMemo(() => {
    if (!data || error) return;

    return data.missingLocations;
  }, [data, error]);

  return {
    nextMeets,
    isLoading,
    missingLocations,
    error
  };
};
