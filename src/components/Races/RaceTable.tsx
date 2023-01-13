import { Runner } from "../../types/meets";
import { RaceTableRow } from ".";
import utils from "../../utils";
import { useAccount } from "wagmi";
import { useWalletModal } from "../../providers/WalletModal";

type Props = {
  runners?: Runner[];
  setSelectedRunner: (runner?: Runner) => void;
  setIsModalOpen: (open: boolean) => void;
};

const { isConnected } = useAccount();
const { openWalletModal } = useWalletModal();
const isScratchedRunner = (runner: Runner) =>
  ["LateScratched", "Scratched"].includes(runner.status);

export const RaceTable: React.FC<Props> = ({
  runners,
  setIsModalOpen,
  setSelectedRunner
}) => {
  const openBetRunners =
    runners?.filter(runner => !isScratchedRunner(runner)) ??
    utils.mocks.getMockRunners();
  const scratchedRunners = runners?.filter(isScratchedRunner);

  const openDialog = () => {
    if (!isConnected) return openWalletModal();

    setIsModalOpen(true);
  };
  const onClickRunner = (runner?: Runner) => {
    if (!runner) return;
    setSelectedRunner(runner);
    openDialog();
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-1 py-3 w-10 text-left text-xs font-medium text-gray-500 bg-gray-200 uppercase"
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
                    Form
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {openBetRunners.map(runner => (
                  <RaceTableRow runner={runner} onClick={onClickRunner} />
                ))}
                {scratchedRunners?.map(runner => (
                  <RaceTableRow
                    runner={runner}
                    onClick={onClickRunner}
                    isScratched={true}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
