import { Popover } from "@headlessui/react";
import {
  ComputerDesktopIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import getCodeFrame from "utils/getCodeFrame";

const codeFrames = [
  {
    name: "Hidden",
    value: "hidden",
  },
  {
    name: "Mac",
    value: "mac",
  },
  {
    name: "Windows",
    value: "windows",
  },
];

const BrowserFrame = ({ options, setOptions }) => {
  return (
    <div className="grid grid-cols-[180px,2em,1fr] w-full">
      <div className="flex items-center space-x-2">
        <ComputerDesktopIcon className="h-6 w-6 text-[#A0A0A0]" />

        <h3 className="text-sm text-gray-400">Editor Frame</h3>
      </div>

      {/* tip */}
      <div className="relative">
        <QuestionMarkCircleIcon className="w-6 h-6 text-white cursor-pointer [&~div]:hover:block" />

        <div className="absolute top-full text-center left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44">
          <p className="text-sm text-white">Simulates the edit in IDE.</p>
        </div>
      </div>

      <Popover className="relative justify-self-end">
        {({ open }) => (
          <>
            <Popover.Button>
              <ChevronRightIcon
                className={`${
                  open ? "rotate-90 transform" : ""
                } h-5 w-5 text-gray-500`}
              />
            </Popover.Button>

            <Popover.Panel className="absolute z-50 top-full mt-2 right-0 bg-dark/40 backdrop-blur-md  p-4 rounded-md shadow-md w-72">
              <div className="grid grid-cols-2 gap-4">
                {/* render preview */}
                {codeFrames.map((frame, i) => {
                  const isActive = options.frame === frame.value;

                  return (
                    <button
                      className={`${
                        isActive ? "bg-green-400/70" : "bg-gray-400/50"
                      }  w-full rounded-md p-2`}
                      key={i}
                      onClick={() =>
                        setOptions({
                          ...options,
                          frame: frame.value,
                        })
                      }
                    >
                      <div className="grid grid-rows-[32px,1fr] h-24 w-full relative">
                        <div className="w-full p-2 bg-dark rounded-t-md">
                          {getCodeFrame(frame.value)}
                        </div>
                        <div className={`h-full bg-dark rounded-b-md`}></div>
                      </div>

                      <p className="text-xs mt-2 text-white">{frame.name}</p>
                    </button>
                  );
                })}
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
};

export default BrowserFrame;
