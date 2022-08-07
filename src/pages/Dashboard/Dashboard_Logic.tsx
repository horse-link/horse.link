import DashboardView from "./Dashboard_View";
import moment from "moment";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useMarket from "../../hooks/useMarket";

// import useSWR from "swr";

type Props = {};

export type SignedResponse = {
  data: Meet[];
  signature: string;
  hash: string;
}

export type Meet = {
  id: string;
  name: string;
  location: string;
};

const Dashboard: React.FC<Props> = () => {
  // const response: SignedResponse;
  const meets: Meet[] = [];

  const [{ data: accountData }] = useAccount({
    fetchEns: true
  });

  const connected = accountData !== undefined;

  const { inPlay, numberOfBets } = useMarket();
  const api = useApi();
  const [data, setData] = useState<Meet[]>(meets);
  // const [data, setData] = useState<SignedResponse>(meets);

  const load = async () => {
    const results: SignedResponse = await api.getMeetings();
    setData(results.data);
  };

  useEffect(() => {
      load();
  }, []);

  const asLocaltime = (raceTime: number) => {
    const _time = moment.utc(raceTime).diff(moment(), "h");
    if (Date.now() / 1000 > moment.utc(raceTime).unix()) {
      return "Completed";
    }

    return `${_time.toString()} hr`;
  }

  return <DashboardView asLocaltime={asLocaltime} meets={data} inPlay={inPlay} numberOfBets={numberOfBets} connected={connected} />;
};

export default Dashboard;
