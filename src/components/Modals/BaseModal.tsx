import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import classNames from "classnames";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  isLarge?: boolean;
};

export const BaseModal: React.FC<Props> = ({
  isOpen,
  onClose,
  children,
  isLarge
}) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
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
            <Dialog.Panel className="transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div className="relative -mb-6 flex w-full justify-end">
                <button
                  className="text-gray-300 focus:outline-none hover:text-gray-700"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
              <div
                className={classNames({
                  "w-auto max-w-full lg:w-[40rem]": !!isLarge,
                  "w-[75vw] lg:w-[28rem]": !isLarge
                })}
              >
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);
