import { Fragment } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";

import Account from "./settings/Account";
import Stats from "./settings/Stats";
import Shortcuts from "./settings/Shortcuts";

const Settings = ({ open, setOpen }) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-[70%] h-[70vh] overflow-y-auto custom-scrollbar mx-auto rounded-md bg-[#282828] p-6 text-left shadow-xl">
                <section>
                  <Tab.Group>
                    <Tab.List
                      as="header"
                      className="flex flex-wrap justify-around items-center overflow-x-auto"
                    >
                      <Tab
                        className={({ selected }) =>
                          `text-white py-3 px-6 ${
                            selected ? "bg-green-400 rounded-sm" : ""
                          }`
                        }
                      >
                        Account
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `text-white py-3 px-6 ${
                            selected ? "bg-green-400 rounded-sm" : ""
                          }`
                        }
                      >
                        Stats
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `text-white py-3 px-6 ${
                            selected ? "bg-green-400 rounded-sm" : ""
                          }`
                        }
                      >
                        Shortcuts
                      </Tab>
                    </Tab.List>

                    <Tab.Panels>
                      {/* account */}
                      <Tab.Panel>
                        <Account />
                      </Tab.Panel>
                      {/* stats */}
                      <Tab.Panel>
                        <Stats />
                      </Tab.Panel>
                      {/* shorcuts */}
                      <Tab.Panel>
                        <Shortcuts />
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Settings;
