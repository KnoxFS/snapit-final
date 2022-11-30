import { Joystick } from "react-joystick-component";

import { Disclosure } from "@headlessui/react";

import { LanternIcon } from "ui/icons";

import {
  QuestionMarkCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import useAuth from "hooks/useAuth";

const Tilt = ({ proMode, onTiltMove, setManualTiltAngle }) => {
  const { user } = useAuth();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full" disabled={!user?.isPro}>
            <div className="grid grid-cols-[180px,2em,1fr] w-full">
              <div className="flex items-center space-x-2">
                <LanternIcon className="h-6 w-6 text-[#A0A0A0]" />

                <h3 className="text-sm text-gray-400">Tilt</h3>
              </div>

              {/* tip */}
              <div className="relative">
                <QuestionMarkCircleIcon className="w-6 h-6 text-white cursor-pointer [&~div]:hover:block" />

                <div className="absolute top-full left-1/2 bg-dark/40 backdrop-blur-sm p-2 rounded-md shadow-md z-50 transform -translate-x-1/2 hidden hover:block w-44">
                  <p className="text-sm text-white">
                    Sets a 3D effect to the screenshot.
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

          <Disclosure.Panel className="w-full overflow-x-scroll scrollbar-none">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400 w-[50%]">
                Move around with the joystick to tilt the screenshot.
              </p>

              {/* Reset */}
              <button
                onClick={() => setManualTiltAngle([0, 0])}
                className="mr-4 text-sm text-green-500"
              >
                Reset
              </button>

              <Joystick
                size={40}
                baseColor="#4ade80"
                stickColor="#232323"
                disabled={!proMode}
                move={onTiltMove}
              />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Tilt;
