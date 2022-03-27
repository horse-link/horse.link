import DashboardView from "./Dashboard_View";
import moment from "moment";
import useApi from "../../hooks/useApi";
import { useState } from "react";

type Props = {};

export type Meet = {
  id: string;
  name: string;
  location: string;
};

const Dashboard: React.FC<Props> = () => {
  const meets: Meet[] = [
    {
      id: "1",
      name: "Ipswich",
      location: "QLD",
    },
    {
      id: "2",
      name: "Hawkesbury",
      location: "NSW",
    },
    {
      id: "3",
      name: "Pakenham",
      location: "VIC",
    }
  ];

  const api = useApi();
  const [data, setData] = useState<Meet[]>(meets);

  const load = async () => {
    const results: string[] = await api.getMeetings();
    console.log(results);
    // setData(results);
  };

  load();

  const asLocaltime = (raceTime: number) => {
    const _time = moment.utc(raceTime).diff(moment(), "h");
    if (Date.now() / 1000 > moment.utc(raceTime).unix()) {
      return "Completed";
    }

    return `${_time.toString()} hr`;
  }
  return <DashboardView asLocaltime={asLocaltime} meets={data} />;
};

export default Dashboard;
