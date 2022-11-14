import { Switch } from "@headlessui/react";

type Props = {
  enabled: boolean;
  onChange: (isEnable: boolean) => void;
};
const MyBetsToggle = ({ enabled, onChange }: Props) => {
  return (
    <div className="flex gap-3 self-end justify-self-end">
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${enabled ? "bg-blue-600" : "bg-gray-200"}
          relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-6" : "translate-x-1"}
            inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
      <div>My Bets</div>
    </div>
  );
};

export default MyBetsToggle;
