import DashboardView from "./Dashboard_View";
import moment from "moment";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
import useMarket from "../../hooks/useMarket";
import { Meet, Race, SignedMeetingsResponse } from "../../types/index";

const getMockMeets = (): Meet[] => {
  const mockRace: Race[] = Array.from({ length: 10 }, (_, i) => ({
    number: i,
    name: ""
  }));
  return Array.from({ length: 5 }, (_, i) => ({
    id: `mock${i}`,
    name: "",
    location: "",
    races: mockRace
  }));
};

const Dashboard: React.FC = () => {
  const { inPlay, numberOfBets } = useMarket();
  const api = useApi();
  const [response, setResponse] = useState<SignedMeetingsResponse>();

  useEffect(() => {
    const load = async () => {
      const response: SignedMeetingsResponse = await api.getMeetings();
      setResponse(response);
    };
    load();
  }, [api]);

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
      meets={response?.data.meetings || getMockMeets()}
      inPlay={inPlay}
      numberOfBets={numberOfBets}
      signature={response?.signature}
      owner={response?.owner}
    />
  );
};

export default Dashboard;
