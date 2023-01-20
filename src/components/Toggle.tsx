import { Switch } from "@headlessui/react";
import classnames from "classnames";

type Props = {
  enabled: boolean;
  onChange: () => void;
};

export const Toggle: React.FC<Props> = ({ enabled, onChange }) => (
  <Switch
    checked={enabled}
    onChange={onChange}
    className={classnames(
      "relative inline-flex h-6 w-11 items-center rounded-full",
      {
        "bg-indigo-600": enabled,
        "bg-gray-200": !enabled
      }
    )}
  >
    <span className="sr-only">Use setting</span>
    <span
      aria-hidden="true"
      className={`${enabled ? "translate-x-6" : "translate-x-1"}
            inline-block h-4 w-4 transform rounded-full bg-white transition`}
    />
  </Switch>
);
