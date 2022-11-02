import DashboardView from "./Dashboard_View";
import moment from "moment";
import { useEffect, useState } from "react";
import { Meet, Race, SignedMeetingsResponse } from "../../types/index";
import api from "../../apis/Api";

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
  const [response, setResponse] = useState<SignedMeetingsResponse>();
  const [totalLiquidity, setTotalLiquidity] = useState<number>();
  const [inPlay, setInplay] = useState<number>();
  const [performance, setPerformance] = useState<number>();

  useEffect(() => {
    const loadMeetings = async () => {
      const response = await api.getMeetings();
      setResponse(response);
    };
    const loadLiquidity = async () => {
      const { assets } = await api.getTotalLiquidity();
      setTotalLiquidity(assets);
    };
    const loadInPlay = async () => {
      const { total } = await api.getTotalInPlay();
      setInplay(total);
    };
    const loadPerformance = async () => {
      const { performance } = await api.getTotalPerformance();
      setPerformance(performance);
    };

    loadMeetings();
    loadLiquidity();
    loadInPlay();
    loadPerformance();
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
      liquidity={totalLiquidity}
      inPlay={inPlay}
      performance={performance}
      signature={response?.signature}
      owner={response?.owner}
    />
  );
};

export default Dashboard;
