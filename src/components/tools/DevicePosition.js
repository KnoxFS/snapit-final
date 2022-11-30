import { Disclosure, RadioGroup } from "@headlessui/react";
import { useRef } from "react";

import { SizeIcon } from "ui/icons";

import {
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import useDrag from "hooks/useDrag";

const DevicePosition = ({ options, setOptions }) => {
  const positionRef = useRef(null);

  const { dragStart, dragStop, dragMove } = useDrag();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full">
            <div className="grid grid-cols-[180px,2em,1fr] w-full">
              <div className="flex items-center space-x-2">
                <SizeIcon className="h-6 w-6 text-[#A0A0A0]" />

                <h3 className="text-sm text-gray-400">Device position</h3>
              </div>

              {/* tip */}
              <div className="relative">
                <QuestionMarkCircleIcon className="w-6 h-6 text-white cursor-pointer [&~div]:hover:block" />

                <div className="absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44">
                  <p className="text-sm text-white">
                    Sets the position of the device.
                  </p>
                </div>
              </div>

              <ChevronRightIcon
                className={`${
                  open ? "rotate-90 transform" : ""
                } h-5 w-5 text-gray-500 justify-self-end`}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel
            ref={positionRef}
            onMouseDown={dragStart}
            onMouseUp={dragStop}
            onMouseLeave={dragStop}
            onMouseMove={(e) =>
              dragMove(e, (diff) => (positionRef.current.scrollLeft += diff))
            }
            className="w-full overflow-x-scroll custom-scrollbar-sm"
          >
            <RadioGroup
              className="p-2 flex items-center space-x-2 w-max"
              value={options.position}
              onChange={(value) => setOptions({ ...options, position: value })}
            >
              <RadioGroup.Label className="sr-only">
                Device Position
              </RadioGroup.Label>

              <RadioGroup.Option
                as="button"
                value="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                Center
              </RadioGroup.Option>

              <RadioGroup.Option
                as="button"
                value="top-1/2 left-0 -translate-x-1/2 -translate-y-1/2"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                Mid Left
              </RadioGroup.Option>

              <RadioGroup.Option
                as="button"
                value="top-1/2 right-0 translate-x-1/2 -translate-y-1/2"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                Mid Right
              </RadioGroup.Option>
            </RadioGroup>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default DevicePosition;
