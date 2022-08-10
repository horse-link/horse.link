import DashboardView from "./Dashboard_View";
import moment from "moment";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useMarket from "../../hooks/useMarket";

// import useSWR from "swr";

type Props = {};

export type SignedResponse = {
  owner: string;
  data: MeetResponse;
  signature: string;
  hash: string;
}

export type MeetResponse = {
  nonce: string,
  created: number,
  expires: number,
  meetings: Meet[]
}

export type Meet = {
  id: string;
  name: string;
  location: string;
};

const Dashboard: React.FC<Props> = () => {
  // const response: SignedResponse;
  
  // default
  const _meets: Meet[] = [];

  const [{ data: accountData }] = useAccount({
    fetchEns: true
  });

  const connected = accountData !== undefined;

  const { inPlay, numberOfBets } = useMarket();
  const api = useApi();
  const [meetings, setMeetings] = useState<Meet[]>(_meets);

  const load = async () => {
    const response: SignedResponse = await api.getMeetings();
    console.log("results");
    console.log(response.data.meetings);
    setMeetings(response.data.meetings);
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

  return <DashboardView asLocaltime={asLocaltime} meets={meetings} inPlay={inPlay} numberOfBets={numberOfBets} connected={connected} />;
};

export default Dashboard;
