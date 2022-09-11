import { PageLayout } from "../../components";
// import { useParams } from "react-router-dom";
import moment from "moment";
import { Runner } from "../../types";

type Props = {
  runner: Runner
};

const HorseRaceView: React.FC<Props> = (props: Props) => {

  const { runner } = props;
  // const { track, number } = useParams();

  return (
    <PageLayout requiresAuth={false}>
      <div className="flex mb-6 p-2 shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg justify-around">
        <h1>Something {runner.odds}</h1>
        <form>
        </form>
      </div>
    </PageLayout>
  );
};

export default HorseRaceView;
