import { useRef } from "react";
import { Disclosure, RadioGroup } from "@headlessui/react";
import { BubbleIcon } from "ui/icons";

import {
  ChevronRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import useDrag from "hooks/useDrag";

const AspectRatio = ({ options, setOptions }) => {
  const sizesRef = useRef(null);

  const { dragStart, dragStop, dragMove } = useDrag();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full">
            <div className="grid grid-cols-[180px,2em,1fr] w-full">
              <div className="flex items-center space-x-2">
                <BubbleIcon />

                <h3 className="text-sm text-gray-400">Size</h3>
              </div>

              {/* tip */}
              <div className="relative">
                <QuestionMarkCircleIcon className="w-6 h-6 text-white cursor-pointer [&~div]:hover:block" />

                <div className="absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44">
                  <p className="text-sm text-white">
                    Aspect ratio is the ratio of the width of an image to its
                    height.
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
            ref={sizesRef}
            onMouseDown={dragStart}
            onMouseUp={dragStop}
            onMouseLeave={dragStop}
            onMouseMove={(e) =>
              dragMove(e, (diff) => (sizesRef.current.scrollLeft += diff))
            }
            className="w-full overflow-x-scroll custom-scrollbar-sm"
          >
            <RadioGroup
              className="p-2 flex items-center space-x-2 w-max"
              value={options.aspectRatio}
              onChange={(value) =>
                setOptions({ ...options, aspectRatio: value })
              }
            >
              <RadioGroup.Label className="sr-only">Size</RadioGroup.Label>

              <RadioGroup.Option
                as="button"
                value="aspect-auto !scale-100"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                Auto
              </RadioGroup.Option>

              <RadioGroup.Option
                as="button"
                value="aspect-[2/1] !scale-95"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                Tweet
              </RadioGroup.Option>

              <RadioGroup.Option
                as="button"
                value="aspect-[6/3] !scale-75"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                Instagram Post
              </RadioGroup.Option>

              <RadioGroup.Option
                as="button"
                value="aspect-[4/3] !scale-75"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                Dibbble
              </RadioGroup.Option>

              <RadioGroup.Option
                as="button"
                value="aspect-[16/9] !scale-100"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                YouTube Video
              </RadioGroup.Option>

              <RadioGroup.Option
                as="button"
                value="aspect-appstore !scale-75"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                App store
              </RadioGroup.Option>

              <RadioGroup.Option
                as="button"
                value="aspect-[16/10] !scale-75"
                className={`border border-gray-400 py-2 px-4 text-sm text-gray-400 rounded-md ui-checked:bg-green-400 ui-checked:text-white ui-checked:border-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400`}
              >
                Product Hunt
              </RadioGroup.Option>
            </RadioGroup>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default AspectRatio;
