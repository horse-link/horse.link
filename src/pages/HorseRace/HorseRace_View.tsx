import { PageLayout } from "../../components";
import moment from "moment";
import { Runner } from "../../types";
import BackLogic from "./components/Back/Back_Logic";
import Modal from "../../components/Modal";
import RunnerTable from "../../components/RunnerTable/RunnerTable";

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
      <div className="flex flex-col gap-6">
        <div className="flex p-2 shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg justify-around">
          <h1>Track: {track}</h1>
          <h1>Race #: {raceNumber}</h1>
          <h1>Date: {moment().format("DD-MM-YY")}</h1>
        </div>
        <RunnerTable runners={runners} onClickRunner={onClickRunner} />
      </div>
    </PageLayout>
  );
};

export default HorseRaceView;

type BackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  runner?: Runner;
  marketBalance?: string | undefined;
};

const BackModal = ({
  isOpen,
  onClose,
  runner,
  marketBalance
}: BackModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <BackLogic runner={runner} marketBalance={marketBalance} />
    </Modal>
  );
};
