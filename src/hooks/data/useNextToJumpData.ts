import { useMemo } from "react";
import { NextToJump } from "../../types/meets";
import useSwr from "../useSwr";

export const useNextToJumpData = () => {
  const { data, isLoading, error } = useSwr<NextToJump[]>("/meetings/next");

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
