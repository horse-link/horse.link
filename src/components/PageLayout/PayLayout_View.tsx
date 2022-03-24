import classnames from "classnames";
import { Link } from "react-router-dom";
import { Loader } from "..";
import { Disclosure } from "@headlessui/react";
import {
  MenuIcon,
  XIcon,
  UserCircleIcon
} from "@heroicons/react/outline";

const navigation = [
  { name: "Dashboard", path: "/dashboard" },
];

type Props = {
  loading: boolean;
  currentPath: string;
};

const PageLayoutView: React.FC<Props> = props => {
  if (props.loading) {
    return (
      <div className="min-h-screen flex bg-white">
        <div className="m-auto">
          <Loader className="text-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-white border-b border-gray-200">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center"></div>
                  <div className="hidden sm:-my-px sm:flex sm:space-x-8">
                    {navigation.map(item => {
                      const active = item.path === props.currentPath;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={classnames(
                            {
                              "border-indigo-500 text-gray-900": active,
                              "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700": !active
                            },

                            "inline-flex items-center px-1 pt-1 border-b-4 text-sm font-medium"
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="-mr-2 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navigation.map(item => {
                  const active = item.path === props.currentPath;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={classnames(
                        {
                          "bg-indigo-50 border-indigo-500 text-indigo-700": active,
                          "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800": !active
                        },
                        "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <UserCircleIcon
                      className="block h-6 w-6 hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageLayoutView;
