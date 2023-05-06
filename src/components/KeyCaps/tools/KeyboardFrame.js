import { Popover } from "@headlessui/react";
import {
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Design from "../design/design";
import { KeyboardIcon } from "ui/icons";

const KeyboardFrame = ({ themeSelected, setThemeSelected, defaultKeys }) => {
  return (
    <div className="grid w-full grid-cols-[180px,2em,1fr]">
      <div className="flex items-center space-x-2">
        <KeyboardIcon />

        <h3 className="text-sm text-white">Keyboard Style</h3>
      </div>

      {/* tip */}
      <div className="relative">
        <QuestionMarkCircleIcon className="h-6 w-6 cursor-pointer text-white [&~div]:hover:block" />
        <div className="absolute top-full left-1/2 z-50 hidden w-44 -translate-x-1/2 transform rounded-md bg-dark/40 p-2 text-center shadow-md backdrop-blur-sm hover:block">
          <p className="text-sm text-white">
            Simulates the edit in Keys Style.
          </p>
        </div>
      </div>

      <Popover className="relative justify-self-end">
        {({ open }) => (
          <>
            <Popover.Button>
              <ChevronRightIcon
                className={`${
                  open ? "rotate-90 transform" : ""
                } h-5 w-5 text-white`}
              />
            </Popover.Button>

            <Popover.Panel className="absolute top-full right-0 z-50 mt-2 w-72 rounded-md  bg-dark/40 p-4 shadow-md backdrop-blur-md">
              <div className="grid grid-cols-1 gap-4">
                <article className="custom-scrollbar max-h-[680px] overflow-y-auto overflow-x-hidden rounded-md bg-bgDark p-4">
                  <div className="flex h-full flex-col space-y-4">
                    <Design
                      className="col-span-full md:col-span-1"
                      themeSelected={themeSelected}
                      setSelected={setThemeSelected}
                      value={defaultKeys}
                    />
                  </div>
                </article>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
};

export default KeyboardFrame;
