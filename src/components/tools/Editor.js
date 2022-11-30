import { Disclosure } from "@headlessui/react";
import {
  ChevronRightIcon,
  CodeBracketSquareIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

import useAuth from "hooks/useAuth";

import Size from "./Size";

const Editor = ({ options, setOptions }) => {
  const { user } = useAuth();

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="w-full" disabled={!user?.isPro}>
            <div className="grid grid-cols-[180px,2em,1fr] w-full">
              <div className="flex items-center space-x-2">
                <CodeBracketSquareIcon className="h-6 w-6 text-[#A0A0A0]" />

                <h3 className="text-sm text-gray-400">Editor</h3>
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
              {/* editor size */}
              <Size
                options={options}
                setOptions={setOptions}
                label="Editor size"
              />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Editor;
