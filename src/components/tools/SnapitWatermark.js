import { Switch } from "@headlessui/react";

import {
  PaintBrushIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import useAuth from "hooks/useAuth";

const SnapitWatermark = ({ options, setOptions, proMode }) => {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-[180px,2em,1fr] w-full items-center">
      <div className="flex items-center space-x-2">
        <PaintBrushIcon className="h-6 w-6 text-[#A0A0A0]" />

        <h3 className="text-sm text-gray-400">Snapit Watermark</h3>
      </div>
      {/* tip */}
      <div className="relative">
        <QuestionMarkCircleIcon className="w-6 h-6 text-white cursor-pointer [&~div]:hover:block" />

        <div className="absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44">
          <p className="text-sm text-white text-center">
            Website's watermark will be added to the screenshot.
          </p>
        </div>
      </div>

      {!proMode && <div className="justify-self-end">⚡</div>}

      {proMode && (
        <Switch
          checked={options?.watermark || false}
          onChange={(e) => {
            if (!user?.isPro) {
              toast.error("You need to be a pro member to use this feature");
              return;
            }

            setOptions({
              ...options,
              watermark: !options?.watermark,
            });
          }}
          className={`${options?.watermark ? "bg-green-400" : "bg-[#212121]"}
         relative inline-flex h-[20px] w-[52px] items-center shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 justify-self-end`}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`${
              options?.watermark ? "translate-x-8" : "translate-x-[3px]"
            }
           pointer-events-none inline-block h-[15px] w-[15px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      )}
    </div>
  );
};

export default SnapitWatermark;
