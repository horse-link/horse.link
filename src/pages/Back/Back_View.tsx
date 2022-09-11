import { PageLayout } from "../../components";
import { Back } from "../../types";

type Props = {
  back: Back
};

const BackView: React.FC<Props> = (props: Props) => {

  const { back } = props;
  // const { track, number } = useParams();

  return (
    <PageLayout requiresAuth={false}>
      <div className="flex mb-6 p-2 shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg justify-around">
        <h1>Something {back.odds}</h1>
        <p>Signature {back.signature}</p>
        <form>

        </form>
      </div>
    </PageLayout>
  );
};

export default BackView;
