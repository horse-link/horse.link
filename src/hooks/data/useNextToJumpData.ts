import { useMemo } from "react";
import { NextToJump } from "../../types/meets";
import useSwr from "../useSwr";

export const useNextToJumpData = () => {
  const ONE_SECOND = 1000;
  const { data, isLoading, error } = useSwr<NextToJump[]>(
    "/meetings/next",
    ONE_SECOND * 15
  );

  const nextMeets = useMemo(() => {
    if (!data || error) return;

    // data.slice(0, 5) so that only the next 5 races are returned
    return data.slice(0, 5);
  }, [data, error]);

  return {
    nextMeets,
    isLoading,
    error
  };
};
