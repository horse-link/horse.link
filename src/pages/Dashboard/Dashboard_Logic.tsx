import DashboardView from "./Dashboard_View";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import api from "../../apis/Api";
import { WalletModalContext } from "../../providers/WalletModal";
import { useAccount } from "wagmi";
import { Meet, Race, SignedMeetingsResponse } from "../../types/meets";

const getMockMeets = (): Meet[] => {
  const mockRace: Race[] = Array.from({ length: 15 }, (_, i) => ({
    number: i,
    name: "",
    status: "Normal",
    results: [9, 1, 2, 7]
  }));
  return Array.from({ length: 5 }, (_, i) => ({
    id: `mock${i}`,
    name: "",
    location: "",
    date: "",
    races: mockRace
  }));
};

const Dashboard: React.FC = () => {
  const [response, setResponse] = useState<SignedMeetingsResponse>();
  const [myPlayEnabled, setMyPlayEnabled] = useState(false);
  const { openWalletModal } = useContext(WalletModalContext);
  const { isConnected } = useAccount();

  useEffect(() => {
    const loadMeetings = async () => {
      const response = await api.getMeetings();
      setResponse(response);
    };

    loadMeetings();
  }, []);

  useEffect(() => {
    if (myPlayEnabled && !isConnected) {
      openWalletModal();
    }
  }, [myPlayEnabled, isConnected]);

  const asLocaltime = (raceTime: number) => {
    const _time = moment.utc(raceTime).diff(moment(), "h");
    if (Date.now() / 1000 > moment.utc(raceTime).unix()) {
      return "Completed";
    }

    return `${_time.toString()} hr`;
  };

  const onMyPlayToggle = () => setMyPlayEnabled(prev => !prev);

  return (
    <DashboardView
      asLocaltime={asLocaltime}
      meets={response?.data.meetings || getMockMeets()}
      signature={response?.signature}
      owner={response?.owner}
      myPlayEnabled={myPlayEnabled}
      onMyPlayToggle={onMyPlayToggle}
    />
  );
};

export default Dashboard;
