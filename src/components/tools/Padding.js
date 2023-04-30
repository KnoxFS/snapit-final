import { Disclosure, RadioGroup } from "@headlessui/react";
import { useRef } from "react";

import {
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import useDrag from "hooks/useDrag";
import { PaddingIcon } from "ui/icons";

const Padding = ({ options, setOptions }) => {
  const paddingRef = useRef(null);

  const { dragStart, dragStop, dragMove } = useDrag();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full">
            <div className="grid grid-cols-[3fr,1fr] w-full">
              <div className="flex items-center space-x-2">
                <PaddingIcon className="h-6 w-6 text-[#A0A0A0]" />

                <h3 className="text-sm text-white">Padding</h3>
              </div>

              <div className="flex justify-around items-center">
                {/* tip */}
                <div className="relative">
                  <QuestionMarkCircleIcon className="w-6 h-6 text-white cursor-pointer [&~div]:hover:block" />
                  <div className="absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44">
                    <p className="text-sm text-white">
                      Sets padding into the container.
                    </p>
                  </div>
                </div>
                <ChevronRightIcon
                  className={`${open ? "rotate-90 transform" : ""
                    } h-5 w-5 text-white justify-self-end`}
                />
              </div>
            </div>
          </Disclosure.Button>

          <Disclosure.Panel
            ref={paddingRef}
            onMouseDown={dragStart}
            onMouseUp={dragStop}
            onMouseLeave={dragStop}
            onMouseMove={(e) =>
              dragMove(e, (diff) => (paddingRef.current.scrollLeft += diff))
            }
            className="w-full overflow-x-scroll custom-scrollbar-sm"
          >
            <RadioGroup
              className="p-2 flex items-center space-x-2 w-max"
              value={options.padding}
              onChange={(value) => setOptions({ ...options, padding: value })}
            >
              <RadioGroup.Label className="sr-only">Padding</RadioGroup.Label>

              <RadioGroup.Option
                as="button"
                value="p-0"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                None
              </RadioGroup.Option>

              <RadioGroup.Option
                as="button"
                value="p-10"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                Small
              </RadioGroup.Option>

              <RadioGroup.Option
                as="button"
                value="p-20"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                Medium
              </RadioGroup.Option>

              <RadioGroup.Option
                as="button"
                value="p-32"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                Large
              </RadioGroup.Option>
            </RadioGroup>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Padding;
