import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import RunnerTable from "../../../components/RunnerTable/RunnerTable";
import useApi from "../../../hooks/useApi";
import { Runner } from "../../../types";
import BackLogic from "../../HorseRace/components/Back/Back_Logic";

const getMockRunners = () => {
  return Array.from({ length: 5 }, () => undefined);
};
const MelbourneCup = () => {
  const api = useApi();
  const [melbCupRunners, setMelbCupRunners] = useState<Runner[]>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRunner, setSelectedRunner] = useState<Runner>();

  useEffect(() => {
    const loadMelbCupRunners = async () => {
      const response = await api.getMelbourneCupRunners();
      setMelbCupRunners(response);
    };

    loadMelbCupRunners();
  }, [api]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const onClickRunner = (runner?: Runner) => {
    if (!runner) return;
    setSelectedRunner(runner);
    openDialog();
  };

  return (
    <div>
      <MelbourneCupBackModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        runner={selectedRunner}
      />
      <h3 className="text-lg mb-3 font-medium text-gray-900">Melbourne Cup</h3>
      <RunnerTable
        runners={melbCupRunners || getMockRunners()}
        onClickRunner={onClickRunner}
      />
    </div>
  );
};

export default MelbourneCup;

type MelbourneCupBackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  runner?: Runner;
};

const MelbourneCupBackModal = ({
  isOpen,
  onClose,
  runner
}: MelbourneCupBackModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <BackLogic runner={runner} />
    </Modal>
  );
};
