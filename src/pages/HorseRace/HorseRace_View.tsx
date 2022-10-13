import { PageLayout } from "../../components";
import moment from "moment";
import { Runner } from "../../types";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import BackLogic from "../Back/Back_Logic";

type Props = {
  track: string;
  raceNumber: number;
  runners: Runner[];
  onClickRunner: (runner: Runner) => void;
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
                    return (
                      <tr
                        className="cursor-pointer hover:bg-gray-100"
                        key={runner.number}
                        onClick={() => onClickRunner(runner)}
                      >
                        <td className="px-1 py-4 whitespace-nowrap bg-gray-200">
                          {runner.number}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {runner.name} ({runner.barrier})
                          <br />
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">NA</td>

                        <td className="px-2 py-4 whitespace-nowrap">
                          {runner.odds / 1000}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">NA</td>
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
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-152 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <BackLogic runner={runner} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
