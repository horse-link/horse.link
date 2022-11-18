import DashboardView from "./Dashboard_View";
import moment from "moment";
import { useEffect, useState } from "react";
import { Meet, Race, SignedMeetingsResponse } from "../../types/index";
import api from "../../apis/Api";
import useProtocolStatistics from "../../hooks/data/useProtocolStatistics";

const getMockMeets = (): Meet[] => {
  const mockRace: Race[] = Array.from({ length: 10 }, (_, i) => ({
    number: i,
    name: "",
    status: "Normal",
    results: [9, 1, 2, 7]
  }));
  return Array.from({ length: 5 }, (_, i) => ({
    id: `mock${i}`,
    name: "",
    location: "",
    date: "",
    races: mockRace
  }));
};

const Dashboard: React.FC = () => {
  const [response, setResponse] = useState<SignedMeetingsResponse>();

  const stats = useProtocolStatistics();

  useEffect(() => {
    const loadMeetings = async () => {
      const response = await api.getMeetings();
      setResponse(response);
    };

    loadMeetings();
  }, []);

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
      signature={response?.signature}
      owner={response?.owner}
      stats={stats}
    />
  );
};

export default Dashboard;
