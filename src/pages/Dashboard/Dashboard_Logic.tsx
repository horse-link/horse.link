import DashboardView from "./Dashboard_View";
import moment from "moment";

type Props = {};

const Dashboard: React.FC<Props> = () => {

  const asLocaltime = (raceTime: number) => {
    const _time = moment.utc(raceTime).diff(moment(), "h");
    if (Date.now() / 1000 > moment.utc(raceTime).unix()) {
      return "Completed";
    }

    return `${_time.toString()} hr`;
  }
  return <DashboardView asLocaltime={asLocaltime} />;
};

export default Dashboard;
