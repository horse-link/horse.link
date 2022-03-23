import { Fragment } from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { Loader } from "..";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  MenuIcon,
  XIcon,
  UserCircleIcon
} from "@heroicons/react/outline";

const navigation = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Transactions", path: "/transactions" },
  { name: "Support", path: "/support" }
];

const userNavigation = [
  { name: "Your Profile", path: "/profile" },
  { name: "Settings", path: "/settings" },
  { name: "Sign out", path: "#" }
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
                <div className="hidden sm:ml-6 sm:flex sm:items-center">
                  <button
                    type="button"
                    className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Open user menu</span>
                        <UserCircleIcon
                          className="block h-6 w-6 text-gray-400 hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map(item => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.path}
                                className={classnames(
                                  { "bg-gray-100": active },
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
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
                  <button
                    type="button"
                    className="ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1">
                  {userNavigation.map(item => (
                    <a
                      key={item.name}
                      href={item.path}
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      {item.name}
                    </a>
                  ))}
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
