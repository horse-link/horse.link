import { useMemo } from "react";
import { SignedRunnersResponse } from "../../types";
import useSwr from "../useSwr";

type Props = {
  track: string;
  raceNumber: number;
};

const useRunnerData = ({ track, raceNumber }: Props) => {
  const { data, isLoading, error } = useSwr<SignedRunnersResponse>(
    `/runners/${track}/${raceNumber}/win`
  );

  const runners = useMemo(() => {
    if (!data || error) return;

    // data.data is the SignedRunnersResponse from api
    return data.data;
  }, [data, error]);

  return {
    runners,
    isLoading,
    error
  };
};

export default useRunnerData;
