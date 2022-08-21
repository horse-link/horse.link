import DashboardView from "./Dashboard_View";
import moment from "moment";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useMarket from "../../hooks/useMarket";
import { Meet, SignedResponse } from "../../types/index";

// import useSWR from "swr";

type Props = {};

const Dashboard: React.FC<Props> = () => {

  // default
  const _meets: Meet[] = [];

  const [{ data: accountData }] = useAccount({
    fetchEns: true
  });

  const connected = accountData !== undefined;

  const { inPlay, numberOfBets } = useMarket();
  const api = useApi();
  const [meetings, setMeetings] = useState<Meet[]>(_meets);
  const [response, setResponse] = useState<SignedResponse>();

  const load = async () => {
    const response: SignedResponse = await api.getMeetings();
    setMeetings(response.data.meetings);
    setResponse(response);
  };

  useEffect(() => {
    load();
  });

  const asLocaltime = (raceTime: number) => {
    const _time = moment.utc(raceTime).diff(moment(), "h");
    if (Date.now() / 1000 > moment.utc(raceTime).unix()) {
      return "Completed";
    }

    return `${_time.toString()} hr`;
  };

  return (
    <DashboardView
      asLocaltime={asLocaltime}
      meets={meetings}
      inPlay={inPlay}
      numberOfBets={numberOfBets}
      connected={connected}
      // hash={response?.hash || ""}
      signature={response?.signature || ""}
      owner={response?.owner || ""}
    />
  );
};

export default Dashboard;
