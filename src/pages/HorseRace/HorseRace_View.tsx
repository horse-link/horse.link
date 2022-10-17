import { PageLayout } from "../../components";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import { Runner } from "../../types";
import BackLogic from "./components/Back/Back_Logic";
import Modal from "../../components/Modal";

type Props = {
  track: string;
  raceNumber: number;
  runners: Runner[] | undefined[];
  onClickRunner: (runner?: Runner) => void;
  isDialogOpen: boolean;
  onCloseDialog: () => void;
  selectedRunner?: Runner;
};

const HorseRaceView: React.FC<Props> = ({
  track,
  raceNumber,
  runners,
  onClickRunner,
  isDialogOpen,
  onCloseDialog,
  selectedRunner
}: Props) => {
  return (
    <PageLayout requiresAuth={false}>
      <BackModal
        isOpen={isDialogOpen}
        onClose={onCloseDialog}
        runner={selectedRunner}
      />
      <div className="flex mb-6 p-2 shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg justify-around">
        <h1>Track: {track}</h1>
        <h1>Race #: {raceNumber}</h1>
        <h1>Date: {moment().format("DD-MM-YY")}</h1>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-1 py-3 text-left text-xs font-medium text-gray-500 bg-gray-200 uppercase"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Runner (Barrier)
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Weight
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Win
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Place
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {runners.map(runner => {
                    const { number, name, barrier, odds } = runner || {};
                    return (
                      <tr
                        className="cursor-pointer hover:bg-gray-100"
                        key={runner?.number}
                        onClick={() => onClickRunner(runner)}
                      >
                        <td className="px-1 py-4 whitespace-nowrap bg-gray-200">
                          {number ?? <Skeleton />}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {name ? (
                            `${name} (${barrier})`
                          ) : (
                            <Skeleton width="10em" />
                          )}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {name ? "NA" : <Skeleton width="2em" />}
                        </td>

                        <td className="px-2 py-4 whitespace-nowrap">
                          {odds ? odds / 1000 : <Skeleton width="2em" />}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {name ? "NA" : <Skeleton width="2em" />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HorseRaceView;

type BackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  runner?: Runner;
};

const BackModal = ({ isOpen, onClose, runner }: BackModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <BackLogic runner={runner} />
    </Modal>
  );
};
