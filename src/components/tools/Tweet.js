import { Disclosure, Switch } from "@headlessui/react";
import {
  ChevronRightIcon,
  QuestionMarkCircleIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/outline";

import useAuth from "hooks/useAuth";

import Size from "./Size";

const Tweet = ({ options, setOptions }) => {
  const { user } = useAuth();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full" disabled={!user?.isPro}>
            <div className="grid grid-cols-[180px,2em,1fr] w-full">
              <div className="flex items-center space-x-2">
                <Bars3BottomLeftIcon className="h-6 w-6 text-[#A0A0A0]" />

                <h3 className="text-sm text-gray-400">Tweet</h3>
              </div>

              {/* tip */}
              <div className="relative">
                <QuestionMarkCircleIcon className="w-6 h-6 text-white cursor-pointer [&~div]:hover:block" />

                <div className="absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44">
                  <p className="text-sm text-white">Edit tweet content.</p>
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

          <Disclosure.Panel className="w-full">
            <div className="grid grid-cols-2">
              {/* tweet size */}
              <Size
                options={options}
                setOptions={setOptions}
                label="Tweet size"
              />

              {/* switch metrics */}
              <div className="flex flex-col text-white">
                <p className="text-sm mb-2">Show metrics</p>
                <Switch
                  checked={options?.tweet.metrics.show || false}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      tweet: {
                        ...options.tweet,
                        metrics: {
                          ...options.tweet.metrics,
                          show: !options.tweet.metrics.show,
                        },
                      },
                    })
                  }
                  className={`${
                    options.tweet.metrics.show ? "bg-green-400" : "bg-[#212121]"
                  }
          relative inline-flex h-[20px] w-[52px] items-center shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 justify-self-end`}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      options.tweet.metrics.show
                        ? "translate-x-8"
                        : "translate-x-[3px]"
                    }
            pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>

              {/* switch date */}
              <div className="flex flex-col text-white">
                <p className="text-sm mb-2">Show date/time</p>
                <Switch
                  checked={options?.tweet.showDate || false}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      tweet: {
                        ...options.tweet,
                        showDate: !options.tweet.showDate,
                      },
                    })
                  }
                  className={`${
                    options.tweet.showDate ? "bg-green-400" : "bg-[#212121]"
                  }
          relative inline-flex h-[20px] w-[52px] items-center shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 justify-self-end`}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      options.tweet.showDate
                        ? "translate-x-8"
                        : "translate-x-[3px]"
                    }
            pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Tweet;
