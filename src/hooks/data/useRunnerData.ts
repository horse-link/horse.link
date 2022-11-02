import { useMemo } from "react";
import useSWR from "swr";
import { SignedRunnersResponse } from "../../types";
import fetcher from "../../utils/fetcher";

type Props = {
  track: string;
  raceNumber: number;
};

const useRunnerData = ({ track, raceNumber }: Props) => {
  const { data, error } = useSWR(
    `/runners/${track}/${raceNumber}/win`,
    fetcher<SignedRunnersResponse>
  );

  const runners = useMemo(() => {
    if (!data || error) return;

    // data.data is the SignedRunnersResponse from api
    return data.data;
  }, [data, error]);

  return {
    runners,
    isLoading: !error && !data,
    error
  };
};

export default useRunnerData;
