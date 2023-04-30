import { Popover } from '@headlessui/react'
import {
  ComputerDesktopIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import getTabFrame from "utils/getTabFrame";

const browserFrames = [
  {
    name: "Hidden",
    value: "hidden",
  },
  {
    name: "Mac Light",
    value: "mac_light",
  },
  {
    name: "Mac Dark",
    value: "mac_dark",
  },
  {
    name: "Windows Light",
    value: "windows_light",
  },
  {
    name: "Windows Dark",
    value: "windows_dark",
  },
  {
    name: "Toon",
    value: "toon",
  },
  {
    name: "Silver",
    value: "silver",
  },
  {
    name: "Silver Black",
    value: "silver_black",
  },
];

const BrowserFrame = ({ options, setOptions, whitelist }) => {
  return (
    <div className="grid grid-cols-[3fr,1fr] w-full">
      <div className="flex items-center space-x-2">
        <ComputerDesktopIcon className="h-5 w-5 text-white" />

        <h3 className="text-sm text-white">Browser Frame</h3>
      </div>

      <div className='flex justify-around items-center'>
        {/* tip */}
        <div className="relative">
          <QuestionMarkCircleIcon className="w-6 h-6 text-white cursor-pointer [&~div]:hover:block" />
          <div className="absolute top-full text-center left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44">
            <p className="text-sm text-white">
              Simulates the screenshot in a browser tab.
            </p>
          </div>
        </div>
        <Popover className="relative justify-self-end">
          {({ open }) => (
            <>
              <Popover.Button>
                <ChevronRightIcon
                  className={`${open ? "rotate-90 transform" : ""
                    } h-5 w-5 text-white`}
                />
              </Popover.Button>
              <Popover.Panel className="absolute z-50 top-full mt-2 right-0 bg-dark/40 backdrop-blur-md  p-4 rounded-md shadow-md w-72">
                <div className="grid grid-cols-2 gap-4">
                  {/* render preview */}
                  {browserFrames.map((frame, i) => {
                    const isActive = options.browserBar === frame.value;
                    return (
                      <button
                        className={`${isActive ? "bg-green-400/70" : "bg-gray-400/50"
                          }  w-full rounded-md p-2`}
                        key={i}
                        onClick={() =>
                          setOptions({
                            ...options,
                            browserBar: frame.value,
                          })
                        }
                      >
                        <div className="grid grid-rows-[calc(12px*3),1fr] h-24 w-full relative">
                          {getTabFrame(frame.value)}
                          <div
                            className={`bg-white h-full ${whitelist.includes(frame.value)
                              ? "rounded-md row-span-full z-10"
                              : "rounded-b-md"
                              }`}
                          ></div>
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
    </div>
  );
};

export default BrowserFrame;
