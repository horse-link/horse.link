import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import QRCode from "qrcode.react";
import { PageLayout } from "../../components";

type Props = {};

const DashboardView: React.FC<Props> = () => {
  const stats = [
    { name: "Total Deposits", stat: "$71,897.87" },
    { name: "Total Borrowed", stat: "$21,829.16" },
    { name: "Collateral to Debt Ratio", stat: "201.19%" }
  ];
  return (
    <PageLayout requiresAuth={true}>
      <div className="mb-6">
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map(item => (
            <div
              key={item.name}
              className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
            >
              <dt className="text-sm font-medium text-gray-500 truncate">
                {item.name}
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {item.stat}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="grid grid-cols-2 gap-4 items-start lg:gap-8">
        <Table />
        <Table />
      </div>
      <Modal />
    </PageLayout>
  );
};

const Table: React.FC = () => {
  const people = [
    {
      name: "BTC",
      title: "0.18284001",
      department: "$10,291.01",
      role: "Admin",
      email: "Bitcoin",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
    },
    {
      name: "BTC",
      title: "0.18284001",
      department: "$10,291.01",
      role: "Admin",
      email: "Bitcoin",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
    }
  ];

  return (
    <div className="sm:col-span-2 lg:col-span-1">
      <h3 className="text-lg mb-3 font-medium text-gray-900">Deposits</h3>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Asset
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Balance
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Current Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Manage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {people.map(person => (
                    <tr key={person.email}>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src="/images/bitcoin.png"
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {person.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {person.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-center whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {person.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {person.department}
                        </div>
                      </td>
                      <td className="text-center px-3 py-4 whitespace-nowrap">
                        $65,000.34
                      </td>
                      <td className="py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex">
                          <span className="block mr-2 font-medium text-indigo-600 hover:text-indigo-500">
                            Withdraw
                          </span>
                          <span className="block ml-2 font-medium text-indigo-600 hover:text-indigo-500">
                            Deposit
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Modal = () => {
  const [open, setOpen] = useState(true);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <QRCode value="123" style={{ margin: "auto" }} />
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Go back to dashboard
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DashboardView;
