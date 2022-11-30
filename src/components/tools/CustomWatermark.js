import { Disclosure, Switch } from "@headlessui/react";

import {
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import useAuth from "hooks/useAuth";

const CustomWatermark = ({ options, setOptions }) => {
  const { user } = useAuth();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full" disabled={!user?.isPro}>
            <div className="grid grid-cols-[180px,2em,1fr] w-full">
              <div className="flex items-center space-x-2">
                <InformationCircleIcon className="h-6 w-6 text-[#A0A0A0]" />

                <h3 className="text-sm text-gray-400">Watermark</h3>
              </div>

              {/* tip */}
              <div className="relative">
                <QuestionMarkCircleIcon className="w-6 h-6 text-white cursor-pointer [&~div]:hover:block" />

                <div className="absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44">
                  <p className="text-sm text-white">
                    Puts a custom waterkmark.
                  </p>
                </div>
              </div>

              {user?.isPro ? (
                <ChevronRightIcon
                  className={`${
                    open ? "rotate-90 transform" : ""
                  } h-5 w-5 text-gray-500 justify-self-end`}
                />
              ) : (
                <div className="justify-self-end">⚡</div>
              )}
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className="w-full overflow-x-scroll custom-scrollbar-sm">
            <div className="grid grid-cols-2 gap-2">
              <label className="text-white text-sm">
                <p className="mb-2">Text</p>
                <input
                  type="text"
                  placeholder="Enter text"
                  value={options.customWatermark.text}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      customWatermark: {
                        ...options.customWatermark,
                        text: e.target.value,
                      },
                    })
                  }
                  className="w-full py-2 px-4 rounded-md bg-[#212121] outline-none text-white mb-4"
                />
              </label>

              <label className="text-white text-sm">
                <p className="mb-2">Link</p>
                <input
                  type="text"
                  placeholder="Enter text"
                  value={options.customWatermark.link}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      customWatermark: {
                        ...options.customWatermark,
                        link: e.target.value,
                      },
                    })
                  }
                  className="w-full py-2 px-4 rounded-md bg-[#212121] outline-none text-white mb-4"
                />
              </label>

              <label className="text-white text-sm">
                <p className="mb-2">Twitter</p>
                <input
                  type="text"
                  placeholder="Enter text"
                  value={options.customWatermark.twitter}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      customWatermark: {
                        ...options.customWatermark,
                        twitter: e.target.value,
                      },
                    })
                  }
                  className="w-full py-2 px-4 rounded-md bg-[#212121] outline-none text-white mb-4"
                />
              </label>

              <label className="text-white text-sm">
                <p className="mb-2">Instagram</p>
                <input
                  type="text"
                  placeholder="Enter text"
                  value={options.customWatermark.instagram}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      customWatermark: {
                        ...options.customWatermark,
                        instagram: e.target.value,
                      },
                    })
                  }
                  className="w-full py-2 px-4 rounded-md bg-[#212121] outline-none text-white mb-4"
                />
              </label>

              <label className="text-white text-sm">
                <p className="mb-2">LinkedIn</p>
                <input
                  type="text"
                  placeholder="Enter text"
                  value={options.customWatermark.linkedin}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      customWatermark: {
                        ...options.customWatermark,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  className="w-full py-2 px-4 rounded-md bg-[#212121] outline-none text-white mb-4"
                />
              </label>

              <label className="text-white text-sm">
                <p className="mb-2">Github</p>
                <input
                  type="text"
                  placeholder="Enter text"
                  value={options.customWatermark.github}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      customWatermark: {
                        ...options.customWatermark,
                        github: e.target.value,
                      },
                    })
                  }
                  className="w-full py-2 px-4 rounded-md bg-[#212121] outline-none text-white mb-4"
                />
              </label>
            </div>

            <div className="flex justify-between items-center mb-4">
              {/* color */}
              <div className="flex text-sm [&>*]:text-center [&>*]:p-1 [&>*]:border [&>*]:border-gray-500 text-white">
                <button
                  onClick={() =>
                    setOptions({
                      ...options,
                      customWatermark: {
                        ...options.customWatermark,
                        color: "bg-gray-500/20 text-dark",
                      },
                    })
                  }
                  className={`rounded-l-md ${
                    options.customWatermark.color === "bg-gray-500/20 text-dark"
                      ? "bg-green-400 text-black"
                      : ""
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() =>
                    setOptions({
                      ...options,
                      customWatermark: {
                        ...options.customWatermark,
                        color: "bg-gray-500/20 text-white",
                      },
                    })
                  }
                  className={`rounded-r-md ${
                    options.customWatermark.color ===
                    "bg-gray-500/20 text-white"
                      ? "bg-green-400 text-black"
                      : ""
                  }`}
                >
                  White
                </button>
              </div>

              {/* aligment */}
              <div className="flex text-sm [&>*]:text-center [&>*]:p-1 [&>*]:border [&>*]:border-gray-500 text-white">
                <button
                  onClick={() =>
                    setOptions({
                      ...options,
                      customWatermark: {
                        ...options.customWatermark,
                        position: "top-5",
                      },
                    })
                  }
                  className={`rounded-l-md ${
                    options.customWatermark.position === "top-5"
                      ? "bg-green-400 text-black"
                      : ""
                  }`}
                >
                  Top
                </button>
                <button
                  onClick={() =>
                    setOptions({
                      ...options,
                      customWatermark: {
                        ...options.customWatermark,
                        position: "bottom-5",
                      },
                    })
                  }
                  className={`rounded-r-md ${
                    options.customWatermark.position === "bottom-5"
                      ? "bg-green-400 text-black"
                      : ""
                  }`}
                >
                  Bottom
                </button>
              </div>
            </div>

            {/* switch show */}
            <div className="flex items-center text-white space-x-2">
              <p className="text-sm">Show</p>
              <Switch
                checked={options?.customWatermark.show || false}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    customWatermark: {
                      ...options.customWatermark,
                      show: !options.customWatermark.show,
                    },
                  })
                }
                className={`${
                  options.customWatermark.show ? "bg-green-400" : "bg-[#212121]"
                }
relative inline-flex h-[20px] w-[52px] items-center shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 justify-self-end`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    options.customWatermark.show
                      ? "translate-x-8"
                      : "translate-x-[3px]"
                  }
pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default CustomWatermark;
